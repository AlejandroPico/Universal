import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {andromedaBasis,andromedaPhotoPosition,M31_PHOTO} from '../src/andromeda-geometry.js';
import {equatorialBasis} from '../src/atlas-data.js';
import {COSMIC_OBJECTS} from '../src/cosmic-data.js';
import {MicrowaveBackground} from '../src/cmb-scene.js';
import {CELESTIAL_BODIES,circularOrbitPosition} from '../src/solar-data.js';
import {objectLinks,resourceQuery,nasaImageResults} from '../src/object-resources.js';
test('M31 proyecta PA 38°, inclinación 77° y centro fotográfico distinto',()=>{
 const item=COSMIC_OBJECTS.find(x=>x.id==='andromeda'),b=equatorialBasis(item.position),m=andromedaBasis(item),major=new THREE.Vector3(),minor=new THREE.Vector3(),pole=new THREE.Vector3();m.extractBasis(major,minor,pole);
 const east=new THREE.Vector3(...b.right).negate(),north=new THREE.Vector3(...b.up),view=new THREE.Vector3(...b.normal);
 assert.ok(Math.abs(THREE.MathUtils.radToDeg(Math.atan2(major.dot(east),major.dot(north)))-38)<1e-9);
 assert.ok(Math.abs(pole.dot(view)-Math.cos(THREE.MathUtils.degToRad(77)))<1e-9);
 assert.ok(Math.abs(major.dot(minor))<1e-12);
 const offset=new THREE.Vector3(...andromedaPhotoPosition(item.distanceLy)).angleTo(new THREE.Vector3(...item.position));
 assert.ok(offset>0&&offset<.002);assert.equal(M31_PHOTO.widthArcmin,362);
});
test('Planck se carga bajo demanda, adapta tamaño y descarta respuesta de comparación obsoleta',()=>{
 const requests=[],owner={scene:new THREE.Scene(),renderer:{capabilities:{maxTextureSize:4096}},textureLoader:{load(url,cb){const texture=new THREE.Texture();requests.push({url,cb,texture});return texture;}}};
 const cmb=new MicrowaveBackground(owner);assert.equal(requests.length,0);cmb.load();assert.match(requests[0].url,/planck-r3-4k/);
 cmb.setSurvey('wmap');requests[0].cb();assert.equal(cmb.ready,false);requests[1].cb();assert.equal(cmb.ready,true);assert.equal(cmb.node.material.map,requests[1].texture);
 cmb.setSurvey('planck');requests[2].cb();assert.equal(cmb.node.material.map.repeat.x,-1);
});
test('lunas nuevas tienen padre previo, radios y periodos válidos sin fingir texturas',()=>{
 for(const id of ['mimas','tethys','dione','rhea','iapetus','miranda','ariel','umbriel','titania','oberon','charon']){
  const idx=CELESTIAL_BODIES.findIndex(x=>x.id===id),moon=CELESTIAL_BODIES[idx];assert.ok(CELESTIAL_BODIES.slice(0,idx).some(x=>x.id===moon.parent));assert.ok(moon.radiusKm>0&&moon.orbitKm>moon.radiusKm&&moon.periodDays>0);assert.equal(moon.texture,null);
  const p=circularOrbitPosition(moon.orbitKm,moon.periodDays,new Date('2026-09-12'),moon.inclination);assert.ok(Math.abs(Math.hypot(p.x,p.y,p.z)/moon.orbitKm-1)<1e-12);
 }
});
test('ISS y Caronte resuelven recursos sin inventar artículos ni aceptar imágenes inseguras',async(t)=>{
 assert.equal(resourceQuery({id:'25544'}),'International Space Station');assert.equal(resourceQuery({id:'charon'}),'Charon moon');
 assert.ok(objectLinks({id:'25544',name:'ISS'}).some(x=>x.url==='https://www.nasa.gov/international-space-station/'));
 t.mock.method(globalThis,'fetch',async()=>({ok:true,json:async()=>({collection:{items:[{data:[{title:'ISS',nasa_id:'test /1',center:'JSC'}],links:[{render:'image',href:'https://images-assets.nasa.gov/test.jpg'}]},{links:[{render:'image',href:'javascript:bad'}]}]}})}));
 const images=await nasaImageResults({id:'25544'});assert.equal(images.length,1);assert.match(images[0].url,/test%20%2F1$/);
});
