import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import User from '../src/models/User.js';
import AccountSearchStats from '../src/models/AccountSearchStats.js';

test('dashboard statistics require authentication and always use the session account',async t=>{
  process.env.JWT_SECRET='dashboard-test-only-secret';
  const ids=['111111111111111111111111','222222222222222222222222'];
  const lookedUp=[];let empty=false,disabled=false;
  t.mock.method(User,'findById',async id=>({_id:id,id,role:'user',isBanned:disabled}));
  t.mock.method(AccountSearchStats,'findById',id=>{
    lookedUp.push(String(id));
    return {select(fields){assert.ok(fields.includes('-_id'));return this;},lean:async()=>empty?null:{totals:{searches:id===ids[0]?7:2}}};
  });
  const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));
  const base=`http://127.0.0.1:${server.address().port}/api/users/me/statistics`;
  const get=(actor,url=base)=>fetch(url,{headers:actor?{Authorization:'Bearer '+jwt.sign({id:actor},process.env.JWT_SECRET)}:{}});
  try{
    assert.equal((await get()).status,401);assert.equal(lookedUp.length,0);
    const response=await get(ids[0],base+'?actor='+ids[1]);
    assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');
    assert.equal((await response.json()).data.totals.searches,7);assert.equal(lookedUp.at(-1),ids[0]);
    assert.equal((await (await get(ids[1])).json()).data.totals.searches,2);
    empty=true;assert.equal((await (await get(ids[0])).json()).data,null);
    disabled=true;const reads=lookedUp.length;assert.equal((await get(ids[0])).status,403);assert.equal(lookedUp.length,reads);
  }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});
