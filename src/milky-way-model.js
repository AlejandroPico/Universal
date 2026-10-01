import {galacticPosition,COSMIC_OBJECTS,LY_KM} from './cosmic-data.js';
// A population reconstruction, not a catalogue of the unobserved Galaxy.
// Local number density: CNS5 (A&A 2023), 0.0799 stars/pc³. Structural values
// are explicit modelling choices within the ranges of Galactic disk models.
export const MILKY_WAY={radius:52000,solarRadius:27000,thinScale:8500,thinHeight:900,thickScale:11000,thickHeight:2800,barAngle:-27*Math.PI/180,barAxes:[5500,1800,1300],barDensity:.24,localDensity:.0799/3.261563777**3,haloFraction:.0015,armFraction:.14,pitch:12*Math.PI/180};
export const MW_SOURCES={structure:'https://www.cosmos.esa.int/web/gaia/milky-way',density:'https://www.aanda.org/articles/aa/full_html/2023/02/aa44250-22/aa44250-22.html',laws:'https://gea.esac.esa.int/archive/documentation/GEDR3/Data_processing/chap_simulated/sec_cu2UM/ssec_cu2starsgal.html'};
export const SECTOR_SIZE=16,SECTOR_SPAN=5,SECTOR_RADIUS=72,SECTOR_BUDGET=90000;
const TAU=2*Math.PI,axes=[galacticPosition(1,0,0),galacticPosition(0,1,0),galacticPosition(0,0,1)];
export const MW_CENTER=COSMIC_OBJECTS.find(x=>x.id==='milky-way').position.map(v=>v/LY_KM);
export const toGalactic=position=>axes.map(axis=>axis.reduce((s,v,i)=>s+v*(position[i]-MW_CENTER[i]),0));
export const fromGalactic=position=>galacticPosition(...position).map((v,i)=>v+MW_CENTER[i]);
export function randomSequence(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function hash(x,y,z,i=0){let h=Math.imul(x,73856093)^Math.imul(y,19349663)^Math.imul(z,83492791)^Math.imul(i+1,1640531527);h=Math.imul(h^(h>>>16),2246822507);h=Math.imul(h^(h>>>13),3266489909);return (h^(h>>>16))>>>0;}
const normal=r=>Math.sqrt(-2*Math.log(Math.max(1e-12,r())))*Math.cos(TAU*r());
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
export function warpHeight(radius,theta){return Math.max(0,radius-35000)**1.3*.008*Math.sin(theta-.4);}
function arms(radius,theta){const phase=Math.log(Math.max(3500,radius)/8500)/Math.tan(MILKY_WAY.pitch)+.35,width=.10;let a=0;for(let i=0;i<4;i++)a+=Math.exp(-.5*(wrap(theta-phase-i*Math.PI/2)/width)**2);return a*Math.PI/(2*Math.sqrt(2*Math.PI)*width);}
function rawDensity(x,y,z){
 const m=MILKY_WAY,r=Math.hypot(x,y),theta=Math.atan2(y,x),height=Math.abs(z-warpHeight(r,theta));
 const taper=1/(1+Math.exp((r-m.radius)/1600));
 const disk=m.localDensity*(.94*Math.exp((m.solarRadius-r)/m.thinScale-height/m.thinHeight)+.06*Math.exp((m.solarRadius-r)/m.thickScale-height/m.thickHeight))*taper;
 const c=Math.cos(m.barAngle),s=Math.sin(m.barAngle),a=x*c+y*s,b=-x*s+y*c;
 const bar=m.barDensity*Math.exp(-.5*((a/m.barAxes[0])**2+(b/m.barAxes[1])**2+(z/m.barAxes[2])**2));
 const halo=m.localDensity*.00004*(1+(x*x+y*y+(z/.7)**2)/10000**2)**-1.7;
 return disk*(1-m.armFraction+m.armFraction*arms(r,theta))+bar+halo;
}
const normalization=MILKY_WAY.localDensity/rawDensity(...toGalactic([0,0,0]));
export const stellarDensity=(x,y,z)=>rawDensity(x,y,z)*normalization;
export const densityAtScene=position=>stellarDensity(...toGalactic(position));
function diskNumber(scale,height,fraction){const m=MILKY_WAY,q=m.radius/scale;return normalization*4*Math.PI*m.localDensity*fraction*Math.exp(m.solarRadius/scale)*scale**2*height*(1-(1+q)*Math.exp(-q));}
const thinNumber=diskNumber(MILKY_WAY.thinScale,MILKY_WAY.thinHeight,.94),thickNumber=diskNumber(MILKY_WAY.thickScale,MILKY_WAY.thickHeight,.06),barNumber=normalization*MILKY_WAY.barDensity*(2*Math.PI)**1.5*MILKY_WAY.barAxes.reduce((a,b)=>a*b,1);
// Approximate integral; spiral modulation averages to one. The tapered outer
// edge and very small halo make this a population scale, never a census.
export const VIRTUAL_STAR_COUNT=Math.round((thinNumber+thickNumber+barNumber)/(1-MILKY_WAY.haloFraction));
const palette=[[1,.32,.13],[1,.55,.28],[1,.78,.51],[1,.93,.79],[.65,.80,1],[.32,.57,1]];
export function milkyWayPopulation(count,seed=7319){
 const random=randomSequence(seed),p=new Float32Array(count*3),c=new Float32Array(count*3),m=MILKY_WAY,total=thinNumber+thickNumber+barNumber;
 for(let i=0;i<count;i++){
  const choice=random();let x,y,z,young=false,brightness=.19;
  if(choice<m.haloFraction){const radius=10000*(Math.pow(Math.max(.001,random()),-.4)-1),az=random()*TAU,u=random()*2-1;x=radius*Math.sqrt(1-u*u)*Math.cos(az);y=radius*Math.sqrt(1-u*u)*Math.sin(az);z=radius*u*.7;brightness=.018;}
  else if(choice<m.haloFraction+(1-m.haloFraction)*barNumber/total){const a=normal(random)*m.barAxes[0],b=normal(random)*m.barAxes[1];x=a*Math.cos(m.barAngle)-b*Math.sin(m.barAngle);y=a*Math.sin(m.barAngle)+b*Math.cos(m.barAngle);z=normal(random)*m.barAxes[2];brightness=.25;}
  else{const thick=random()<thickNumber/(thinNumber+thickNumber),scale=thick?m.thickScale:m.thinScale;let radius;do{radius=-Math.log(Math.max(1e-12,random()*random()))*scale;}while(radius>m.radius);
   young=!thick&&random()<m.armFraction;let theta=random()*TAU;
   if(young)theta=Math.floor(random()*4)*Math.PI/2+Math.log(Math.max(3500,radius)/8500)/Math.tan(m.pitch)+.35+normal(random)*.10;
   x=radius*Math.cos(theta);y=radius*Math.sin(theta);z=(random()<.5?-1:1)*-Math.log(Math.max(1e-12,random()))*(thick?m.thickHeight:m.thinHeight)+warpHeight(radius,theta);
   const dust=Math.min(.65,arms(radius,theta)*.075)*Math.exp(-Math.abs(z)/320);brightness=(young?.38:.18)*(1-dust)*Math.exp(-Math.max(0,radius-30000)/20000);
  }
  const tint=random(),color=palette[young?(tint<.7?5:4):(tint<.25?0:tint<.5?1:tint<.73?2:tint<.94?3:4)];brightness*=.7+random()*.6+Math.pow(random(),12)*1.8;
  const v=galacticPosition(x,y,z);for(let j=0;j<3;j++){p[i*3+j]=v[j];c[i*3+j]=color[j]*brightness;}
 }
 return {positions:p,colors:c};
}
export function sectorCount(x,y,z){
 const r=randomSequence(hash(x,y,z,-2)),mean=densityAtScene([(x+.5)*SECTOR_SIZE,(y+.5)*SECTOR_SIZE,(z+.5)*SECTOR_SIZE])*SECTOR_SIZE**3;
 if(mean>32)return Math.max(0,Math.round(mean+Math.sqrt(mean)*normal(r)));
 let n=0,product=1,threshold=Math.exp(-mean);do{n++;product*=r();}while(product>threshold);return n-1;
}
export function sectorStar(x,y,z,index){
 const r=randomSequence(hash(x,y,z,index)),position=[(x+r())*SECTOR_SIZE,(y+r())*SECTOR_SIZE,(z+r())*SECTOR_SIZE],type=r(),spect=type<.72?'M':type<.88?'K':type<.95?'G':type<.984?'F':type<.997?'A':'B',properties={M:[12,.22],K:[7,.72],G:[4.8,1],F:[3,1.4],A:[1,2],B:[-2,4]}[spect];
 const absoluteMagnitude=properties[0]+normal(r)*1.1,radiusKm=properties[1]*695700,color={M:'#ff9966',K:'#ffc088',G:'#fff1cf',F:'#fff7ea',A:'#d2e3ff',B:'#9fc5ff'}[spect];
 return {id:`model-v2-${x}-${y}-${z}-${index}`,name:`Estrella modelada ${x}:${y}:${z}/${index}`,cosmic:true,modeled:true,kind:'star',position:position.map(v=>v*LY_KM),distanceLy:Math.hypot(...position),color,spect,absoluteMagnitude,radiusKm,viewDistanceKm:Math.max(radiusKm*6,.0001*LY_KM),source:'Población estadística de la Vía Láctea · CNS5 / ESA Gaia',sourceUrl:MW_SOURCES.density,summary:'Estrella procedural del disco, barra o halo de la Vía Láctea. Conserva identidad, posición, color y propiedades al volver al mismo sector. Las propiedades son simuladas y su radio es una estimación de clase. No corresponde a una estrella identificada, una distancia medida o un sistema planetario observado.'};
}
export function sectorPopulation(x,y,z,limit=Infinity){return Array.from({length:Math.min(sectorCount(x,y,z),limit)},(_,i)=>sectorStar(x,y,z,i));}
export function sectorNeighborhood(observer,budget=SECTOR_BUDGET){
 const cell=observer.map(v=>Math.floor(v/SECTOR_SIZE)),anchor=cell.map(v=>v*SECTOR_SIZE),plan=[];
 for(let z=-SECTOR_SPAN;z<=SECTOR_SPAN;z++)for(let y=-SECTOR_SPAN;y<=SECTOR_SPAN;y++)for(let x=-SECTOR_SPAN;x<=SECTOR_SPAN;x++){
  const a=cell[0]+x,b=cell[1]+y,c=cell[2]+z,count=sectorCount(a,b,c),distance=Math.hypot((a+.5)*SECTOR_SIZE-observer[0],(b+.5)*SECTOR_SIZE-observer[1],(c+.5)*SECTOR_SIZE-observer[2]);
  if(distance>SECTOR_RADIUS+SECTOR_SIZE)continue;plan.push({cell:[a,b,c],count,near:distance<28,quota:distance<28?count:Math.min(count,96)});
 }
 const near=plan.filter(x=>x.near).reduce((s,x)=>s+x.quota,0),far=plan.filter(x=>!x.near).reduce((s,x)=>s+x.quota,0),scale=Math.min(1,Math.max(0,budget-near)/Math.max(1,far)),nearScale=Math.min(1,budget/Math.max(1,near));
 for(const item of plan)item.quota=Math.floor(item.quota*(item.near?nearScale:scale));
 const count=plan.reduce((s,x)=>s+x.quota,0),positions=new Float32Array(count*3),colors=new Float32Array(count*3),magnitudes=new Float32Array(count),ids=new Int32Array(count*4);let n=0;
 for(const item of plan)for(let i=0;i<item.quota;i++){
  const star=sectorStar(...item.cell,i);for(let j=0;j<3;j++)positions[n*3+j]=star.position[j]/LY_KM-anchor[j];
  const rgb={M:[1,.32,.13],K:[1,.55,.28],G:[1,.85,.63],F:[1,.94,.83],A:[.65,.80,1],B:[.32,.57,1]}[star.spect];colors.set(rgb,n*3);magnitudes[n]=star.absoluteMagnitude;ids.set([...item.cell,i],n*4);n++;
 }
 return {anchor,positions,colors,magnitudes,ids,represented:plan.reduce((s,x)=>s+x.count,0),count};
}
