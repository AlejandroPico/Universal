import {test} from 'node:test';import assert from 'node:assert/strict';
import {CELESTIAL_BODIES} from '../src/solar-data.js';
import {meanMoonPosition,moonOrbitPoints} from '../src/moon-orbits.js';
import {trajectoryPosition} from '../src/trajectory.js';
const moons=CELESTIAL_BODIES.filter(b=>b.type==='moon');
test('JPL catalogue keeps all 459 unique moons, parents, frames and unknown sizes',()=>{
 assert.equal(moons.length,459);assert.equal(new Set(moons.map(b=>b.id)).size,459);
 for(const m of moons){assert.ok(CELESTIAL_BODIES.some(b=>b.id===m.parent));assert.ok(m.meanElements);if(m.radiusUnknown)assert.ok(m.summary.includes('no una medida'));}
 assert.equal(moons.filter(m=>m.parent==='pluto').length,5);
});
test('every mean lunar orbit closes and its positions stay between periapsis and apoapsis',()=>{
 for(const m of moons){
  const date=new Date('2026-09-15'),p=meanMoonPosition(m,date),r=Math.hypot(p.x,p.y,p.z),q=m.meanElements;
  assert.ok(r>=q.a*(1-q.e)-1e-6&&r<=q.a*(1+q.e)+1e-6,m.id);
  const orbit=moonOrbitPoints(m,date);assert.ok(Math.hypot(...['x','y','z'].map(k=>orbit[0][k]-orbit.at(-1)[k]))<1e-5,m.id);
 }
});
test('JPL line includes the precise current moon position, including clipped time windows',()=>{
 const m=moons.find(m=>m.id==='phobos'),t=Date.parse('2026-09-15'),track={samples:[[t,1,2,3,0,1,0],[t+100000,3,6,7,1,0,0]]};
 for(const time of [t,t+31789,t+100000])assert.ok(moonOrbitPoints(m,time,track).some(p=>JSON.stringify(p)===JSON.stringify(trajectoryPosition(track,time))));
});

test('inspection markers never become measured radii in comparisons',async()=>{
 const {comparisonRows}=await import('../src/exploration-tools.js');
 const unknown=moons.find(m=>m.radiusUnknown),known=moons.find(m=>m.id==='moon');
 assert.equal(comparisonRows(unknown,known)[0][1],null);
 assert.equal(comparisonRows(unknown,known)[0][2],known.radiusKm);
});
