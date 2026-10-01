import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {MILKY_WAY,MW_CENTER,fromGalactic,toGalactic,densityAtScene,milkyWayPopulation,sectorStar,sectorNeighborhood,SECTOR_SIZE,SECTOR_BUDGET,VIRTUAL_STAR_COUNT} from '../src/milky-way-model.js';
import {GalacticSectors} from '../src/galactic-sectors.js';
import {LY_KM} from '../src/cosmic-data.js';
test('densidad local CNS5, disco fino, caída vertical y escala de población galáctica',()=>{
 assert.ok(Math.abs(densityAtScene([0,0,0])*3.261563777**3-.0799)<1e-10);
 assert.ok(VIRTUAL_STAR_COUNT>80e9&&VIRTUAL_STAR_COUNT<200e9);
 const mid=densityAtScene(fromGalactic([-27000,0,0])),above=densityAtScene(fromGalactic([-27000,0,10000])),outside=densityAtScene(fromGalactic([-100000,0,0]));assert.ok(mid>above*50&&mid>outside*100);
 const result=milkyWayPopulation(30000),again=milkyWayPopulation(30000);assert.deepEqual(result,again);let thin=0,halo=0;
 for(let i=0;i<result.positions.length;i+=3){const g=toGalactic([...result.positions.subarray(i,i+3)].map((v,j)=>v+MW_CENTER[j]));if(Math.abs(g[2])<2000)thin++;if(Math.abs(g[2])>10000)halo++;}
 assert.ok(thin/30000>.82);assert.ok(halo/30000<.01);
});
test('los sectores centrales respetan el presupuesto y conservan estrellas al revisitar o cambiar detalle',()=>{
 const observer=fromGalactic([0,0,0]),full=sectorNeighborhood(observer),small=sectorNeighborhood(observer,20000);assert.ok(full.count<=SECTOR_BUDGET&&small.count<=20000);assert.ok(full.represented>full.count);
 const a=sectorStar(50,-80,20,7),b=sectorStar(50,-80,20,7);assert.deepEqual(a,b);assert.ok(a.modeled&&a.radiusKm>0&&a.distanceLy>0);
 const ids=new Set();for(let i=0;i<full.ids.length;i+=4)ids.add(full.ids.subarray(i,i+4).join(':'));for(let i=0;i<small.ids.length;i+=4)assert.ok(ids.has(small.ids.subarray(i,i+4).join(':')));
 assert.deepEqual(full,sectorNeighborhood(observer));
});
test('rebasing cambia solo el origen de render y la selección conserva las coordenadas precisas',()=>{
 const owner={scene:new THREE.Scene(),camera:new THREE.PerspectiveCamera(),renderUnit:LY_KM},sectors=new GalacticSectors(owner),observer=fromGalactic([-15000,5000,0]);
 const data=sectorNeighborhood(observer);sectors.install({key:observer.map(v=>Math.floor(v/SECTOR_SIZE)).join(':'),...data});sectors.requestKey=sectors.key;
 const origin=new THREE.Vector3(...observer.map(v=>v*LY_KM));owner.camera.position.set(0,0,0);sectors.update(origin,24*LY_KM,true);
 const world=sectors.node.position.clone().add(origin);origin.x+=1e10;owner.camera.position.x-=1e10;sectors.update(origin,24*LY_KM,true);assert.ok(world.distanceTo(sectors.node.position.clone().add(origin))<1e3);assert.equal(sectors.state,'ready');
 sectors.dispose();assert.equal(owner.scene.children.length,0);
});
