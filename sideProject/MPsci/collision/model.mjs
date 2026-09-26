// SI units. Carts move on an unbounded, frictionless 1D track.
export function outcome({m1,m2,u1,u2}) {
  if(![m1,m2,u1,u2].every(Number.isFinite)||m1<=0||m2<=0)throw new RangeError('Positive masses and finite velocities required');
  return {v1:((m1-m2)*u1+2*m2*u2)/(m1+m2),v2:(2*m1*u1+(m2-m1)*u2)/(m1+m2)};
}
export function collisionTime(config){return config.u1>config.u2?5.2/(config.u1-config.u2):Infinity;}
export function duration(config){const t=collisionTime(config);return Number.isFinite(t)?Math.max(6,t+3):6;}
export function stateAt(config,time){
 const t=Math.max(0,time),hit=collisionTime(config),after=t>=hit,result=outcome(config);
 return {x1:-3+config.u1*Math.min(t,hit)+(after?result.v1*(t-hit):0),x2:3+config.u2*Math.min(t,hit)+(after?result.v2*(t-hit):0),v1:after?result.v1:config.u1,v2:after?result.v2:config.u2,collided:after};
}
export function totals({m1,m2},v1,v2){return {momentum:m1*v1+m2*v2,energy:.5*m1*v1*v1+.5*m2*v2*v2};}
