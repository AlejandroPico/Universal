import * as THREE from 'three';
export const STAR_DISPLAY_RADIUS=696340;
const LY=9.4607304725808e12;
export const KNOWN_MAGNETARS=new Set(['J1745-2900','J1935+2154']);
export function stellarProfile(item){
 if(!item||item.noLocation||!Array.isArray(item.position))return null;
 const kind=String(item.stellarType||item.subtype||item.kind||'').toLowerCase().replace(/[ _]/g,'-');
 let type=kind;
 if(KNOWN_MAGNETARS.has(String(item.id).replace(/^psr-/,'')))type='magnetar';
 if(['black-hole','blackhole','stellar-black-hole','supermassive-black-hole'].includes(type)){
  const measured=Number(item.radiusKm)>0||Number(item.massSolar)>0;
  return {type:'black-hole',radius:Number(item.radiusKm)>0?Number(item.radiusKm):Number(item.massSolar)>0?2.95325*Number(item.massSolar):STAR_DISPLAY_RADIUS,color:'#000000',label:'Lente gravitatoria',source:item.sourceUrl||'https://science.nasa.gov/universe/black-holes/',note:measured?'Modelo óptico de agujero negro sin rotación sobre el entorno de este objeto.':'Lente gravitatoria ilustrativa: escala de referencia, sin masa ni radio medidos disponibles.'};
 }
 if(['supernova','supernova-remnant','snr'].includes(type))return {type:'remnant',radius:Number(item.radiusLy)>0?Number(item.radiusLy)*LY:STAR_DISPLAY_RADIUS,color:item.color||'#ffad78',label:'Envoltura del remanente',source:item.sourceUrl||'https://imagine.gsfc.nasa.gov/science/objects/supernovae1.html',note:'Envoltura filamentosa esquemática. Su forma, colores y estructura interna son ilustrativos; no es una fotografía ni una simulación de la explosión. No se presupone una estrella central.'};
 if(['neutron-star','neutron','pulsar','magnetar','white-dwarf','blue-dwarf','brown-dwarf','star'].includes(type)){
  const compact=['pulsar','magnetar','neutron-star','neutron'].includes(type);
  return {type:compact?type:'star',radius:STAR_DISPLAY_RADIUS,color:type==='magnetar'?'#a8caff':compact?'#c6e7ff':item.color||'#fff1d0',label:compact?'Recreación de objeto compacto':'Superficie ilustrativa',source:compact?'https://imagine.gsfc.nasa.gov/science/objects/neutron_stars1.html':'https://svs.gsfc.nasa.gov/30362/',note:compact?'Recreación ilustrativa con tamaño de referencia ampliado. Superficie, inclinación, haces de radiación y líneas magnéticas no son una imagen medida. Rotación ralentizada (mínimo 4 segundos por vuelta); no representa la velocidad real ni chorros de materia.':'Superficie solar reutilizada con el color del catálogo y tamaño solar de referencia; no representa un diámetro medido ni una fotografía de esta estrella.'};
 }
 return null;
}
export function makeStellarFeatures(){
 const r=STAR_DISPLAY_RADIUS,spinner=new THREE.Group(),magnetic=new THREE.Group();magnetic.rotation.z=.5;spinner.add(magnetic);
 const beams=new THREE.Group();magnetic.add(beams);
 for(const sign of [-1,1]){
  const mesh=new THREE.Mesh(new THREE.ConeGeometry(r*.65,r*5,40,1,true),new THREE.MeshBasicMaterial({color:'#99dbff',transparent:true,opacity:.14,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,toneMapped:false}));
  mesh.position.y=sign*r*3.5;mesh.rotation.z=sign>0?Math.PI:0;beams.add(mesh);
 }
 const fields=new THREE.Group();magnetic.add(fields);
 for(let j=0;j<12;j++){
  const phi=j/12*Math.PI*2,points=[];
  for(let k=0;k<=96;k++){
   const theta=.25+k/96*(Math.PI-.5),radius=r*3*Math.sin(theta)**2;
   points.push(new THREE.Vector3(radius*Math.sin(theta)*Math.cos(phi),radius*Math.cos(theta),radius*Math.sin(theta)*Math.sin(phi)));
  }
  fields.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:'#c992ff',transparent:true,opacity:.42,depthWrite:false,toneMapped:false})));
 }
 const shell=new THREE.Group();
 for(let j=0;j<28;j++){
  const points=[];
  for(let k=0;k<=128;k++){
   const a=k/128*Math.PI*2,rad=r*(1+.075*Math.sin(a*7+j)*Math.cos(a*3-j));
   points.push(new THREE.Vector3(Math.cos(a)*rad,Math.sin(a)*rad,0));
  }
  const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:j%3?'#ffad78':'#80cfff',transparent:true,opacity:.23,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));
  line.rotation.set(j*.73,j*1.13,j*.31);shell.add(line);
 }
 return {spinner,beams,fields,shell};
}
