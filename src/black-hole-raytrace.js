// Rs = 1. Planar Schwarzschild null orbits obey u'' + u = 3u²/2.
// The equivalent Cartesian affine-parameter equation is r'' = -3 L² r/(2 |r|^5).
// Numerical Verlet integration. Disk/emission/background are illustrative, not EHT fits.
// Reference: Carroll, Lecture Notes on General Relativity, §7 (effective potential).
export function traceRay(origin,direction,{lens=true,disk=true,maxSteps=600}={}){
 let [x,y,z]=origin,[vx,vy,vz]=direction;const norm=Math.hypot(vx,vy,vz);vx/=norm;vy/=norm;vz/=norm;
 const cx=y*vz-z*vy,cy=z*vx-x*vz,cz=x*vy-y*vx,L2=cx*cx+cy*cy+cz*cz;
 for(let i=0;i<maxSteps;i++){
  const r=Math.hypot(x,y,z);if(r<=1)return{kind:'captured'};
  if(r>80&&x*vx+y*vy+z*vz>0)return{kind:'sky',direction:[vx,vy,vz]};
  const dt=Math.min(1.5,Math.max(.025,r*.065)),a=lens?-1.5*L2/r**5:0;
  const hx=vx+x*a*dt*.5,hy=vy+y*a*dt*.5,hz=vz+z*a*dt*.5;
  const nx=x+hx*dt,ny=y+hy*dt,nz=z+hz*dt;
  if(disk&&y*ny<0){const t=y/(y-ny),px=x+(nx-x)*t,pz=z+(nz-z)*t,rr=Math.hypot(px,pz);if(rr>=3&&rr<=14)return{kind:'disk',r:rr,angle:Math.atan2(pz,px)};}
  const nr=Math.hypot(nx,ny,nz),na=lens?-1.5*L2/Math.max(nr,1)**5:0;
  vx=hx+nx*na*dt*.5;vy=hy+ny*na*dt*.5;vz=hz+nz*na*dt*.5;x=nx;y=ny;z=nz;
 }
 return{kind:'unresolved'};
}
export function renderBlackHole({width=360,height=240,inclination=70,yaw=0,zoom=1,lens=true,grid=false}){
 const pixels=new Uint8ClampedArray(width*height*4),inc=inclination*Math.PI/180,a=yaw*Math.PI/180;
 const eye=[32*Math.sin(inc)*Math.sin(a),32*Math.cos(inc),32*Math.sin(inc)*Math.cos(a)],forward=eye.map(v=>-v/32),right=[Math.cos(a),0,-Math.sin(a)],up=[-Math.cos(inc)*Math.sin(a),Math.sin(inc),-Math.cos(inc)*Math.cos(a)];
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const u=(2*(x+.5)/width-1)*width/height*.47/zoom,v=(1-2*(y+.5)/height)*.47/zoom;
  const ray=traceRay(eye,forward.map((f,i)=>f+u*right[i]+v*up[i]),{lens});let col=[2,4,8];
  if(ray.kind==='disk'){
   const t=(ray.r-3)/11,texture=.86+.09*Math.sin(ray.r*9+Math.sin(ray.angle*5))+.05*Math.sin(ray.r*17-ray.angle*7);
   const bright=(.22+.78*Math.exp(-t*2.5))*texture;
   col=[255*Math.sqrt(bright),190*bright**.9,105*bright**1.7];
  }else if(ray.kind==='sky'&&grid){const d=ray.direction,lon=Math.atan2(d[0],d[2]),lat=Math.atan2(d[1],Math.hypot(d[0],d[2]));const line=Math.min(Math.abs(Math.sin(lon*18)),Math.abs(Math.sin(lat*18)));col=line<.045?[52,77,103]:[5,9,15];}
  const o=(y*width+x)*4;pixels[o]=col[0];pixels[o+1]=col[1];pixels[o+2]=col[2];pixels[o+3]=255;
 }
 return pixels;
}
