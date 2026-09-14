import test from 'node:test';import assert from 'node:assert/strict';
import * as THREE from 'three';
import {galaxyDiskBasis} from '../src/galaxy-orientation-geometry.js';
import {GALAXY_ORIENTATIONS} from '../src/galaxy-orientations.js';
import {COSMIC_OBJECTS} from '../src/cosmic-data.js';
import {equatorialBasis} from '../src/atlas-data.js';
test('individual galaxy disks preserve published sky projection and inclination',()=>{
 for(const [id,fit] of Object.entries(GALAXY_ORIENTATIONS)){
  const item=COSMIC_OBJECTS.find(x=>x.id===id),m=galaxyDiskBasis(item),a=new THREE.Vector3().setFromMatrixColumn(m,0),b=new THREE.Vector3().setFromMatrixColumn(m,1),pole=new THREE.Vector3().setFromMatrixColumn(m,2);
  assert.ok(Math.abs(m.determinant()-1)<1e-9);assert.ok(Math.abs(a.dot(b))<1e-9);
  const sky=equatorialBasis(item.position),view=new THREE.Vector3(...sky.normal),north=new THREE.Vector3(...sky.up),east=new THREE.Vector3(...sky.right).negate();
  assert.ok(Math.abs(Math.abs(view.dot(pole))-Math.cos(fit.inclination*Math.PI/180))<1e-9);
  const pa=(Math.atan2(a.dot(east),a.dot(north))*180/Math.PI+360)%360;assert.ok(Math.abs(pa-fit.pa)<1e-8);
 }
 assert.equal(galaxyDiskBasis({id:'unknown'}),null);
});

import {galaxyPopulation} from '../src/galaxy-model.js';
import {galacticPosition} from '../src/cosmic-data.js';
test('modeled disk covers all galactocentric quadrants with warm and blue lights',()=>{
 const item=COSMIC_OBJECTS.find(x=>x.id==='milky-way'),{positions:p,colors:c}=galaxyPopulation(item,20000),axes=[galacticPosition(1,0,0),galacticPosition(0,1,0)];
 const quadrants=[0,0,0,0];let red=0,blue=0;
 for(let i=0;i<p.length;i+=3){const [x,y]=axes.map(a=>a.reduce((sum,v,j)=>sum+v*p[i+j],0));if(Math.hypot(x,y)>5000)quadrants[(x>0?1:0)+(y>0?2:0)]++;if(c[i]>c[i+2]*1.3)red++;if(c[i+2]>c[i]*1.3)blue++;}
 assert.ok(quadrants.every(n=>n>1500),JSON.stringify(quadrants));assert.ok(red>1000&&blue>1000);
});
