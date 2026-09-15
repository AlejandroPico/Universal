import {test} from 'node:test';import assert from 'node:assert/strict';import {RING_SYSTEMS,makePlanetRings} from '../src/planet-rings.js';
test('faint ring systems retain NASA radii and physical widths without duplicating Saturn',()=>{
 assert.equal(makePlanetRings('mars'),null);
 for(const b of RING_SYSTEMS.saturn.bands)assert.ok(b[2]<=74268.3||b[1]>=140479);
 for(const id of Object.keys(RING_SYSTEMS)){
  const spec=RING_SYSTEMS[id],mesh=makePlanetRings(id);assert.ok(spec.bands.length<=13);
  for(const b of spec.bands){assert.ok(b[1]>spec.axes[0]&&b[2]>b[1]);}
  assert.equal(mesh.material.uniforms.count.value,spec.bands.length);
  assert.ok(mesh.material.fragmentShader.includes('fwidth'));
  mesh.geometry.dispose();mesh.material.dispose();
 }
});
