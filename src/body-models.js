import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

// Keep NASA's mesh, UV atlas, materials and local origin together.
export const BODY_MODELS = {
 mercury:{file:'mercury.glb',referenceRadius:500,source:'https://science.nasa.gov/mercury/',note:'Modelo NASA con su mapeado original. La iluminación depende de la posición del Sol.'},
 phobos:{file:'phobos.glb',kmPerUnit:1,source:'https://science.nasa.gov/resource/phobos-mars-moon-3d-model/',note:'Forma irregular y textura del modelo NASA/JPL-Caltech. Dimensiones en kilómetros; no es una esfera.'},
 deimos:{file:'deimos.glb',kmPerUnit:1,source:'https://science.nasa.gov/resource/deimos-mars-moon-3d-model/',note:'Forma irregular y textura del modelo NASA/JPL-Caltech. Dimensiones en kilómetros; no es una esfera.'},
 'venus-clouds':{file:'venus-clouds.glb',referenceRadius:500,source:'https://science.nasa.gov/resource/venus-3d-model/',note:'Apariencia nubosa del modelo NASA. La superficie queda oculta bajo la atmósfera.'},
 'venus-surface':{file:'venus-surface.glb',referenceRadius:500,source:'https://science.nasa.gov/resource/venus-surface-3d-model/',note:'Cartografía de superficie del modelo NASA, basada en radar. Los colores no son una vista humana a través de las nubes ni representan por sí solos la altura.'},
};
export const defaultBodyModel=id=>id==='venus'?'venus-clouds':BODY_MODELS[id]?id:null;

export function prepareBodyModel(model, spec, radiusKm, item, anisotropy=1){
 const wrapper=new THREE.Group();wrapper.add(model);
 wrapper.scale.setScalar(spec.kmPerUnit ?? radiusKm/spec.referenceRadius);
 const meshes=[];
 model.traverse(child=>{
  if(!child.isMesh)return;
  child.userData.item=item;meshes.push(child);
  for(const material of [child.material].flat()){
   // These are rocky/cloud surfaces, not metals (some source GLBs use 0.5).
   material.metalness=0;
   for(const key of ['map','normalMap','roughnessMap'])if(material[key])material[key].anisotropy=anisotropy;
  }
 });
 wrapper.updateMatrixWorld(true);
 // Use actual vertex radii, not the box diagonal (which overestimates a sphere).
 let extentKm=0;const p=new THREE.Vector3();
 for(const mesh of meshes){const a=mesh.geometry.attributes.position;for(let i=0;i<a.count;i++){p.fromBufferAttribute(a,i).applyMatrix4(mesh.matrixWorld);extentKm=Math.max(extentKm,p.length());}}
 if(!meshes.length||!Number.isFinite(extentKm)||extentKm<=0)throw Error('Modelo celeste sin geometría válida');
 return {root:wrapper,meshes,extentKm};
}

export async function setBodyModel(scene,node,key){
 const spec=BODY_MODELS[key];if(!spec)throw Error('Modelo celeste desconocido');
 node.requestedModel=key;node.modelPending=key;node.modelError=null;
 scene.onBodyModelChange?.(node.definition.id);
 node.modelCache??=new Map();
 let task=node.modelCache.get(key);
 if(!task){
  task=new GLTFLoader().loadAsync(`${import.meta.env?.BASE_URL??'/'}models/${spec.file}`).then(gltf=>{
   const result=prepareBodyModel(gltf.scene,spec,node.definition.radiusKm,node.surface.userData.item,Math.min(8,scene.renderer.capabilities.getMaxAnisotropy()));
   result.root.visible=false;node.spin.add(result.root);scene.interactive.push(...result.meshes);return result;
  }).catch(error=>{node.modelCache.delete(key);throw error;});
  node.modelCache.set(key,task);
 }
 let result;
 try{result=await task;}catch(error){if(node.requestedModel===key){node.modelPending=null;node.modelError=error.message;scene.onBodyModelChange?.(node.definition.id);}throw error;}
 if(node.requestedModel!==key)return false;
 if(node.bodyModel)node.bodyModel.root.visible=false;
 result.root.visible=true;node.surface.visible=false;node.bodyModel=result;node.activeModel=key;
 node.extentKm=result.extentKm;node.modelPending=null;
 scene.onBodyModelChange?.(node.definition.id);
 if(scene.focus?.type==='body'&&scene.focus.id===node.definition.id){
  scene.controls.minDistance=result.extentKm+.08;
  if(scene.camera.position.length()<scene.controls.minDistance)scene.camera.position.setLength(scene.controls.minDistance);
 }
 return true;
}
