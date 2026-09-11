import {names,vectors,directionNames,clamp,imagePosition,idealFocus,isClear,isCentered,improves,missions,illumination} from './model.mjs';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const state = {scope:'compound',x:0,y:0,focus:{stereo:62,compound:20},mode:'explore',mission:0,predicted:false,solved:false,moves:0};
const lighting={stereo:{light:70,aperture:65},compound:{light:70,aperture:65}};
const optics=scope=>illumination(scope,lighting[scope].light,lighting[scope].aperture);
const viewClear=scope=>isClear(scope,state.focus[scope])&&optics(scope).usable;
let updateModel = () => {};
let motionTimer;
const slideScale = () => {const pad=$('#slide-pad'),slide=$('#physical-slide');return {x:Math.max(.15,(pad.clientWidth-slide.offsetWidth-16)/130),y:Math.max(.15,(pad.clientHeight-slide.offsetHeight-66)/130)};};
function showMotion(dx,dy){
 if(Math.hypot(dx,dy)<.001)return;
 const describe=(x,y)=>`${Math.abs(y)>.001?(y<0?'↑ 上':'↓ 下'):''}${Math.abs(x)>.001?(x<0?'← 左':'→ 右'):''}`;
 const p=imagePosition(state.scope,dx,dy);
 $('#hand-motion').textContent=`你推玻片：${describe(dx,dy)}`;
 $('#eye-motion').textContent=`影像移動：${describe(p.x,p.y)}`;
 $('#slide-pad').classList.add('moving');
 clearTimeout(motionTimer);motionTimer=setTimeout(()=>$('#slide-pad').classList.remove('moving'),650);
}
function resetMotion(){clearTimeout(motionTimer);$('#slide-pad').classList.remove('moving');$('#hand-motion').textContent='抓住透明玻片拖動';$('#eye-motion').textContent='紅點移到中央小圈';}

const feedback = (message,success=false) => {$('#feedback').textContent=message;$('#feedback').classList.toggle('success',success);};
function positionText(x,y){return isCentered(x,y)?'中央':`${y < -3?'上':y > 3?'下':''}${x < -3?'左':x > 3?'右':''}方`;}
// Draw the specimen once. Blur its combined image only when focus/aperture changes,
// rather than blurring hundreds of individual paths on every pointer event.
const specimen=document.createElement('canvas');specimen.width=specimen.height=1200;
const specimenCtx=specimen.getContext('2d');
specimenCtx.translate(600,600);specimenCtx.strokeStyle='#73955299';specimenCtx.lineWidth=2;
for(let i=-5;i<=5;i++)for(let j=-7;j<=7;j++){
 specimenCtx.beginPath();specimenCtx.ellipse(i*120+20,j*85+10,56,38,(i+j)*.12,0,Math.PI*2);specimenCtx.stroke();
 specimenCtx.beginPath();specimenCtx.ellipse(i*120+35,j*85+12,9,6,0,0,Math.PI*2);specimenCtx.stroke();
 for(let k=0;k<4;k++){specimenCtx.beginPath();specimenCtx.moveTo(i*120-8+k*5,j*85-7);specimenCtx.lineTo(i*120-8+k*5,j*85+11);specimenCtx.stroke();}
}
specimenCtx.fillStyle='#304f42';specimenCtx.font='bold 170px Georgia,serif';specimenCtx.fillText('e',-107,84);
specimenCtx.fillStyle='#c34f3d';specimenCtx.beginPath();specimenCtx.arc(0,0,10,0,Math.PI*2);specimenCtx.fill();specimenCtx.strokeStyle='#fff9';specimenCtx.lineWidth=3;specimenCtx.stroke();
const prepared=document.createElement('canvas');prepared.width=prepared.height=1200;
const preparedCtx=prepared.getContext('2d');let preparedKey='';
const viewContexts=Object.fromEntries(Object.keys(names).map(scope=>[scope,$(`#${scope}-view`).getContext('2d')]));
const backgrounds=Object.fromEntries(Object.entries(viewContexts).map(([scope,ctx])=>{const bg=ctx.createRadialGradient(275,260,20,300,300,320);bg.addColorStop(0,'#f5f5d9');bg.addColorStop(1,'#cbd9af');return [scope,bg];}));
function drawView(scope){
 const ctx=viewContexts[scope],canvas=ctx.canvas,p=imagePosition(scope,state.x,state.y),optical=optics(scope);
 const blur=Math.max(0,Math.abs(state.focus[scope]-idealFocus[scope])-3)*.32+optical.diffraction;
 const key=`${blur}:${optical.contrast}`;
 if(preparedKey!==key){
  preparedCtx.clearRect(0,0,1200,1200);preparedCtx.save();preparedCtx.globalAlpha=clamp(optical.contrast,0,1);preparedCtx.filter=`blur(${blur}px)`;preparedCtx.drawImage(specimen,0,0);preparedCtx.restore();preparedKey=key;
 }
 ctx.fillStyle=backgrounds[scope];ctx.fillRect(0,0,600,600);
 ctx.save();ctx.translate(300+p.x*3.5,300+p.y*3.5);if(scope==='compound')ctx.rotate(Math.PI);ctx.drawImage(prepared,-600,-600);ctx.restore();
 ctx.fillStyle=`rgba(0,0,0,${1-Math.min(1,optical.brightness)})`;ctx.fillRect(0,0,600,600);
 if(optical.brightness>1){ctx.fillStyle=`rgba(255,255,235,${Math.min(.65,(optical.brightness-1)*.25)})`;ctx.fillRect(0,0,600,600);}
 const text=`紅點在${positionText(p.x,p.y)} · ${optical.brightness<.3?'太暗':optical.brightness>1.7?'太亮':optical.diffraction>0?'光圈過小':isClear(scope,state.focus[scope])?'清楚':'尚未對焦'}`;
 const label=$(`#${scope}-position`);if(label.textContent!==text){label.textContent=text;canvas.setAttribute('aria-label',`${names[scope]}視野：${text}，e 字${scope==='compound'?'旋轉 180 度':'正立'}`);}
}
let renderFrame=0;
function scheduleRender(){if(!renderFrame)renderFrame=requestAnimationFrame(()=>{renderFrame=0;render();});}
function render(){
 if(renderFrame){cancelAnimationFrame(renderFrame);renderFrame=0;}
 drawView(state.scope);
 const scale=drag?drag.scale:slideScale();$('#physical-slide').style.transform=`translate(calc(-50% + ${state.x*scale.x}px),${state.y*scale.y}px)`;
 $$('[data-dial]').forEach(el=>{el.setAttribute('aria-valuenow',state.focus[state.scope]);el.setAttribute('aria-valuetext',`${state.focus[state.scope]}，${viewClear(state.scope)?'影像清楚':'尚未清楚'}`);el.style.setProperty('--dial-angle',`${state.focus[state.scope]*7.2/Number(el.dataset.dial)}deg`);});
 $('#focus-value').textContent=state.focus[state.scope];
 $('#map-name').textContent=names[state.scope];$('#map-compound').toggleAttribute('hidden',state.scope!=='compound');$('#map-stereo').toggleAttribute('hidden',state.scope!=='stereo');
 $('#map-stage').setAttribute('transform',`translate(0,${-(state.focus[state.scope]-idealFocus[state.scope])*.12})`);$('#map-slide').setAttribute('transform',`translate(${state.x*.08},0)`);
 $('#focus-scope').textContent=names[state.scope];$('#clarity').textContent=viewClear(state.scope)?'✓ 影像清楚':!optics(state.scope).usable?'請調整光圈':'尚未對焦';
 $$('[data-scope]').forEach(b=>{const active=b.dataset.scope===state.scope;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);b.disabled=state.mode==='challenge';});
 $$('[data-view]').forEach(el=>{const active=el.dataset.view===state.scope;el.hidden=!active;el.classList.toggle('selected',active);});
 const blocked=state.mode==='challenge'&&(!state.predicted||state.solved);
 $$('[data-dial]').forEach(el=>el.setAttribute('aria-disabled',blocked));
 const light=lighting[state.scope],optical=optics(state.scope);
 for(const id of ['aperture','light-reset'])$('#'+id).disabled=state.mode==='challenge'&&state.solved;
 $('#aperture').value=light.aperture;$('#aperture-value').textContent=`${light.aperture}%`;
 $('#aperture-panel').hidden=state.scope!=='compound';
 $('#aperture-setting').style.setProperty('--opening',`${light.aperture}%`);
 $('#map-light').setAttribute('opacity',Math.min(1,light.light/100));
 $('#map-beam').setAttribute('d',state.scope==='compound'?`M108 110L${112-light.aperture*.2} 87H${112+light.aperture*.2}L116 110Z`:'M142 52L100 78H131Z');
 $('#lighting-note').textContent=light.aperture<35?'光圈太小：視野變暗，細節也會模糊。':light.aperture>85?'光圈較大：視野較亮，但對比變淡。':'光圈適中。試著縮小，觀察細紋與輪廓。';
 $('#scene').setAttribute('aria-label',`${names[state.scope]}三維模型，玻片與調焦同步`);
 updateModel();
}
function selectScope(scope){if(state.mode==='challenge')return;state.scope=scope;resetMotion();feedback(`已切換為${names[scope]}。試著移動玻片，觀察紅點的方向。`);render();}
$$('[data-scope]').forEach(b=>b.onclick=()=>selectScope(b.dataset.scope));
$('#aperture').oninput=e=>{lighting[state.scope].aperture=Number(e.target.value);checkMission();render();};
$('#light-reset').onclick=()=>{lighting[state.scope]={light:70,aperture:65};checkMission();render();};
function checkMission(){
 if(state.mode!=='challenge'||!state.predicted||state.solved)return;
 const task=missions[state.mission];
 if(isCentered(state.x,state.y)&&optics(state.scope).usable&&(!task.focus||viewClear(state.scope))){
  state.solved=true;$('#next').hidden=false;$('#next').textContent=state.mission===missions.length-1?'再挑戰一次 ↺':'下一關 →';
  feedback(state.mission===missions.length-1?'六關完成！你已練習兩種顯微鏡的移片方向與調焦。試著用自己的話解釋：為什麼複式鏡的紅點在右，玻片卻要往右移？':`成功！${names[state.scope]}的影像與玻片${state.scope==='compound'?'反方向':'同方向'}移動。${task.focus?'紅點已置中，影像也清楚了。':'紅點已回到中央。'}`,true);
 }else if(isCentered(state.x,state.y)&&!optics(state.scope).usable){feedback('紅點已在中央，請調整光圈，讓標本細節看得清楚。');}else if(isCentered(state.x,state.y)&&task.focus){feedback('紅點已在中央！接著調焦：轉動旋鈕，直到 e 字與紅點清楚。');}
}
function moveTo(x,y){const old={x:state.x,y:state.y};state.x=clamp(x,-65,65);state.y=clamp(y,-65,65);showMotion(state.x-old.x,state.y-old.y);state.moves++;checkMission();scheduleRender();}
function recordFirstMove(dx,dy){
 if(state.mode!=='challenge'||state.predicted||Math.hypot(dx,dy)<2)return false;
 const dir=Math.abs(dx)>=Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
 const correct=improves(state.x,state.y,dir);state.predicted=true;
 feedback(`第一步向${directionNames[dir]}拖：${correct?'紅點正靠近中央！':'紅點沒有靠近中央，試試另一個方向。'}`);
 $('#mission-instruction').textContent=`把紅點拖到中央${missions[state.mission].focus?'，再轉旋鈕調清楚':''}。`;
 return true;
}
function move(dir){
 if(state.mode==='challenge'&&state.solved)return;
 const [dx,dy]=vectors[dir];recordFirstMove(dx*5,dy*5);moveTo(state.x+dx*5,state.y+dy*5);
}
function focusTo(value){if(state.mode==='challenge'&&(!state.predicted||state.solved))return;state.focus[state.scope]=clamp(value,0,100);checkMission();scheduleRender();}
let wheelRemainder=0,lastWheelTime=0;
function wheelFocus(e){
 if(e.ctrlKey||e.metaKey||!e.deltaY||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
 if(state.mode==='challenge'&&(!state.predicted||state.solved))return;
 e.preventDefault();
 if(e.timeStamp-lastWheelTime>200)wheelRemainder=0;
 lastWheelTime=e.timeStamp;
 const pixels=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?400:1);
 wheelRemainder+=clamp(pixels,-80,80);
 const steps=Math.trunc(wheelRemainder/40);
 if(steps){wheelRemainder-=steps*40;focusTo(state.focus[state.scope]+steps*Number(e.currentTarget.dataset.dial||1));}
}
[...$$('[data-dial]'),...$$('.eyepiece')].forEach(el=>{
 el.addEventListener('wheel',wheelFocus,{passive:false});
 el.addEventListener('mouseleave',()=>{wheelRemainder=0;});
});
$$('[data-dial]').forEach(el=>{
 el.addEventListener('keydown',e=>{
  const delta={ArrowUp:-1,ArrowDown:1,PageUp:-2,PageDown:2}[e.key];
  if(delta!==undefined){e.preventDefault();e.stopPropagation();focusTo(state.focus[state.scope]+delta*Number(el.dataset.dial));}
 });
 let dialDrag=null;
 const dialAngle=e=>{const box=el.getBoundingClientRect();const x=e.clientX-box.left-box.width/2,y=e.clientY-box.top-box.height/2;return Math.hypot(x,y)<10?null:Math.atan2(y,x)*180/Math.PI;};
 el.addEventListener('pointerdown',e=>{
  if(e.button!==0||el.getAttribute('aria-disabled')==='true')return;
  const angle=dialAngle(e);if(angle===null)return;
  e.preventDefault();el.focus({preventScroll:true});dialDrag={id:e.pointerId,angle,remainder:0};el.setPointerCapture(e.pointerId);
 });
 el.addEventListener('pointermove',e=>{
  if(!dialDrag||e.pointerId!==dialDrag.id)return;
  const angle=dialAngle(e);if(angle===null)return;
  const delta=((angle-dialDrag.angle+540)%360)-180;dialDrag.angle=angle;dialDrag.remainder+=delta;
  const steps=Math.trunc(dialDrag.remainder/7.2);
  if(steps){dialDrag.remainder-=steps*7.2;focusTo(state.focus[state.scope]+steps*Number(el.dataset.dial));}
 });
 for(const event of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(event,()=>{dialDrag=null;});
});
document.addEventListener('keydown',e=>{
 if(!e.target.closest('#physical-slide')||e.altKey||e.ctrlKey||e.metaKey)return;
 const map={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'};
 if(map[e.key]){e.preventDefault();move(map[e.key]);}
});
let drag=null;
$('#slide-pad').onpointerdown=e=>{
 if(!e.target.closest('#physical-slide')||e.button!==0)return;
 if(state.mode==='challenge'&&state.solved)return;
 e.preventDefault();drag={id:e.pointerId,x:e.clientX,y:e.clientY,sx:state.x,sy:state.y,scale:slideScale()};e.currentTarget.setPointerCapture(e.pointerId);
 $('#hand-motion').textContent='已抓住玻片，試著往旁邊推';$('#slide-pad').classList.add('moving');
};
$('#slide-pad').onpointermove=e=>{
 if(!drag||e.pointerId!==drag.id||state.solved)return;
 const x=state.x+(e.clientX-drag.x)/drag.scale.x,y=state.y+(e.clientY-drag.y)/drag.scale.y;
 if(state.mode==='challenge'&&!state.predicted&&Math.hypot(x-state.x,y-state.y)<2)return;
 recordFirstMove(x-state.x,y-state.y);drag.x=e.clientX;drag.y=e.clientY;moveTo(x,y);
};
$('#slide-pad').onpointerup=$('#slide-pad').onpointercancel=$('#slide-pad').onlostpointercapture=()=>{drag=null;$('#slide-pad').classList.remove('moving');};
new ResizeObserver(()=>{drag=null;render();}).observe($('#slide-pad'));
function startMission(index){
 drag=null;resetMotion();state.mission=index;const m=missions[index];Object.assign(state,{scope:m.scope,x:m.x,y:m.y,predicted:false,solved:false,moves:0});
 lighting.stereo={light:70,aperture:65};lighting.compound={light:70,aperture:65};state.focus={...idealFocus};if(m.focus)state.focus[m.scope]=20;
 $('#progress').textContent=`任務 ${index+1} / ${missions.length} · ${m.focus?'移片＋調焦':'方向練習'}`;
 $('#mission-title').textContent=m.title;$('#mission-instruction').textContent='先想方向，再抓住玻片，把紅點拖回中央。';
 $('#next').hidden=true;feedback('抓住玻片直接拖曳，看看紅點是否靠近中央。');render();
}
function setMode(mode){
 state.mode=mode;drag=null;lighting.stereo={light:70,aperture:65};lighting.compound={light:70,aperture:65};resetMotion();$('#mission').hidden=mode!=='challenge';
 for(const id of ['explore','challenge']){$(`#${id}`).classList.toggle('active',mode===id);$(`#${id}`).setAttribute('aria-pressed',mode===id);}
 if(mode==='challenge')startMission(0);else{Object.assign(state,{x:0,y:0,predicted:false,solved:false,focus:{stereo:62,compound:20}});feedback('先把玻片向右移，看看視野裡的紅點往哪裡走。');render();}
}
$('#explore').onclick=()=>setMode('explore');$('#challenge').onclick=()=>setMode('challenge');
$('#reset').onclick=()=>state.mode==='challenge'?startMission(state.mission):setMode('explore');
$('#next').onclick=()=>{startMission((state.mission+1)%missions.length);$('#physical-slide').focus({preventScroll:true});};
$('#hint').onclick=()=>{const show=$('#hint-text').hidden;$('#hint-text').hidden=!show;$('#hint').setAttribute('aria-expanded',show);$('#hint').textContent=show?'收起判斷方法 −':'顯示判斷方法 ＋';};
render();
// Load 3D independently so all learning controls still work without WebGL.
async function init3D(){
 try{
  const THREE=await import('./vendor/three.module.min.js');
  const host=$('#scene');const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(5,4.2,6.5);camera.lookAt(0,1.8,0);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));host.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xffffff,0x6e8770,2.6));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(3,6,5);scene.add(light);
  const white=new THREE.MeshStandardMaterial({color:0xe4eadc,roughness:.5});
  const dark=new THREE.MeshStandardMaterial({color:0x254b40,roughness:.5});
  const metal=new THREE.MeshStandardMaterial({color:0x95a79c,metalness:.65,roughness:.3});
  const glass=new THREE.MeshStandardMaterial({color:0xc2ead9,transparent:true,opacity:.65,roughness:.2});
  const red=new THREE.MeshStandardMaterial({color:0xbf5a3c});
  const root=new THREE.Group();scene.add(root);
  const mesh=(geo,mat,pos,parent=root)=>{const o=new THREE.Mesh(geo,mat);o.position.set(...pos);parent.add(o);return o;};
  const box=(w,h,d,mat,pos,parent)=>mesh(new THREE.BoxGeometry(w,h,d),mat,pos,parent);
  const cyl=(r,h,mat,pos,parent)=>mesh(new THREE.CylinderGeometry(r,r,h,32),mat,pos,parent);
  box(2.4,.22,1.95,white,[0,.15,0]);cyl(.49,.05,dark,[0,.29,.25]);
  box(.42,2.9,.46,dark,[0,1.75,-.65]);
  const stage=new THREE.Group();root.add(stage);stage.position.y=1.23;
  box(1.85,.12,1.42,dark,[0,0,.13],stage);
  const slide=new THREE.Group();stage.add(slide);slide.position.y=.095;
  box(1.25,.045,.48,glass,[0,0,.2],slide);cyl(.055,.025,red,[0,.04,.2],slide);
  box(.07,.045,.64,metal,[-.65,.09,.13],stage);box(.07,.045,.64,metal,[.65,.09,.13],stage);
  const compound=new THREE.Group();root.add(compound);
  box(.57,.3,1.15,white,[0,3,-.2],compound);cyl(.25,.78,white,[0,2.8,.3],compound);cyl(.31,.17,dark,[0,2.35,.3],compound);
  for(let i=0;i<3;i++){const a=i*Math.PI*2/3;cyl(.09,.34+i*.05,metal,[Math.cos(a)*.21,2.12,.3+Math.sin(a)*.21],compound);}
  cyl(.19,.27,white,[0,3.25,.3],compound);
  const eyepiece=cyl(.15,.65,dark,[0,3.47,.37],compound);eyepiece.rotation.x=.4;
  const stereo=new THREE.Group();root.add(stereo);
  box(.42,.24,1.05,white,[0,2.9,-.35],stereo);
  box(.75,.5,.85,white,[0,2.9,.05],stereo);cyl(.31,.4,dark,[0,2.46,.2],stereo);
  for(const x of [-.24,.24]){const tube=cyl(.15,.65,dark,[x,3.3,.3],stereo);tube.rotation.x=.42;}
  const knob=cyl(.24,.2,metal,[.42,1.85,-.65]);knob.rotation.z=Math.PI/2;
  const knobMark=box(.015,.18,.025,white,[.53,1.92,-.65]);
  updateModel=()=>{
   if(!host.closest('details').open)return;
   compound.visible=state.scope==='compound';stereo.visible=!compound.visible;
   // Physical slide movement uses the same top-view axes as the controls.
   slide.position.x=state.x*.007;slide.position.z=state.y*.007;
   const offset=(state.focus[state.scope]-idealFocus[state.scope])*.005;
   stage.position.y=state.scope==='compound'?1.23+offset:.42;
   stereo.position.y=state.scope==='stereo'?-offset:0;
   knobMark.position.z=-.65+Math.sin(state.focus[state.scope]*.15)*.14;
   renderer.render(scene,camera);
  };
  host.closest('details').addEventListener('toggle',()=>{if(host.closest('details').open)resize();});
  const resize=()=>{const {width,height}=host.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();updateModel();};
  new ResizeObserver(resize).observe(host);resize();$('#scene-status').hidden=true;
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();$('#scene-status').hidden=false;$('#scene-status').textContent='3D 顯示已暫停；仍可使用俯視圖與視野練習。';});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{$('#scene-status').hidden=true;updateModel();});
 }catch(error){$('#scene-status').textContent='此裝置無法顯示 3D；請用下方俯視圖操作，移片與調焦練習仍可使用。';console.warn('Microscope 3D unavailable:',error);}
}
init3D();
