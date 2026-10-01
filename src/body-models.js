import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MEASURED_MOON_MODELS,STOOKE_BODY_MODELS} from './measured-moon-models.js';

// Keep NASA's mesh, UV atlas, materials and local origin together.
export const BODY_MODELS = {
 ...MEASURED_MOON_MODELS,
 'hartley-2':{file:'hartley-2-epoxi.obj',format:'obj',kmPerUnit:1,source:'https://pdssbn.astro.umd.edu/holdings/dif-c-hriv_mri-5-hartley2-shape-v1.0/dataset.shtml',note:'Hartley 2 · forma bilobulada EPOXI, Farnham y Thomas / NASA PDS (2013). 16.022 vértices y 32.040 placas, en kilómetros. Incertidumbre media de 18 m; parte de la cara no observada está limitada por siluetas. Material neutro, orientación ilustrativa sin reproducir su rotación compleja.'},
 "io":{"file":"io.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/io-3d-model/","note":"Modelo NASA/VTAD: malla, atlas UV y materiales originales. Cartografía de resolución y cobertura variables, sin meteorología ni evolución de la superficie en tiempo real."},
 "europa":{"file":"europa.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/europa-3d-model/","note":"Modelo NASA/VTAD: malla, atlas UV y materiales originales. Cartografía de resolución y cobertura variables, sin meteorología ni evolución de la superficie en tiempo real."},
 "ganymede":{"file":"ganymede.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/ganymede-3d-model/","note":"Modelo NASA/VTAD: malla, atlas UV y materiales originales. Cartografía de resolución y cobertura variables, sin meteorología ni evolución de la superficie en tiempo real."},
 "callisto":{"file":"callisto.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/callisto-3d-model/","note":"Modelo NASA/VTAD: malla, atlas UV y materiales originales. Cartografía de resolución y cobertura variables, sin meteorología ni evolución de la superficie en tiempo real."},
 "enceladus":{"file":"enceladus.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/enceladus-3d-model/","note":"Modelo NASA/VTAD: malla, atlas UV y materiales originales. Cartografía de resolución y cobertura variables, sin meteorología ni evolución de la superficie en tiempo real."},
 "titan":{"file":"titan.glb","referenceRadius":500,"source":"https://science.nasa.gov/resource/titan-3d-model/","note":"Modelo NASA/VTAD: malla, atlas UV y materiales originales. Cartografía de resolución y cobertura variables, sin meteorología ni evolución de la superficie en tiempo real."},
 'hyperion-nasa':{file:'hyperion-nasa.glb',kmPerUnit:1,source:'https://science.nasa.gov/resource/hyperion-3d-model/',note:'Hiperión · modelo texturizado NASA/VTAD, geometría y materiales originales. Escala nativa en kilómetros; orientación de inspección ilustrativa, sin simular su rotación caótica.'},
 'earth-relief':{texture:'earth-relief.jpg',assetPath:'science-textures/earth-relief.jpg',referenceRadius:500,unlit:true,source:'https://www.ncei.noaa.gov/products/etopo-global-relief-model',note:'Tierra · relieve ETOPO1 NOAA/NCEI (2009), imagen coloreada de 2010. Batimetría y topografía con superficie de hielo, sombreado incluido. Copia de visualización 4096 × 2048; no mide cotas al pulsar.'},
 mars:{original:true,source:'https://github.com/nasa/NASA-3D-Resources',note:'Marte · cartografía de superficie NASA. Iluminación solar del visor.'},
 'mars-elevation':{texture:'mars-elevation.jpg',referenceRadius:500,unlit:true,source:'https://svs.gsfc.nasa.gov/4436/',note:'Marte · elevación global MGS/MOLA, NASA (2016). Morado y azul: terreno bajo; rojo y blanco: alto. Relieve sombreado del mapa, sin desplazar la geometría ni medir cotas al pulsar.'},
 'mars-gravity':{texture:'mars-gravity.jpg',referenceRadius:500,unlit:true,source:'https://svs.gsfc.nasa.gov/4436/',note:'Marte · anomalías de gravedad free-air GMM-3, NASA (2016). Morado/azul: gravedad inferior a la media; rojo/blanco: superior, en mGal. Datos procesados, no color visible de la superficie.'},
 'mars-bouguer':{texture:'mars-bouguer.jpg',referenceRadius:500,unlit:true,source:'https://svs.gsfc.nasa.gov/4436/',note:'Marte · anomalía Bouguer GMM-3. Se sustrae el efecto de la topografía para mostrar la estructura bajo la superficie. Morado/azul: anomalía negativa; rojo/blanco: positiva. NASA (2016).'},
 'mars-crust':{texture:'mars-crust.jpg',referenceRadius:500,unlit:true,source:'https://svs.gsfc.nasa.gov/4436/',note:'Marte · espesor cortical inferido de GMM-3 asumiendo densidad uniforme. Colores de datos con relieve sombreado; resolución 1024 × 512. Es una inferencia geofísica, no una fotografía. NASA (2016).'},
"ryugu":{"file": "ryugu.obj", "assetPath": "science-models/ryugu.obj", "kmPerUnit": 1, "format": "obj", "source": "https://doi.org/10.17597/isas.darts/hyb2-00600", "note": "Ryugu · forma medida Hayabusa2/JAXA, modelo SPC de 49.152 facetas (23-03-2020), distribuido por DARTS/NAIF. Sin textura fotográfica: material neutro para mostrar la geometría; orientación de inspección ilustrativa. Crédito: JAXA / equipo Hayabusa2, CC BY 4.0."},
"churyumov-gerasimenko":{"file": "churyumov-gerasimenko.obj", "format": "obj", "kmPerUnit": 1, "source": "https://naif.jpl.nasa.gov/pub/naif/ROSETTA/kernels/dsk/ROS_CG_K024_OSPCLPS_N_V2.OBJ", "note": "67P · forma bilobulada medida por Rosetta/OSIRIS, modelo ESA distribuido por NASA/NAIF. Geometría original en kilómetros, sin textura fotográfica; orientación de inspección ilustrativa."},
"tempel-1":{"file": "tempel-1.obj", "format": "obj", "kmPerUnit": 1, "source": "https://naif.jpl.nasa.gov/pub/naif/ROSETTA/kernels/dsk/TEMPEL1_9P_K032_THO_V01.OBJ", "note": "Tempel 1 · modelo de forma Thomas distribuido por NASA/NAIF. Malla original en kilómetros, material neutro sin inventar una cartografía; orientación de inspección ilustrativa."},
"halley":{"original": true, "source": "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=1P", "note": "Halley · aproximación elipsoidal con las dimensiones publicadas por JPL (14,9 × 8,2 km); tercer eje supuesto igual al menor. No es un escaneo 3D ni una textura global del núcleo. Órbita aproximada; retorno previsto en 2061."},

"sun":{"original": true, "source": "https://svs.gsfc.nasa.gov/30362/", "note": "Superficie solar animada ilustrativa, basada en cartografía ultravioleta NASA. No es una fotografía en luz visible."},"sun-304":{"texture": "sun-surface.jpg", "referenceRadius": 500, "unlit": true, "source": "https://svs.gsfc.nasa.gov/30362/", "note": "Sol · mosaico global STEREO/SDO de 2012 a 304 Å (ultravioleta extremo), en el color asignado por NASA. Mapa observado sin la animación ilustrativa; no es una observación actual ni luz visible."},"moon":{"original": true, "source": "https://svs.gsfc.nasa.gov/4720/", "note": "Luna · cartografía global LRO/LROC de NASA, con relieve LOLA."},"moon-altimetry":{"texture": "moon-height.jpg", "referenceRadius": 500, "unlit": true, "dataMap": true, "source": "https://svs.gsfc.nasa.gov/4720/", "note": "Luna · mapa global de elevación LRO/LOLA, NASA. Escala de grises: oscuro corresponde a cotas bajas y claro a cotas altas. Visualización normalizada del relieve, no fotografía ni medición de altura al pulsar."},"earth":{"original": true, "source": "https://svs.gsfc.nasa.gov/2915/", "note": "Tierra · imagen global NASA Blue Marble, iluminación y capas terrestres del visor."},"earth-night-science":{"texture": "earth-night-science.jpg", "referenceRadius": 500, "unlit": true, "source": "https://earthobservatory.nasa.gov/images/79765/night-lights-2012-map", "note": "Tierra · mosaico global nocturno Suomi NPP/VIIRS de 2012, NASA Earth Observatory. Composición de observaciones procesadas; muestra las luces de todas las longitudes a la vez, no la noche de la fecha del reloj."},"eros":{"file": "eros.glb", "kmPerUnit": 0.01, "source": "https://science.nasa.gov/resource/eros-3d-model/", "note": "Eros · modelo NASA con geometría y textura originales. Forma irregular; escala convertida a kilómetros."},"itokawa":{"file": "itokawa.glb", "kmPerUnit": 0.001, "source": "https://science.nasa.gov/resource/asteroid-itokawa-3d-model/", "note": "Itokawa · modelo NASA del asteroide visitado por Hayabusa. Se conserva su forma irregular y el mapeado original."},"bennu":{"file": "bennu.glb", "kmPerUnit": 0.001, "source": "https://science.nasa.gov/resource/bennu-3d-model/", "note": "Bennu · modelo NASA con forma y material originales. El detalle corresponde a este recurso, no a una reproducción de cada roca."},
 'mercury-enhanced':{texture:'mercury-enhanced.jpg',referenceRadius:500,source:'https://images.nasa.gov/details/PIA17386',note:'Mercurio · mosaico global MESSENGER PIA17386, NASA/JHUAPL/Carnegie. Color realzado para distinguir materiales de la superficie; no es el color que vería el ojo humano. Se conservan las limitaciones de cobertura polar del mapa original.'},
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
 ...STOOKE_BODY_MODELS,
 haumea:{original:true,pole:[285.1,-10.6],source:'https://arxiv.org/abs/2006.03113',note:'Haumea · elipsoide triaxial ajustado a ocultación y fotometría (Ortiz et al., 2017). Superficie neutra sin mapa observado. Polo del anillo adoptado para orientar el conjunto; fase de rotación ilustrativa.'},
 chariklo:{original:true,pole:[151.03,41.81],source:'https://arxiv.org/abs/2107.07904',note:'Cariclo · elipsoide ajustado a once ocultaciones, semiejes 143,8 × 135,2 × 99,1 km (Morgado et al., 2021). Superficie neutra, sin relieve medido. Se adopta el polo de C1R; fase de rotación ilustrativa.'},
 quaoar:{original:true,pole:[259.82,53.45],source:'https://arxiv.org/abs/2304.09237',note:'Quaoar · esfera de radio de referencia 555 km, sin cartografía observada. El conjunto adopta la solución preferida del polo de Q1R, Pereira et al. (2023); no es un ajuste de su figura tridimensional.'},
};
export const BODY_APPEARANCES = {
 sun:[['sun','Superficie animada · ilustrativa'],['sun-304','STEREO/SDO · ultravioleta 304 Å']],
 moon:[['moon','LROC · superficie'],['moon-altimetry','LOLA · elevación global']],
 earth:[['earth','Blue Marble · capas del visor'],['earth-night-science','VIIRS · luces nocturnas (2012)'],['earth-relief','ETOPO1 · relieve y batimetría']],
 hyperion:[['hyperion','Cassini · forma medida'],['hyperion-nasa','NASA · modelo texturizado']],
 venus:[['venus-clouds','Nubes · aspecto exterior'],['venus-surface','Superficie · cartografía radar']],
 mercury:[['mercury','Modelo NASA · superficie'],['mercury-enhanced','MESSENGER · color realzado']],
 mars:[['mars','NASA · superficie'],['mars-elevation','MOLA · elevación'],['mars-gravity','GMM-3 · gravedad free-air'],['mars-bouguer','GMM-3 · anomalía Bouguer'],['mars-crust','GMM-3 · espesor cortical']],
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
 if(spec.original){
  if(node.bodyModel)node.bodyModel.root.visible=false;
  node.surface.visible=true;node.activeModel=key;node.modelPending=null;node.extentKm=Math.max(...(node.definition.axesKm||[node.definition.radiusKm]));
  if(node.definition.id==='sun'){scene.sunGlow.visible=true;scene.sunCorona.visible=true;}
  scene.onBodyModelChange?.(node.definition.id);return true;
 }
 scene.onBodyModelChange?.(node.definition.id);
 node.modelCache??=new Map();
 let task=node.modelCache.get(key);
 if(!task){
  const base=import.meta.env?.BASE_URL??'/';
  const source=spec.texture ? new THREE.TextureLoader().loadAsync(`${base}${spec.assetPath||'textures/'+spec.texture}`).then(map=>{
   map.colorSpace=spec.dataMap?THREE.NoColorSpace:THREE.SRGBColorSpace;
   return {scene:new THREE.Mesh(new THREE.SphereGeometry(spec.referenceRadius,160,96),spec.unlit?new THREE.MeshBasicMaterial({map,toneMapped:false}):new THREE.MeshStandardMaterial({map,roughness:.94,metalness:0}))};
  }) : spec.format==='obj' ? new OBJLoader().loadAsync(`${base}${spec.assetPath||'models/'+spec.file}`).then(model=>{
   model.rotation.x=-Math.PI/2;
   model.traverse(mesh=>{if(mesh.isMesh){mesh.geometry.computeVertexNormals();mesh.material=new THREE.MeshStandardMaterial({color:'#8b8580',roughness:1,metalness:0});}});
   return {scene:model};
  }) : new GLTFLoader().loadAsync(`${base}models/${spec.file}`);
  task=source.then(gltf=>{
   const result=prepareBodyModel(gltf.scene,spec,node.definition.radiusKm,node.surface.userData.item,Math.min(8,scene.renderer.capabilities.getMaxAnisotropy()));
   result.root.visible=false;node.spin.add(result.root);scene.interactive.push(...result.meshes);return result;
  }).catch(error=>{node.modelCache.delete(key);throw error;});
  node.modelCache.set(key,task);
 }
 let result;
 try{result=await task;}catch(error){if(node.requestedModel===key){node.modelPending=null;node.modelError=error.message;scene.onBodyModelChange?.(node.definition.id);}throw error;}
 if(node.requestedModel!==key)return false;
 if(node.bodyModel)node.bodyModel.root.visible=false;
 if(node.definition.id==='sun'){scene.sunGlow.visible=false;scene.sunCorona.visible=false;}
 result.root.visible=true;node.surface.visible=false;node.bodyModel=result;node.activeModel=key;
 node.extentKm=result.extentKm;node.modelPending=null;
 scene.onBodyModelChange?.(node.definition.id);
 if(scene.focus?.type==='body'&&scene.focus.id===node.definition.id){
  scene.controls.minDistance=result.extentKm+.08;
  if(scene.camera.position.length()<scene.controls.minDistance)scene.camera.position.setLength(scene.controls.minDistance);
 }
 return true;
}
