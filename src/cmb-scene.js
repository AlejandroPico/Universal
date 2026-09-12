import * as THREE from 'three';
import { galacticPosition,LY_KM } from './cosmic-data.js';
import planck from '../public/data/atlas/planck.json' with {type:'json'};
export const CMB_RADIUS_KM=45.5e9*LY_KM;
export class MicrowaveBackground {
 constructor(owner){
  this.owner=owner;this.ready=false;this.opacity=.85;this.survey='planck';this.loading=false;
  const geo=new THREE.SphereGeometry(1,192,96),p=geo.attributes.position;
  for(let i=0;i<p.count;i++)p.setXYZ(i,...galacticPosition(p.getX(i),-p.getZ(i),p.getY(i)));
  this.node=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,depthTest:true,toneMapped:false,side:THREE.FrontSide}));
  this.node.scale.setScalar(CMB_RADIUS_KM);this.node.renderOrder=-80;this.node.visible=false;owner.scene.add(this.node);
 }
 load(){
  if(this.loading||this.ready||this.error)return;
  this.loading=true;const survey=this.survey;
  const max=this.owner.renderer?.capabilities.maxTextureSize||8192;
  const mobile=typeof matchMedia!=='undefined'&&matchMedia('(max-width:760px)').matches;
  const file=survey==='wmap'?'textures/cmb-wmap-equirectangular.png':planck.files.find(x=>x.width===(mobile||max<8192?4096:8192)).file;
  const map=(this.owner.textureLoader||new THREE.TextureLoader()).load(`${import.meta.env?.BASE_URL||'/'}${file}`,()=>{
   if(survey!==this.survey){map.dispose();return;}
   this.node.material.map?.dispose();this.node.material.map=map;this.node.material.needsUpdate=true;this.ready=true;this.loading=false;
  },undefined,()=>{if(survey===this.survey){this.error=true;this.loading=false;}});
  map.colorSpace=THREE.SRGBColorSpace;
  // CDS CAR longitudes decrease to the right; Three's sphere UV increases.
  if(survey==='planck'){map.repeat.x=-1;map.offset.x=1;}
 }
 setSurvey(id){if(!['planck','wmap'].includes(id))return;this.survey=id;this.ready=false;this.loading=false;this.error=false;this.load();}
 update(origin,distance,enabled){
  if(enabled&&distance/LY_KM>5e9)this.load();
  const observer=this.owner.camera.position.clone().add(origin),outside=observer.length()>CMB_RADIUS_KM;
  this.node.position.copy(origin).negate();
  this.node.material.side=outside?THREE.FrontSide:THREE.BackSide;
  this.node.material.opacity=this.opacity*THREE.MathUtils.smoothstep(distance/LY_KM,28e9,65e9);
  this.node.visible=enabled&&this.ready&&this.node.material.opacity>.001;
 }
}
