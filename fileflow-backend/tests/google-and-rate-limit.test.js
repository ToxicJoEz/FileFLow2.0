import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import User from '../src/models/User.js';
import { googleLogin, allowedGoogleClientIds } from '../src/controllers/auth.controller.js';
import app, { rateLimitKey } from '../src/app.js';

// Google and MongoDB are stubbed; nothing leaves the test process.
process.env.JWT_SECRET = 'test-only-secret-never-used-for-production';
process.env.JWT_EXPIRES_IN = '1h';
const FILEFLOW_CLIENT = '616866655772-3ofcr0nl0ihqp36e1df2k4k9aijb4vc8.apps.googleusercontent.com';

const invoke = (handler, req) => new Promise((resolve) => {
  const res = { statusCode: 200, status(code) { this.statusCode = code; return this; },
    json(body) { resolve({ status: this.statusCode, body }); return this; } };
  handler(req, res, (error) => resolve({ status: res.statusCode, error }));
});

const stubGoogle = (t, tokenInfo, profile, tokenOk = true) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    calls.push(String(url));
    if (String(url).includes('tokeninfo')) return { ok: tokenOk, json: async () => tokenInfo };
    return { ok: true, json: async () => profile };
  });
  return calls;
};

const existingUser = () => new User({ _id: '507f1f77bcf86cd799439011', name: 'Test', email: 'test@example.com', handle: 'test1234', password: 'x'.repeat(10) });

test('Google sign-in accepts a token issued to a FileFlow client', async (t) => {
  stubGoogle(t, { aud: FILEFLOW_CLIENT, expires_in: '3500', email: 'test@example.com' }, { email: 'test@example.com', name: 'Test', email_verified: true });
  t.mock.method(User, 'findOne', async () => existingUser());
  const result = await invoke(googleLogin, { body: { accessToken: 'token' } });
  assert.equal(result.status, 200);
  assert.ok(result.body.token);
});

test('Google sign-in rejects a token issued to another app', async (t) => {
  stubGoogle(t, { aud: 'someone-else.apps.googleusercontent.com', azp: 'someone-else.apps.googleusercontent.com', expires_in: '3500' }, { email: 'test@example.com', email_verified: true });
  const findOne = t.mock.method(User, 'findOne', async () => existingUser());
  const result = await invoke(googleLogin, { body: { accessToken: 'token' } });
  assert.equal(result.status, 401);
  assert.match(result.error.message, /not issued for FileFlow/);
  assert.equal(findOne.mock.callCount(), 0, 'no account is looked up for a foreign token');
});

test('Google sign-in rejects invalid tokens, unverified emails and missing tokens', async (t) => {
  stubGoogle(t, { error: 'invalid_token' }, {}, false);
  assert.equal((await invoke(googleLogin, { body: { accessToken: 'bad' } })).status, 401);
  t.mock.restoreAll();
  stubGoogle(t, { aud: FILEFLOW_CLIENT, expires_in: '3500' }, { email: 'test@example.com', email_verified: false });
  const unverified = await invoke(googleLogin, { body: { accessToken: 'token' } });
  assert.equal(unverified.status, 401);
  assert.match(unverified.error.message, /not verified/);
  assert.equal((await invoke(googleLogin, { body: { accessToken: { $ne: null } } })).status, 400);
  assert.equal((await invoke(googleLogin, { body: {} })).status, 400);
});

test('GOOGLE_CLIENT_IDS replaces the default client list', (t) => {
  process.env.GOOGLE_CLIENT_IDS = ' a.apps.googleusercontent.com , b.apps.googleusercontent.com ';
  t.after(() => { delete process.env.GOOGLE_CLIENT_IDS; });
  assert.deepEqual(allowedGoogleClientIds(), ['a.apps.googleusercontent.com', 'b.apps.googleusercontent.com']);
});

test('the app trusts one proxy hop so req.ip is the visitor', () => {
  assert.equal(app.get('trust proxy'), 1);
});

test('rate limits are per verified account, otherwise per IP', () => {
  const token = jwt.sign({ id: '507f1f77bcf86cd799439011' }, process.env.JWT_SECRET);
  assert.equal(rateLimitKey({ headers: { authorization: `Bearer ${token}` }, ip: '1.2.3.4' }), 'user:507f1f77bcf86cd799439011');
  const forged = jwt.sign({ id: '507f1f77bcf86cd799439011' }, 'wrong-secret');
  assert.equal(rateLimitKey({ headers: { authorization: `Bearer ${forged}` }, ip: '1.2.3.4' }), 'ip:1.2.3.4');
  assert.equal(rateLimitKey({ headers: {}, ip: '5.6.7.8' }), 'ip:5.6.7.8');
  // IPv6 visitors are grouped by /56 subnet so rotating addresses does not bypass the limit.
  assert.equal(rateLimitKey({ headers: {}, ip: '2001:db8:abcd:12ff::1' }), rateLimitKey({ headers: {}, ip: '2001:db8:abcd:1200::9' }));
});
