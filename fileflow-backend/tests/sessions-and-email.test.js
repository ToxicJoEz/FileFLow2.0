import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import express from 'express';
import User from '../src/models/User.js';
import RevokedToken from '../src/models/RevokedToken.js';
import { login, logout, register } from '../src/controllers/auth.controller.js';
import { getMe, updatePassword } from '../src/controllers/user.controller.js';
import { protect } from '../src/middlewares/auth.middleware.js';
import authRoutes from '../src/routes/auth.routes.js';
import { errorHandler } from '../src/middlewares/error.middleware.js';
import { registerSchema, loginSchema } from '../src/validations/auth.validation.js';
import { signSession } from '../src/utils/session.js';

// Database calls are stubbed; nothing connects to MongoDB.
process.env.JWT_SECRET = 'test-only-secret-never-used-for-production';
process.env.JWT_EXPIRES_IN = '1h';
const ID = '507f1f77bcf86cd799439011';
const invoke = (handler, req) => new Promise((resolve, reject) => {
  const res = { statusCode: 200, status(code) { this.statusCode = code; return this; },
    json(body) { resolve({ status: this.statusCode, body: JSON.parse(JSON.stringify(body)) }); return this; } };
  handler(req, res, (err) => (err ? reject(Object.assign(err, { status: res.statusCode })) : resolve({ next: true })));
});
const bearer = (token) => ({ headers: { authorization: `Bearer ${token}` } });

test('tokens carry a session id and the user token version', () => {
  const decoded = jwt.verify(signSession({ _id: ID, tokenVersion: 3 }), process.env.JWT_SECRET);
  assert.equal(decoded.tv, 3);
  assert.match(decoded.jti, /^[0-9a-f-]{36}$/);
});

test('sign out revokes that token; protect and getMe then reject it', async (t) => {
  const user = new User({ _id: ID, name: 'T', email: 't@example.com', password: 'x' });
  t.mock.method(User, 'findById', async () => user);
  const revoked = new Set();
  t.mock.method(RevokedToken, 'updateOne', async (filter) => { revoked.add(filter.jti); });
  t.mock.method(RevokedToken, 'exists', async (filter) => (revoked.has(filter.jti) ? { _id: 1 } : null));
  const token = signSession(user);
  const other = signSession(user); // e.g. the desktop app, still signed in
  assert.deepEqual(await invoke(protect, bearer(token)), { next: true });
  assert.equal((await invoke(logout, bearer(token))).status, 200);
  await assert.rejects(invoke(protect, bearer(token)), (err) => err.status === 401 && /session has ended/.test(err.message));
  assert.equal((await invoke(getMe, bearer(token))).body.data, null);
  assert.deepEqual(await invoke(protect, bearer(other)), { next: true }, 'other devices stay signed in');
});

test('logout without a token, or with an old token without an id, still succeeds', async () => {
  assert.equal((await invoke(logout, { headers: {} })).status, 200);
  const legacy = jwt.sign({ id: ID }, process.env.JWT_SECRET);
  assert.equal((await invoke(logout, bearer(legacy))).status, 200);
});

test('changing the password ends every older session and returns a fresh token', async (t) => {
  const user = new User({ _id: ID, name: 'T', email: 't@example.com', password: 'old-password' });
  user.matchPassword = async () => true;
  user.save = async () => user;
  t.mock.method(RevokedToken, 'exists', async () => null);
  const before = signSession(user);
  const legacy = jwt.sign({ id: ID }, process.env.JWT_SECRET); // issued before this change
  t.mock.method(User, 'findById', () => ({ select: async () => user }));
  const result = await invoke(updatePassword, { user: { id: ID }, body: { currentPassword: 'old-password', newPassword: 'new-password' } });
  assert.equal(user.tokenVersion, 1);
  assert.ok(result.body.token);
  t.mock.method(User, 'findById', async () => user);
  for (const old of [before, legacy]) await assert.rejects(invoke(protect, bearer(old)), (err) => err.status === 401);
  assert.deepEqual(await invoke(protect, bearer(result.body.token)), { next: true });
});

test('emails are trimmed and lowercased, and long endings are accepted', () => {
  const parsed = registerSchema.parse({ body: { name: ' Person ', email: '  Someone@Example.INFO ', password: 'secret1' } });
  assert.equal(parsed.body.email, 'someone@example.info');
  assert.equal(loginSchema.parse({ body: { email: 'A@B.Agency', password: 'x' } }).body.email, 'a@b.agency');
  for (const email of ['a@b.tech', 'first.last@sub.example.store', 'x+tag@example.agency', 'a@b.co']) {
    assert.equal(new User({ name: 'P', email, password: 'secret1' }).validateSync()?.errors?.email, undefined, email);
  }
  assert.ok(new User({ name: 'P', email: 'not-an-email', password: 'secret1' }).validateSync().errors.email);
  assert.equal(new User({ name: 'P', email: ' MiXed@Example.COM ', password: 'secret1' }).email, 'mixed@example.com');
});

test('register refuses an email that exists with different capitals; login finds legacy mixed-case accounts', async (t) => {
  const legacy = new User({ _id: ID, name: 'T', password: 'x' });
  legacy.set('email', 'Old@Example.com', { strict: false });
  const queries = [];
  t.mock.method(User, 'findOne', (query) => {
    queries.push(query);
    const value = query.email instanceof RegExp && query.email.test('Old@Example.com') ? legacy : null;
    const promise = Promise.resolve(value);
    promise.select = async () => value;
    return promise;
  });
  await assert.rejects(invoke(register, { body: { name: 'Again', email: 'old@example.com', password: 'secret1' } }), /already exists/);
  legacy.matchPassword = async () => true;
  legacy.save = async () => legacy;
  const result = await invoke(login, { body: { email: 'old@example.com', password: 'x' } });
  assert.equal(result.status, 200);
  assert.equal(queries[0].email, 'old@example.com', 'exact lowercase match is tried first');
});

test('failed sign-ins are limited per email, successes do not count', async (t) => {
  t.mock.method(User, 'findOne', () => { const p = Promise.resolve(null); p.select = async () => null; return p; });
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use(errorHandler);
  const server = app.listen(0);
  t.after(() => server.close());
  const url = `http://127.0.0.1:${server.address().port}/api/auth/login`;
  const attempt = (email, ip) => fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify({ email, password: 'wrong' }) });
  const statuses = [];
  for (let i = 0; i < 11; i++) statuses.push((await attempt(i % 2 ? 'Victim@Example.com' : 'victim@example.com', `10.0.0.${i + 1}`)).status);
  assert.deepEqual(statuses.slice(0, 10), Array(10).fill(401));
  const blocked = await attempt('victim@example.com', '10.0.1.1');
  assert.equal(statuses[10], 429, 'the 11th failure for the same email is blocked, whatever the IP or capitals');
  assert.equal(blocked.status, 429);
  assert.match((await blocked.json()).message, /Too many failed sign-in attempts/);
  assert.equal((await attempt('someone-else@example.com', '10.0.2.1')).status, 401, 'other accounts are unaffected');
});
