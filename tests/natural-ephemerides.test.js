import test from 'node:test';import assert from 'node:assert/strict';import {NATURAL_TARGETS,parseHorizonsVectors} from '../src/natural-ephemerides.js';
test('Horizons vectors preserve UTC epoch and km/s, reject missing and unordered data',()=>{
 const rows=parseHorizonsVectors('header\n$$SOE\n2440587.5, date, 1, 2, 3, 4, 5, 6,\n2440588.5, date, 7, 8, 9, 10, 11, 12,\n$$EOE');assert.deepEqual(rows[0],[0,1,2,3,4,5,6]);assert.equal(rows[1][0],86400000);assert.throws(()=>parseHorizonsVectors('API error'));assert.throws(()=>parseHorizonsVectors('$$SOE\n2440588.5,d,1,2,3,4,5,6\n2440587.5,d,1,2,3,4,5,6\n$$EOE'));
});
test('Lunar vectors use planet centers; barycenters and planets use heliocentric frame',()=>{const get=id=>NATURAL_TARGETS.find(t=>t[0]===id);assert.deepEqual(get('moon'),['moon',301,399]);assert.deepEqual(get('charon'),['charon',901,999]);assert.deepEqual(get('bary-ssb'),['bary-ssb',0,10]);assert.equal(new Set(NATURAL_TARGETS.map(t=>t[0])).size,NATURAL_TARGETS.length);});
