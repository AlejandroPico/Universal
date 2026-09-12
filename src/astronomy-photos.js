import * as THREE from 'three';
import { galacticPosition,equatorialPosition,LY_KM,COSMIC_OBJECTS } from './cosmic-data.js';
import {equatorialBasis} from './atlas-data.js';
import {M31_PHOTO,andromedaPhotoPosition} from './andromeda-geometry.js';
export class AstronomyPhotos {
 constructor(owner){
  this.owner=owner;this.ready={sky:false,andromeda:false};
  const loader=owner.textureLoader||new THREE.TextureLoader();
  const load=(file,key)=>{const t=loader.load(`${(import.meta.env?.BASE_URL||'/')}textures/${file}`,()=>{this.ready[key]=true;},undefined,error=>console.error('Fotografía astronómica',file,error));t.colorSpace=THREE.SRGBColorSpace;return t;};
  const geometry=new THREE.SphereGeometry(1,96,64),p=geometry.attributes.position;
  for(let i=0;i<p.count;i++){const a=galacticPosition(p.getX(i),-p.getZ(i),p.getY(i));p.setXYZ(i,...a);}geometry.computeVertexNormals();
  this.sky=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({map:load('milky-way-eso0932a.jpg','sky'),side:THREE.BackSide,depthWrite:false,depthTest:true,transparent:true,opacity:0,toneMapped:false}));
  this.sky.frustumCulled=false;this.sky.renderOrder=-300;owner.scene.add(this.sky);
  this.item=COSMIC_OBJECTS.find(x=>x.id==='andromeda');
  const material=new THREE.MeshBasicMaterial({map:load('andromeda-full-dss2.jpg','andromeda'),transparent:true,depthWrite:false,toneMapped:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});
  material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <alphamap_fragment>',`#include <alphamap_fragment>
    vec2 edge=abs(vMapUv-.5)*2.0;
    diffuseColor.a*=(1.0-smoothstep(.72,1.0,max(edge.x,edge.y)))*smoothstep(.002,.04,max(diffuseColor.r,max(diffuseColor.g,diffuseColor.b)));
  `);};
  this.andromeda=new THREE.Mesh(new THREE.PlaneGeometry(1,1),material);
  this.photoCenter=andromedaPhotoPosition(this.item.distanceLy);
  const b=equatorialBasis(this.photoCenter),normal=new THREE.Vector3(...b.normal);
  this.andromeda.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(...b.right),new THREE.Vector3(...b.up),normal));this.andromeda.rotateZ(THREE.MathUtils.degToRad(-M31_PHOTO.northLeftDeg));
  const width=2*this.item.distanceLy*LY_KM*Math.tan(THREE.MathUtils.degToRad(M31_PHOTO.widthArcmin/60)/2);
  this.andromeda.scale.set(width,width*M31_PHOTO.heightArcmin/M31_PHOTO.widthArcmin,1);this.normal=normal;owner.scene.add(this.andromeda);
 }
 update(origin,distance,layers){
  const observer=this.owner.camera.position.clone().add(origin),s=(a,b,x)=>THREE.MathUtils.smoothstep(x,a,b);
  this.sky.material.opacity=(1-s(100,1000,observer.length()/LY_KM))*.8;
  this.sky.visible=layers.sky&&this.ready.sky&&this.sky.material.opacity>.001;
  this.sky.position.copy(this.owner.camera.position);this.sky.scale.setScalar(Math.max(distance*3,LY_KM*100));
  this.andromeda.position.fromArray(this.photoCenter).sub(origin);
  const delta=observer.clone().sub(new THREE.Vector3(...this.item.position)),range=delta.length()/LY_KM;
  this.photoOpacity=s(.78,.97,delta.normalize().dot(this.normal))*s(this.item.radiusLy*.7,this.item.radiusLy*2,range)*(1-s(this.item.radiusLy*50,this.item.radiusLy*120,range));
  if(!layers.galaxies||!this.ready.andromeda)this.photoOpacity=0;
  this.andromeda.material.opacity=this.photoOpacity;this.andromeda.visible=this.photoOpacity>.001;
 }
}
