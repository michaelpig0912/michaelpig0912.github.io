import test from 'node:test';
import assert from 'node:assert/strict';
import {imagePosition,isClear,isCentered,improves,missions,vectors,idealFocus,clamp,illumination} from '../themes/butterfly/source/sideProject/MPsci/microscope/model.mjs';

test('a rightward slide move gives same-direction stereo and opposite-direction compound images',()=>{
 assert.deepEqual(imagePosition('stereo',20,-30),{x:20,y:-30});
 assert.deepEqual(imagePosition('compound',20,-30),{x:-20,y:30});
 assert.equal(improves(-40,0,'right'),true); // compound image starts on the right
 assert.equal(improves(-40,0,'left'),false);
 assert.equal(improves(40,0,'left'),true); // stereo image starts on the right
});
test('all six missions can be completed using available five-unit arrow steps and focus controls',()=>{
 for(const task of missions){
  let {x,y}=task;
  assert.equal(isCentered(x,y),false);
  let count=0;
  while(!isCentered(x,y)){
   const dir=x>0?'left':x<0?'right':y>0?'up':'down';
   assert.ok(improves(x,y,dir));
   const [dx,dy]=vectors[dir];x=clamp(x+dx*5,-65,65);y=clamp(y+dy*5,-65,65);
   assert.ok(++count<30,'mission must be reachable');
  }
  if(task.focus){assert.equal(isClear(task.scope,20),false);assert.equal(isClear(task.scope,idealFocus[task.scope]),true);}
 }
});
test('focus is instrument-specific and accepts a small clear band, not a single magic number',()=>{
 assert.equal(isClear('stereo',46),false);
 assert.equal(isClear('compound',46),true);
 assert.equal(isClear('compound',49),true);
 assert.equal(isClear('compound',50),false);
 assert.equal(isCentered(4,4),false);
 assert.equal(isCentered(3,3),true);
});

test('illumination is dark with lamp off and has a useful default for both microscopes',()=>{
 for(const scope of ['stereo','compound']){assert.equal(illumination(scope,0).brightness,0);assert.equal(illumination(scope,0).usable,false);assert.equal(illumination(scope,70).usable,true);}
});
test('closing the condenser aperture trades brightness and resolution for contrast',()=>{
 const small=illumination('compound',70,20),wide=illumination('compound',70,90);
 assert.ok(small.brightness<wide.brightness);assert.ok(small.contrast>wide.contrast);assert.ok(small.diffraction>wide.diffraction);assert.equal(small.usable,false);
 assert.deepEqual(illumination('stereo',70,20),illumination('stereo',70,90));
});
