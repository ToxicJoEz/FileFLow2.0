import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../src/models/User.js';
import { register, googleLogin } from '../src/controllers/auth.controller.js';
import { getMe, updateEmail, updatePassword } from '../src/controllers/user.controller.js';
import { validateRequest } from '../src/middlewares/validateRequest.js';
import { errorHandler } from '../src/middlewares/error.middleware.js';
import { protect } from '../src/middlewares/auth.middleware.js';

// All database/Google calls are stubbed. Never connects to MongoDB or Google.
process.env.JWT_SECRET = 'test-only-secret-never-used-for-production';
process.env.JWT_EXPIRES_IN = '1h';
const invoke = (handler, req) => new Promise((resolve, reject) => {
  const res = { statusCode: 200, status(code) { this.statusCode = code; return this; },
    json(body) { resolve({ status: this.statusCode, body: JSON.parse(JSON.stringify(body)) }); return this; } };
  handler(req, res, reject);
});

test('register and first Google login create a valid accent color', async (t) => {
  t.mock.method(User, 'findOne', async () => null);
  const inputs = [];
  t.mock.method(User, 'create', async (fields) => {
    inputs.push(fields);
    return new User({ ...fields, _id: '507f1f77bcf86cd799439011' });
  });
  t.mock.method(globalThis, 'fetch', async () => ({ ok: true, json: async () => ({name:'Test Person', email:'test@example.com'}) }));
  const registered = await invoke(register, {body:{name:'Test Person', email:'test@example.com', password:'test-password'}});
  const google = await invoke(googleLogin, {body:{accessToken:'test-token'}});
  assert.equal(registered.status, 201);
  assert.equal(google.status, 200);
  for (const input of inputs) assert.match(input.accentColor, /^#[a-f0-9]{6}$/);
  assert.equal(registered.body.user.password, undefined);
});

test('session lookup rejects invalid, deleted and banned accounts', async (t) => {
  const req = {headers:{authorization:'Bearer '+jwt.sign({id:'507f1f77bcf86cd799439011'},process.env.JWT_SECRET)}};
  for (const user of [null, {isDeleted:true}, {isBanned:true}]) {
    const mock = t.mock.method(User, 'findById', async () => user);
    assert.equal((await invoke(getMe, req)).body.data, null);
    mock.mock.restore();
  }
  assert.equal((await invoke(getMe, {headers:{authorization:'Bearer invalid'}})).body.data, null);
});

test('database outage is propagated rather than invalidating the session', async (t) => {
  t.mock.method(User, 'findById', async () => { throw new Error('database unavailable'); });
  const req = {headers:{authorization:'Bearer '+jwt.sign({id:'507f1f77bcf86cd799439011'},process.env.JWT_SECRET)}};
  await assert.rejects(invoke(getMe, req), /database unavailable/);
});

test('email/password update responses never expose selected hashes', async (t) => {
  const user = new User({name:'Test', email:'old@example.com', password:'test-hash'});
  user.matchPassword = async () => true;
  user.save = async () => user;
  t.mock.method(User, 'findById', () => ({select: async () => user}));
  for (const handler of [updateEmail, updatePassword]) {
    const result = await invoke(handler, {user:{id:user.id}, body:{newEmail:'new@example.com', currentPassword:'test', newPassword:'changed-password'}});
    assert.equal(result.body.data.password, undefined);
  }
  assert.equal(user.toJSON().password, undefined);
});

test('Zod invalid requests return a 400 message and validated bodies are applied', () => {
  const schema = z.object({body:z.object({name:z.string().trim().min(2)})});
  const req = {body:{name:'  Person  ', ignored:'strip me'}};
  validateRequest(schema)(req, {}, (err) => assert.equal(err, undefined));
  assert.deepEqual(req.body, {name:'Person'});
  let payload;
  const res = {statusCode:200, status(code){this.statusCode=code; return this;}, json(body){payload=body;}};
  validateRequest(schema)({body:{name:''}}, res, err => errorHandler(err, {}, res, ()=>{}));
  assert.equal(res.statusCode,400);
  assert.equal(payload.success,false);
  assert.equal(typeof payload.message,'string');
});

test('incorrect current passwords are validation failures, not session expiry', async (t) => {
  t.mock.method(User, 'findById', () => ({select:async()=>({matchPassword:async()=>false})}));
  for (const handler of [updateEmail,updatePassword]) {
    let status;
    const error = await new Promise(resolve=>handler({user:{id:'test'},body:{currentPassword:'wrong'}}, {status(code){status=code;return this;}}, resolve));
    assert.equal(status,400);
    assert.match(error.message,/Incorrect current password/);
  }
});

test('protected routes propagate database outages and identify disabled accounts', async (t) => {
  const req = {headers:{authorization:'Bearer '+jwt.sign({id:'507f1f77bcf86cd799439011'},process.env.JWT_SECRET)}};
  let status = 200;
  const res = {status(code){status=code;return this;}};
  let mock = t.mock.method(User,'findById',async()=>{throw new Error('database unavailable');});
  let error = await new Promise(resolve=>protect(req,res,resolve));
  assert.equal(status,200); // global handler will turn an unset success status into 500
  assert.match(error.message,/database unavailable/);
  mock.mock.restore();
  t.mock.method(User,'findById',async()=>({isBanned:true}));
  error = await new Promise(resolve=>protect(req,res,resolve));
  assert.equal(status,403);
  assert.equal(error.code,'ACCOUNT_DISABLED');
});
