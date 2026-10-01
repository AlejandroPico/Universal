import * as THREE from 'three';
import {LY_KM} from './cosmic-data.js';
import {pointIntensityShader} from './point-intensity.js';
import {sectorNeighborhood,sectorStar,SECTOR_SIZE,SECTOR_RADIUS,SECTOR_BUDGET} from './milky-way-model.js';
export {sectorPopulation} from './milky-way-model.js';
export class GalacticSectors{
 constructor(owner){
  this.owner=owner;this.key='';this.requestKey='';this.pointGain={value:1.8};this.magnitudeLimit={value:8.5};this.unit={value:1};this.anchor=new THREE.Vector3();this.state='idle';this.ids=new Int32Array();this.count=0;this.represented=0;
  const material=new THREE.PointsMaterial({size:2,sizeAttenuation:false,vertexColors:true,map:owner.dotTexture,transparent:true,depthWrite:false,blending:THREE.NormalBlending,toneMapped:false});
  material.onBeforeCompile=shader=>{
   shader.uniforms.sectorUnit=this.unit;shader.uniforms.sectorMagnitudeLimit=this.magnitudeLimit;
   shader.vertexShader='attribute float absoluteMagnitude;uniform float sectorUnit,sectorMagnitudeLimit;varying float sectorAlpha;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('gl_PointSize = size;',`float d=length(mvPosition.xyz)*sectorUnit;float apparent=absoluteMagnitude+5.0*log(max(.00001,d/3.261563777))/log(10.0)-5.0;sectorAlpha=(1.0-smoothstep(56.0,${SECTOR_RADIUS.toFixed(1)},d))*smoothstep(.03,.08,d)*(1.0-smoothstep(sectorMagnitudeLimit-1.0,sectorMagnitudeLimit+.5,apparent));gl_PointSize=clamp((sectorMagnitudeLimit-apparent)*.5+1.0,1.0,5.0);`);
   shader.fragmentShader='varying float sectorAlpha;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.a*=sectorAlpha;if(diffuseColor.a<.002)discard;');pointIntensityShader(shader,this.pointGain);
  };
  const empty=new THREE.BufferGeometry();empty.setAttribute('position',new THREE.BufferAttribute(new Float32Array(),3));empty.setAttribute('color',new THREE.BufferAttribute(new Float32Array(),3));empty.setAttribute('absoluteMagnitude',new THREE.BufferAttribute(new Float32Array(),1));this.node=new THREE.Points(empty,material);this.node.frustumCulled=false;this.node.scale.setScalar(LY_KM);this.node.visible=false;owner.scene.add(this.node);
  if(typeof Worker!=='undefined'){
   this.worker=new Worker(new URL('./galactic-worker.js',import.meta.url),{type:'module'});
   this.worker.onmessage=({data})=>{this.busy=false;if(data.key===this.requestKey){if(data.error){this.state='error';console.error('Galactic sectors:',data.error);}else this.install(data);}if(this.pending){const next=this.pending;this.pending=null;this.dispatch(next);}};
   this.worker.onerror=()=>{this.busy=false;this.state='error';this.worker.terminate();this.worker=null;this.pending=null;this.requestKey='';};
  }
 }
 install(data){
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(data.positions,3));geometry.setAttribute('color',new THREE.BufferAttribute(data.colors,3));geometry.setAttribute('absoluteMagnitude',new THREE.BufferAttribute(data.magnitudes,1));
  this.node.geometry.dispose();this.node.geometry=geometry;this.anchor.fromArray(data.anchor);this.ids=data.ids;this.count=data.count;this.represented=data.represented;this.key=data.key;this.state='ready';
 }
 dispatch(request){
  if(this.worker){this.busy=true;this.worker.postMessage(request);}else{this.install({key:request.key,...sectorNeighborhood(request.observer,request.budget)});}
 }
 update(origin,distance,enabled){
  const observer=this.owner.camera.position.clone().add(origin).divideScalar(LY_KM),solDistance=observer.length();
  this.node.visible=enabled&&distance<1200*LY_KM&&solDistance>120&&solDistance<150000;
  if(!this.node.visible){this.pending=null;return;}
  const position=observer.toArray(),key=position.map(v=>Math.floor(v/SECTOR_SIZE)).join(':');
  if(key!==this.requestKey){this.requestKey=key;this.state='loading';const request={type:'sectors',key,observer:position,budget:SECTOR_BUDGET};if(this.busy)this.pending=request;else this.dispatch(request);}
  this.node.position.copy(this.anchor).multiplyScalar(LY_KM).sub(origin);this.unit.value=this.owner.renderUnit/LY_KM;
  this.node.material.opacity=THREE.MathUtils.smoothstep(solDistance,120,250)*(1-THREE.MathUtils.smoothstep(distance/LY_KM,300,1200))*.85;
 }
 pick(camera,direction,angle){
  if(!this.node.visible||this.state!=='ready')return null;
  const candidates=[],p=this.node.geometry.getAttribute('position');
  for(let i=0;i<this.count;i++){
   const position=[(p.getX(i)+this.anchor.x)*LY_KM,(p.getY(i)+this.anchor.y)*LY_KM,(p.getZ(i)+this.anchor.z)*LY_KM],v=position.map((x,j)=>x-camera[j]),distance=Math.hypot(...v),along=v.reduce((s,x,j)=>s+x*direction[j],0);
   if(along<=0||distance>SECTOR_RADIUS*LY_KM||distance<.08*LY_KM)continue;const offset=Math.acos(Math.min(1,along/distance));if(offset>angle)continue;
   const star=sectorStar(...this.ids.subarray(i*4,i*4+4)),apparent=star.absoluteMagnitude+5*Math.log10(distance/LY_KM/3.261563777)-5;
   if(apparent<this.magnitudeLimit.value+.5)candidates.push({item:star,distance,angle:offset});
  }
  return candidates.sort((a,b)=>a.angle-b.angle)[0]||null;
 }
 dispose(){this.worker?.terminate();this.node.geometry.dispose();this.node.material.dispose();this.owner.scene.remove(this.node);}
}
