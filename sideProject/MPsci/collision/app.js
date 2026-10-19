import {outcome,collisionTime,duration,stateAt,totals} from './model.mjs';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const presets={equal:{m1:1,m2:1,u1:2,u2:0},heavy:{m1:3,m2:1,u1:2,u2:0},light:{m1:1,m2:3,u1:2,u2:0},headon:{m1:1,m2:1,u1:2,u2:-2},parallel:{m1:1,m2:1,u1:2,u2:2}};
let config={...presets.equal},time=0,playing=false,last=0,raf=0;
const clean=v=>Math.abs(v)<.00005?0:v;
const fmt=v=>clean(v).toFixed(2);
const signed=v=>(clean(v)>0?'+':'')+fmt(v);
const color=['#176e60','#ce793d'];
function arrow(ctx,x,y,length,fill){
 if(Math.abs(length)<1)return;
 const sign=Math.sign(length);ctx.strokeStyle=fill;ctx.fillStyle=fill;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+length,y);ctx.stroke();ctx.beginPath();ctx.moveTo(x+length,y);ctx.lineTo(x+length-sign*10,y-6);ctx.lineTo(x+length-sign*10,y+6);ctx.closePath();ctx.fill();
}
function drawTrack(s){
 const canvas=$('#track'),ctx=canvas.getContext('2d'),w=1200,h=420;
 ctx.clearRect(0,0,w,h);
 const min=Math.min(-5,s.x1-2,s.x2-2),max=Math.max(5,s.x1+2,s.x2+2),scale=(w-150)/(max-min),x=v=>75+(v-min)*scale;
 ctx.strokeStyle='#98afa0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(40,304);ctx.lineTo(w-40,304);ctx.stroke();
 const tick=(max-min)>24?5:(max-min)>12?2:1;
 ctx.textAlign='center';ctx.font='16px system-ui';ctx.fillStyle='#758d7b';
 for(let t=Math.ceil(min/tick)*tick;t<=max;t+=tick){ctx.beginPath();ctx.moveTo(x(t),304);ctx.lineTo(x(t),315);ctx.stroke();ctx.fillText(t.toFixed(0),x(t),341);}
 ctx.textAlign='right';ctx.fillText('位置 x（m）',w-35,384);
 [s.x1,s.x2].forEach((pos,i)=>{
  const center=x(pos),bw=.8*scale,velocity=i?s.v2:s.v1,mass=i?config.m2:config.m1,base=270;
  ctx.fillStyle=color[i];ctx.fillRect(center-bw/2,base-65,bw,65);
  ctx.fillStyle='#fff';ctx.font='bold 21px system-ui';ctx.textAlign='center';ctx.fillText(i?'B':'A',center,base-25);
  ctx.fillStyle='#2f463c';for(const offset of [-.24,.24]){ctx.beginPath();ctx.arc(center+offset*scale,285,15,0,Math.PI*2);ctx.fill();ctx.fillStyle='#a7b9a5';ctx.beginPath();ctx.arc(center+offset*scale,285,6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#2f463c';}
  // Separate label heights prevent overlap at the instant of contact.
  const y=i?84:137;ctx.font='bold 20px system-ui';ctx.fillStyle=color[i];ctx.fillText(`${i?'B':'A'} · ${signed(velocity)} m/s`,center,y);
  arrow(ctx,center,y+25,Math.sign(velocity)*Math.min(110,Math.abs(velocity)*25),color[i]);
  ctx.font='16px system-ui';ctx.fillText(`${mass} kg`,center,base-80);
 });
 if(Math.abs(time-collisionTime(config))<.09){ctx.fillStyle='#cf9c39';ctx.font='bold 22px system-ui';ctx.textAlign='center';ctx.fillText('接觸！',x((s.x1+s.x2)/2),42);}
 canvas.setAttribute('aria-label',`時間 ${fmt(time)} 秒。A 位置 ${fmt(s.x1)} 公尺、速度 ${signed(s.v1)} 公尺每秒；B 位置 ${fmt(s.x2)} 公尺、速度 ${signed(s.v2)} 公尺每秒。`);
}
function drawChart(){
 const canvas=$('#chart'),ctx=canvas.getContext('2d'),hit=collisionTime(config),end=duration(config),result=outcome(config);
 const maxV=Math.max(2,Math.ceil(Math.max(Math.abs(config.u1),Math.abs(config.u2),...(Number.isFinite(hit)?[Math.abs(result.v1),Math.abs(result.v2)]:[]))));
 const left=65,right=970,top=30,bottom=252,x=t=>left+t/end*(right-left),y=v=>top+(maxV-v)/(2*maxV)*(bottom-top);
 ctx.clearRect(0,0,1000,300);ctx.font='16px system-ui';ctx.lineWidth=1;
 for(let i=-2;i<=2;i++){const v=i*maxV/2;ctx.strokeStyle=i===0?'#869f8a':'#e4eadf';ctx.beginPath();ctx.moveTo(left,y(v));ctx.lineTo(right,y(v));ctx.stroke();ctx.fillStyle='#748976';ctx.textAlign='right';ctx.fillText(v.toFixed(1),left-9,y(v)+5);}
 ctx.textAlign='center';for(let i=0;i<=4;i++){const t=end*i/4;ctx.fillText(t.toFixed(1),x(t),277);}
 ctx.fillText('t（s）',950,297);ctx.textAlign='left';ctx.fillText('v（m/s）',5,18);
 for(let i=0;i<2;i++){
  const before=i?config.u2:config.u1,after=i?result.v2:result.v1;
  ctx.strokeStyle=color[i];ctx.lineWidth=4;ctx.setLineDash(i?[9,5]:[]);ctx.beginPath();ctx.moveTo(x(0),y(before));ctx.lineTo(x(Math.min(time,hit)),y(before));
  if(time>=hit){ctx.lineTo(x(hit),y(after));ctx.lineTo(x(time),y(after));}ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle=color[i];ctx.beginPath();ctx.arc(x(time),y(time>=hit?after:before),5,0,Math.PI*2);ctx.fill();
 }
 ctx.strokeStyle='#526c6070';ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(x(time),top);ctx.lineTo(x(time),bottom);ctx.stroke();ctx.setLineDash([]);
}
function describe(v){return Math.abs(v)<.005?'停下來':`${v<0?'向左':'向右'}走（${fmt(Math.abs(v))} m/s）`;}
function render(){
 const s=stateAt(config,time),before=totals(config,config.u1,config.u2),now=totals(config,s.v1,s.v2),hit=collisionTime(config),end=duration(config);
 $('#clock').textContent=`${fmt(time)} s`;$('#time').value=time;$('#time').max=end;$('#end-time').textContent=`${fmt(end)} s`;
 $('#play').textContent=playing?'暫停 Ⅱ':time>=end?'再播放 ▶':time===0?'開始實驗 ▶':'繼續 ▶';
 $('#phase').textContent=time>=end?'本次觀察結束':s.collided?'碰撞後':time===0?'準備出發':'碰撞前';
 $('#contact').disabled=!Number.isFinite(hit);
 for(const [id,value] of Object.entries({'before-a':signed(config.u1),'before-b':signed(config.u2),'now-a':signed(s.v1),'now-b':signed(s.v2),'before-p':signed(before.momentum),'now-p':signed(now.momentum),'before-e':fmt(before.energy),'now-e':fmt(now.energy)}))$('#'+id).textContent=value;
 let message;
 if(!Number.isFinite(hit))message=config.u1===config.u2?'兩車同速，距離不變，不會碰撞。改變其中一台的初速度，再試一次。':'A 無法追上 B，兩車不會碰撞。試著讓 A 的速度大於 B。';
 else if(s.collided)message=`碰撞後：A ${describe(s.v1)}，B ${describe(s.v2)}。比較下方數值：兩車的總動量與總動能保持不變。`;
 else if(config.m1===config.m2&&config.u2===0)message='先猜猜看：A 撞上同樣重的 B，A 會停下來嗎？按開始，或慢慢拖動時間軸驗證。';
 else message='先預測兩車碰撞後的方向，再用慢速播放與時間軸驗證。速度箭頭的長度代表快慢。';
 if($('#observation').textContent!==message)$('#observation').textContent=message;
 drawTrack(s);drawChart();
}
function pause(){playing=false;cancelAnimationFrame(raf);last=0;}
function reset(){pause();time=0;render();}
function frame(timestamp){
 if(!playing)return;
 if(last)time=Math.min(duration(config),time+Math.min((timestamp-last)/1000,.1)*Number($('#speed').value));
 last=timestamp;if(time>=duration(config))pause();render();if(playing)raf=requestAnimationFrame(frame);
}
$('#play').onclick=()=>{if(playing)pause();else{if(time>=duration(config))time=0;playing=true;last=0;raf=requestAnimationFrame(frame);}render();};
$('#reset').onclick=reset;
$('#contact').onclick=()=>{pause();time=collisionTime(config);render();};
$('#time').oninput=e=>{pause();time=Number(e.target.value);render();};
document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();render();}});
function syncControls(){for(const key of ['m1','m2','u1','u2']){$('#'+key).value=config[key];$('#'+key+'-value').textContent=key[0]==='m'?`${config[key]} kg`:`${signed(config[key])} m/s`;}}
for(const key of ['m1','m2','u1','u2'])$('#'+key).oninput=e=>{config[key]=Number(e.target.value);$$('[data-preset]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false');});syncControls();reset();};
$$('[data-preset]').forEach(b=>b.onclick=()=>{config={...presets[b.dataset.preset]};$$('[data-preset]').forEach(other=>{const active=other===b;other.classList.toggle('active',active);other.setAttribute('aria-pressed',active);});syncControls();reset();});
$('#fullscreen').hidden=!document.documentElement.requestFullscreen;
$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('#observation').textContent='目前無法開啟全螢幕，仍可在此頁繼續實驗。';}};
document.addEventListener('fullscreenchange',()=>{$('#fullscreen').textContent=document.fullscreenElement?'離開全螢幕':'全螢幕';});
syncControls();render();
