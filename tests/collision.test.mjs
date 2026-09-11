import test from 'node:test';
import assert from 'node:assert/strict';
import {outcome,collisionTime,stateAt,totals,duration} from '../themes/butterfly/source/sideProject/MPsci/collision/model.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
test('equal masses exchange velocities at contact, including head-on impact',()=>{
 assert.deepEqual(outcome({m1:1,m2:1,u1:2,u2:0}),{v1:0,v2:2});
 assert.deepEqual(outcome({m1:1,m2:1,u1:2,u2:-2}),{v1:-2,v2:2});
});
test('light cart rebounds; heavy cart keeps moving',()=>{
 assert.deepEqual(outcome({m1:1,m2:3,u1:2,u2:0}),{v1:-1,v2:1});
 assert.deepEqual(outcome({m1:3,m2:1,u1:2,u2:0}),{v1:1,v2:3});
});
test('conserves momentum and kinetic energy over all selectable masses and velocities',()=>{
 for(let m1=.5;m1<=5;m1+=.5)for(let m2=.5;m2<=5;m2+=.5)for(let u1=-4;u1<=4;u1+=.5)for(let u2=-4;u2<=4;u2+=.5){
  const config={m1,m2,u1,u2},v=outcome(config),before=totals(config,u1,u2),after=totals(config,v.v1,v.v2);
  near(before.momentum,after.momentum);near(before.energy,after.energy);
 }
});
test('analytic contact has no penetration and remains continuous when scrubbing across collision',()=>{
 const config={m1:3,m2:1,u1:4,u2:-2},hit=collisionTime(config),at=stateAt(config,hit),before=stateAt(config,hit-1e-8),after=stateAt(config,hit+1e-8);
 near(at.x2-at.x1,.8);assert.ok(Math.abs(before.x1-after.x1)<1e-6);assert.equal(before.collided,false);assert.equal(after.collided,true);
 for(let t=0;t<=duration(config);t+=.01){const s=stateAt(config,t);assert.ok(s.x2-s.x1>=.8-1e-9);}
});
test('non-closing carts never collide, with finite states including stationary carts',()=>{
 for(const [u1,u2] of [[0,0],[2,2],[-2,2],[-4,-2]]){
  const config={m1:1,m2:1,u1,u2};assert.equal(collisionTime(config),Infinity);
  const s=stateAt(config,6);assert.equal(s.collided,false);near(s.x1,-3+6*u1);near(s.x2,3+6*u2);
 }
});
