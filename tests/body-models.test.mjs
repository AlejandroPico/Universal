import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {prepareBodyModel,BODY_MODELS,defaultBodyModel} from '../src/body-models.js';

test('NASA UV atlas and original mesh survive planetary scaling',()=>{
 const geometry=new THREE.BoxGeometry(1000,1000,1000),uv=geometry.attributes.uv.array.slice();
 const mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({metalness:.5}));const item={id:'mercury'};
 const result=prepareBodyModel(mesh,BODY_MODELS.mercury,2439.7,item);
 assert.equal(result.meshes[0].geometry,geometry);assert.deepEqual(geometry.attributes.uv.array,uv);
 assert.equal(mesh.userData.item,item);assert.equal(mesh.material.metalness,0);
 assert.ok(Math.abs(result.extentKm-2439.7*Math.sqrt(3))<1e-6);
});
test('irregular moon preserves native kilometer axes and origin',()=>{
 const group=new THREE.Group(),mesh=new THREE.Mesh(new THREE.BoxGeometry(20,10,6),new THREE.MeshStandardMaterial());mesh.position.x=2;group.add(mesh);
 const result=prepareBodyModel(group,BODY_MODELS.phobos,11.267,{id:'phobos'});
 const bounds=new THREE.Box3().setFromObject(result.root),size=bounds.getSize(new THREE.Vector3());
 assert.deepEqual(size.toArray(),[20,10,6]);assert.equal(bounds.getCenter(new THREE.Vector3()).x,2);
 assert.ok(Math.abs(result.extentKm-Math.sqrt(12**2+5**2+3**2))<1e-6);
});
test('Venus defaults to clouds and model registry does not replace other bodies',()=>{
 assert.equal(defaultBodyModel('venus'),'venus-clouds');assert.equal(defaultBodyModel('mars'),null);
 assert.notEqual(BODY_MODELS['venus-clouds'].file,BODY_MODELS['venus-surface'].file);
});

test('Saturn rings preserve their size without making the outer edge a collision sphere',()=>{
 const model=new THREE.Group();
 model.add(new THREE.Mesh(new THREE.SphereGeometry(500,32,24),new THREE.MeshStandardMaterial()));
 const rings=new THREE.Mesh(new THREE.RingGeometry(600,1165.45,64),new THREE.MeshStandardMaterial());rings.rotation.x=Math.PI/2;model.add(rings);
 const result=prepareBodyModel(model,BODY_MODELS.saturn,58232,{id:'saturn'});
 assert.equal(result.extentKm,60268);
 assert.ok(result.visualExtentKm>140000&&result.visualExtentKm<141000);
 assert.equal(result.meshes.length,2);
});
