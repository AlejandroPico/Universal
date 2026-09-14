import {galaxyDiskBasis} from './galaxy-orientation-geometry.js';
import * as THREE from 'three';
import { galacticPosition } from './cosmic-data.js';
import {M31_DISK_RADIUS_LY} from './andromeda-geometry.js';
export function seededRandom(seed=7319) { return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}; }
const TAU=Math.PI*2;
// Population model, not a fabricated star catalogue. Exponential interarm disk,
// thick disk, bar/bulge, irregular young arms and a sparse old stellar halo.
export function galaxyPopulation(item, count) {
 const rng=seededRandom(7319+Math.round(item.ra*1901));
 const normal=()=>Math.sqrt(-2*Math.log(Math.max(1e-9,rng())))*Math.cos(TAU*rng());
 const p=new Float32Array(count*3),c=new Float32Array(count*3);
 const milkyWay=item.id==='milky-way';
 const m31=item.id==='andromeda',diskRadius=m31?M31_DISK_RADIUS_LY:item.radiusLy,basis=galaxyDiskBasis(item);
 const elliptical=['m87','centaurus-a'].includes(item.id),irregular=['lmc','smc','m82'].includes(item.id);
 const rotation=new THREE.Euler(.6+item.dec*.02,item.ra,1),vector=new THREE.Vector3();
 const warm=new THREE.Color('#ffe0b0'),old=new THREE.Color('#e1c6a1'),young=new THREE.Color('#b7d5f5');
 const palette=['#ff8454','#ffb570','#ffe0aa','#fff3df','#d1e1ff','#85b5ff'].map(c=>new THREE.Color(c));
 for(let i=0;i<count;i++) {
  const population=rng();let x,y,z,color,brightness;
  if(elliptical || population<.15) {
   const radius=(-Math.log(Math.max(1e-9,rng()))*(elliptical?.21:.065))*item.radiusLy;
   const az=rng()*TAU,cos=rng()*2-1,sin=Math.sqrt(1-cos*cos);
   x=radius*sin*Math.cos(az)*(elliptical?1:2.7);y=radius*sin*Math.sin(az);z=radius*cos*(elliptical?.78:.7);
   if(!elliptical){const angle=.48,a=x;x=a*Math.cos(angle)-y*Math.sin(angle);y=a*Math.sin(angle)+y*Math.cos(angle);}
   color=warm;brightness=.25+rng()*.3;
  } else if(population>(milkyWay?.955:.988)) {
   const radius=item.radiusLy*(.2+Math.pow(rng(),.7)*1.4),az=rng()*TAU,cos=rng()*2-1;
   x=radius*Math.sqrt(1-cos*cos)*Math.cos(az);y=radius*Math.sqrt(1-cos*cos)*Math.sin(az);z=radius*cos;
   color=old;brightness=milkyWay?.065:.045;
  } else {
   const r=-Math.log(Math.max(1e-9,rng()*rng()))*.22;
   let theta=rng()*TAU;
   const youngArm=population>(milkyWay?.80:.77)&&!irregular;
   if(youngArm) {
    const arm=Math.floor(rng()*4);
    theta=arm*Math.PI/2+Math.log(Math.max(.055,r))*3.5+normal()*(.20+.20*r)+.16*Math.sin(r*27+arm*2);
   }
   x=r*diskRadius*Math.cos(theta);y=r*diskRadius*Math.sin(theta);
   const thick=population>(milkyWay?.54:.64)&&population<(milkyWay?.80:.77);
   z=normal()*item.radiusLy*(thick?(milkyWay?.042:.026):(milkyWay?.009:.0065))+Math.sin(theta-.3)*Math.max(0,r-.55)**2*item.radiusLy*.10;
   if(irregular){x+=Math.sin(y/item.radiusLy*12)*item.radiusLy*.10;z*=3;}
   // Attenuation follows irregular narrow dust lanes within the luminous disk;
   // it never removes the entire interarm stellar population.
   const phase=4*(theta-Math.log(Math.max(.055,r))*3.5-.15*Math.sin(r*27));
   const dust=Math.exp(-Math.pow(Math.sin(phase*.5)/.23,2))*.25;
   brightness=(youngArm?.32:.20)*(1-dust)*( .65+rng()*.7);
   brightness*=Math.exp(-Math.max(0,r-.55)*1.7);
   color=youngArm?young:old;
  }
  // A chromatic population mix, not measured temperatures for invented IDs.
  const tint=rng();
  if(color===young)color=palette[tint<.65?5:4];
  else color=palette[tint<.25?0:tint<.50?1:tint<.73?2:tint<.94?3:4];
  // Sparse resolved lights sit on top of the underlying dense disk.
  brightness*=.9+Math.pow(rng(),10)*3.5;
  vector.set(x,y,z);
  if(item.id==='milky-way')vector.fromArray(galacticPosition(x,y,z));else if(basis)vector.applyMatrix4(basis);else vector.applyEuler(rotation);
  vector.toArray(p,i*3);c[i*3]=color.r*brightness;c[i*3+1]=color.g*brightness;c[i*3+2]=color.b*brightness;
 }
 return {positions:p,colors:c};
}
