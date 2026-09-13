// Samples: UTC Unix milliseconds, J2000 ecliptic km, km/s. Never extrapolate.
export function trajectoryPosition(track,date){
 const a=track?.samples,t=+date;if(!a?.length||t<a[0][0]||t>a.at(-1)[0])return null;
 let lo=0,hi=a.length-1;while(hi-lo>1){const mid=(lo+hi)>>1;if(a[mid][0]<=t)lo=mid;else hi=mid;}
 const p=a[lo],q=a[hi],dt=(q[0]-p[0])/1000;if(!dt)return {x:p[1],y:p[2],z:p[3]};
 const u=(t-p[0])/(q[0]-p[0]),h00=2*u**3-3*u*u+1,h10=u**3-2*u*u+u,h01=-2*u**3+3*u*u,h11=u**3-u*u;
 const v=[1,2,3].map(i=>h00*p[i]+h10*dt*p[i+3]+h01*q[i]+h11*dt*q[i+3]);return{x:v[0],y:v[1],z:v[2]};
}
export function trajectoryWindow(track,date,days=14){
 if(!trajectoryPosition(track,date))return [];
 const half=days*86400000/2,start=Math.max(+date-half,track.samples[0][0]),end=Math.min(+date+half,track.samples.at(-1)[0]);
 const times=[start,...track.samples.map(s=>s[0]).filter(t=>t>start&&t<end),end];
 return times.map(t=>trajectoryPosition(track,t));
}
