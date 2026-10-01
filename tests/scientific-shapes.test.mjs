import test from 'node:test';
import assert from 'node:assert/strict';
import {cassiniShapeOBJ,stookeShapeOBJ,CASSINI_SHAPES,STOOKE_SHAPES} from '../src/measured-moon-models.js';
import {BODY_MODELS,BODY_APPEARANCES} from '../src/body-models.js';
import {SCIENTIFIC_OBSERVATIONS} from '../src/scientific-appearances.js';
test('Cassini conserva kilómetros e índices de las placas y rechaza tablas incompletas',()=>{
 const source='4 4\n1 0 0\n0 2 0\n0 0 3\n-1 -1 -1\n0 1 2\n0 3 1\n1 3 2\n2 3 0';
 const result=cassiniShapeOBJ(source);assert.equal(result.extent,3);assert.match(result.obj,/v 0 0 3/);assert.match(result.obj,/f 1 2 3/);
 assert.throws(()=>cassiniShapeOBJ(source.replace('2 3 0','2 3 4')));
 for(const id of CASSINI_SHAPES)assert.equal(BODY_MODELS[id].kmPerUnit,1);
});
test('Stooke cierra los polos y la costura sin perder radios ni invertir caras',()=>{
 const rows=[];for(let lon=360;lon>=0;lon-=5)for(let lat=-90;lat<=90;lat+=5)rows.push(`${lon} ${lat} 7`);
 for(const west of [false,true]){
  const lines=stookeShapeOBJ(rows.join('\n'),west).split('\n'),vertices=lines.filter(x=>x.startsWith('v ')).map(x=>x.slice(2).split(' ').map(Number)),faces=lines.filter(x=>x.startsWith('f ')).map(x=>x.slice(2).split(' ').map(Number));
  assert.equal(vertices.length,2522);assert.equal(faces.length,5040);
  const edges=new Map();for(const face of faces)for(let i=0;i<3;i++){const edge=[face[i],face[(i+1)%3]].sort((a,b)=>a-b).join(':');edges.set(edge,(edges.get(edge)||0)+1);}
  assert.ok([...edges.values()].every(x=>x===2));assert.ok(vertices.every(v=>Math.abs(Math.hypot(...v)-7)<1e-10));
 }
 for(const id of Object.keys(STOOKE_SHAPES))assert.equal(BODY_MODELS[id].kmPerUnit,1);
});
test('los mapas y observaciones conservan procedencia y distinguen datos del modelo solar compartido',()=>{
 assert.equal(SCIENTIFIC_OBSERVATIONS.sun.length,6);assert.equal(new Set(SCIENTIFIC_OBSERVATIONS.sun.map(x=>x.file)).size,6);
 assert.ok(SCIENTIFIC_OBSERVATIONS.sun.every(x=>x.source.startsWith('https://')&&x.credit&&x.note));
 assert.equal(BODY_MODELS.sun.original,true);assert.ok(BODY_APPEARANCES.mars.length===5&&BODY_APPEARANCES.earth.length===3);
});
