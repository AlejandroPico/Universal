import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

// Keep NASA's mesh, UV atlas, materials and local origin together.
export const BODY_MODELS = {
 "jupiter":{"file":"jupiter.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/jupiter-3d-model/","note":"Modelo NASA con achatamiento y mapeado originales. Orientación del polo medio J2000 según JPL; las nubes son una instantánea, no meteorología en tiempo real.","kmPerUnit":142.984,"pole":[268.056595,64.495303]},
 "saturn":{"file":"saturn.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/saturn-3d-model/","note":"Modelo NASA con achatamiento y mapeado originales. Orientación del polo medio J2000 según JPL; las nubes son una instantánea, no meteorología en tiempo real. Incluye la geometría y textura radial de los anillos del modelo NASA; no reproduce todos los anillos tenues exteriores.","kmPerUnit":120.536,"pole":[40.589,83.537],"collisionRadiusKm":60268},
 "uranus":{"file":"uranus.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/uranus-3d-model/","note":"Modelo NASA con achatamiento y mapeado originales. Orientación del polo medio J2000 según JPL; las nubes son una instantánea, no meteorología en tiempo real.","kmPerUnit":51.118,"pole":[257.311,-15.175]},
 "neptune":{"file":"neptune.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/neptune-3d-model/","note":"Modelo NASA con achatamiento y mapeado originales. Orientación del polo medio J2000 según JPL; las nubes son una instantánea, no meteorología en tiempo real.","kmPerUnit":49.528,"pole":[299.36,43.46]},
 "pluto":{"file":"pluto.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/pluto-3d-model/","note":"Modelo NASA basado en New Horizons. La cobertura es desigual: las zonas de baja resolución o sin detalle no equivalen a un escaneo orbital completo."},
 "charon":{"file":"charon.glb","referenceRadius":302,"source":"https://science.nasa.gov/resource/charon-3d-model/","note":"Modelo NASA basado en New Horizons. La cobertura es desigual: las zonas de baja resolución o sin detalle no equivalen a un escaneo orbital completo."},
 "mimas":{"file":"mimas.glb","source":"https://science.nasa.gov/resource/mimas-3d-model/","note":"Modelo NASA con su forma no esférica y mapeado original. Se conservan las dimensiones del modelo; la resolución varía por región.","kmPerUnit":1},
 "tethys":{"file":"tethys.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/tethys-3d-model/","note":"Modelo NASA: geometría, mapeado y materiales originales. La resolución y cobertura varían según las observaciones disponibles."},
 "dione":{"file":"dione.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/dione-3d-model/","note":"Modelo NASA: geometría, mapeado y materiales originales. La resolución y cobertura varían según las observaciones disponibles."},
 "rhea":{"file":"rhea.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/rhea-3d-model/","note":"Modelo NASA: geometría, mapeado y materiales originales. La resolución y cobertura varían según las observaciones disponibles."},
 "iapetus":{"file":"iapetus.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/iapetus-3d-model/","note":"Modelo NASA: geometría, mapeado y materiales originales. La resolución y cobertura varían según las observaciones disponibles."},
 "miranda":{"file":"miranda.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/miranda-3d-model/","note":"Modelo NASA: geometría, mapeado y materiales originales. La resolución y cobertura varían según las observaciones disponibles."},
 "ariel":{"file":"ariel.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/ariel-3d-model/","note":"Modelo NASA: geometría, mapeado y materiales originales. La resolución y cobertura varían según las observaciones disponibles."},
 "umbriel":{"file":"umbriel.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/umbriel-3d-model/","note":"Modelo NASA: geometría, mapeado y materiales originales. La resolución y cobertura varían según las observaciones disponibles."},
 "titania":{"file":"titania.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/titania-3d-model/","note":"Modelo NASA: geometría, mapeado y materiales originales. La resolución y cobertura varían según las observaciones disponibles."},
 "oberon":{"file":"oberon.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/oberon-3d-model/","note":"Modelo NASA: geometría, mapeado y materiales originales. La resolución y cobertura varían según las observaciones disponibles."},
 "triton":{"file":"triton.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/triton-3d-model/","note":"Modelo NASA: geometría, mapeado y materiales originales. La resolución y cobertura varían según las observaciones disponibles."},
 "ceres":{"file":"ceres.glb","source":"https://science.nasa.gov/resource/ceres-3d-model/","note":"Modelo NASA con su forma no esférica y mapeado original. Se conservan las dimensiones del modelo; la resolución varía por región.","kmPerUnit":1},
 "vesta":{"file":"vesta.glb","source":"https://science.nasa.gov/resource/vesta-3d-model/","note":"Modelo NASA con su forma no esférica y mapeado original. Se conservan las dimensiones del modelo; la resolución varía por región.","kmPerUnit":0.1},
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
 return {root:wrapper,meshes,extentKm:spec.collisionRadiusKm ?? extentKm,visualExtentKm:extentKm};
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
