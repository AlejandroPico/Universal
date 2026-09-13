import test from 'node:test';
import assert from 'node:assert/strict';
import {comparisonRows,lightTravel,TOURS} from '../src/exploration-tools.js';
import {nextRenderRatio} from '../src/render-quality.js';
import {LY_KM} from '../src/cosmic-data.js';
test('comparisons retain missing measurements and use one common unit',()=>{
 const rows=comparisonRows({radiusKm:10,periodHours:48},{radiusLy:1});assert.deepEqual(rows[0],['Radio (km)',10,LY_KM]);assert.equal(rows[2][1],2);assert.equal(rows[2][2],null);assert.equal(lightTravel(LY_KM).years,1);assert.ok(TOURS[0].ids.includes('carina'));
});
test('automatic quality preserves a floor and has a stable middle band',()=>{
 assert.equal(nextRenderRatio(1,60,3),1);assert.equal(nextRenderRatio(2,16,3),2);assert.equal(nextRenderRatio(1.5,25,2),1.5);assert.equal(nextRenderRatio(2,45,2),1.75);
});
