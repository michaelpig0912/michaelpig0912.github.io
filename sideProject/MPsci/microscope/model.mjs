// Screen coordinates: x increases right, y increases down.
export const names = {stereo:'解剖顯微鏡', compound:'複式顯微鏡'};
export const vectors = {up:[0,-1], down:[0,1], left:[-1,0], right:[1,0]};
export const directionNames = {up:'上',down:'下',left:'左',right:'右'};
export const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
export const imagePosition = (scope,x,y) => ({x:x*(scope==='compound'?-1:1),y:y*(scope==='compound'?-1:1)});
export const idealFocus = {stereo:62,compound:46};
export const isClear = (scope,focus) => Math.abs(focus-idealFocus[scope])<=3;
export const isCentered = (x,y) => Math.hypot(x,y)<=5;
export const improves = (x,y,dir) => {const [dx,dy]=vectors[dir];return x*dx+y*dy<0;};
export const missions = [
 {scope:'stereo',x:40,y:0,title:'解剖鏡：紅點在右邊',focus:false},
 {scope:'compound',x:-40,y:0,title:'複式鏡：紅點也在右邊',focus:false},
 {scope:'compound',x:0,y:40,title:'複式鏡：紅點跑到上面了',focus:false},
 {scope:'stereo',x:0,y:40,title:'解剖鏡：紅點在下面',focus:false},
 {scope:'compound',x:-40,y:30,title:'複式鏡：找回右上方的紅點',focus:true},
 {scope:'stereo',x:40,y:-30,title:'解剖鏡：移回中央，再看清楚',focus:true}
];
// Qualitative teaching model, not a calibrated optical simulation.
export function illumination(scope,light,aperture=65){
 const opening=scope==='compound'?clamp(aperture,10,100):65;
 const brightness=clamp(light,0,100)/70*(scope==='compound'?(opening/65)**2:1);
 return {brightness,contrast:scope==='compound'?1.25-opening*.007: .85,diffraction:scope==='compound'?Math.max(0,35-opening)*.14:0,usable:brightness>=.3&&brightness<=1.7&&opening>=30};
}
