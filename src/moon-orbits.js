import {trajectoryPosition} from './trajectory.js';
const RAD=Math.PI/180,DAY=86400000,EPS=23.43928*RAD;
// JPL nodes are measured from the intersection of the reference plane
// with the ICRF equator. Elements remain mean approximations, without precession.
export function meanMoonPosition(body,date,forcedMean){
 const q=body.meanElements;
 const [day,fraction='0']=q.epoch.split('.');
 const epoch=Date.parse(day+'T00:00:00Z')+Number('0.'+fraction)*DAY;
 let m=forcedMean??q.mean*RAD+(+date-epoch)/DAY/q.period*2*Math.PI;
 m=((m%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
 let E=m;for(let i=0;i<15;i++){const d=(E-q.e*Math.sin(E)-m)/(1-q.e*Math.cos(E));E-=d;if(Math.abs(d)<1e-12)break;}
 const x=q.a*(Math.cos(E)-q.e),y=q.a*Math.sqrt(1-q.e*q.e)*Math.sin(E);
 const w=q.peri*RAD,n=q.node*RAD,i=q.inc*RAD;
 const u=x*Math.cos(w)-y*Math.sin(w),v=x*Math.sin(w)+y*Math.cos(w);
 const p=[u*Math.cos(n)-v*Math.cos(i)*Math.sin(n),u*Math.sin(n)+v*Math.cos(i)*Math.cos(n),v*Math.sin(i)];
 if(q.frame==='ecliptic')return{x:p[0],y:p[1],z:p[2]};
 const [ra,dec]=q.pole.map(v=>v*RAD);
 const X=[-Math.sin(ra),Math.cos(ra),0],Z=[Math.cos(dec)*Math.cos(ra),Math.cos(dec)*Math.sin(ra),Math.sin(dec)];
 const Y=[-Math.sin(dec)*Math.cos(ra),-Math.sin(dec)*Math.sin(ra),Math.cos(dec)];
 const a=p.map((_,j)=>X[j]*p[0]+Y[j]*p[1]+Z[j]*p[2]);
 return{x:a[0],y:a[1]*Math.cos(EPS)+a[2]*Math.sin(EPS),z:-a[1]*Math.sin(EPS)+a[2]*Math.cos(EPS)};
}
// Closed instantaneous two-body ellipse. Unlike an ephemeris time window,
// this is a geometric orbit, not a prediction of the next revolution.
function instantaneousOrbit(body,date,track){
 const r0=trajectoryPosition(track,date);if(!r0)return null;
 const t=+date,lo=Math.max(track.samples[0][0],t-30000),hi=Math.min(track.samples.at(-1)[0],t+30000);
 if(hi<=lo)return null;
 const a=trajectoryPosition(track,lo),b=trajectoryPosition(track,hi);
 const r=[r0.x,r0.y,r0.z],v=['x','y','z'].map(k=>(b[k]-a[k])/((hi-lo)/1000));
 const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const mu=body.id==='moon'?403503.2357:4*Math.PI**2*body.meanElements.a**3/(Math.abs(body.periodDays)*86400)**2;
 const radius=Math.hypot(...r),h=cross(r,v),hn=Math.hypot(...h);if(!hn)return null;
 const e=cross(v,h).map((x,i)=>x/mu-r[i]/radius),ecc=Math.hypot(...e);if(ecc>=1)return null;
 const axis=r.map(x=>x/radius),normal=h.map(x=>x/hn),side=cross(normal,axis),p=hn*hn/mu;
 const points=Array.from({length:256},(_,i)=>{
  const theta=i/256*Math.PI*2,dir=axis.map((x,k)=>x*Math.cos(theta)+side[k]*Math.sin(theta));
  const distance=p/(1+dot(e,dir));return{x:dir[0]*distance,y:dir[1]*distance,z:dir[2]*distance};
 });
 points[0]=r0;points.push({...r0});return points;
}
export function moonOrbitPoints(body,date,track){
 const closed=instantaneousOrbit(body,date,track);if(closed)return closed;
 if(trajectoryPosition(track,date)){
  const half=Math.abs(body.periodDays)*DAY/2;
  const start=Math.max(+date-half,track.samples[0][0]),end=Math.min(+date+half,track.samples.at(-1)[0]);
  // Include the exact current instant, so the body lies on the rendered line.
  const times=[...Array.from({length:257},(_,i)=>start+(end-start)*i/256),+date].sort((a,b)=>a-b);
  return times.map(t=>trajectoryPosition(track,t));
 }
 return Array.from({length:257},(_,i)=>meanMoonPosition(body,date,i/256*Math.PI*2));
}
