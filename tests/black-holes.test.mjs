import test from 'node:test';import assert from 'node:assert/strict';
import {BLACK_HOLES,schwarzschildRadiusKm} from '../src/black-hole-data.js';
import {COSMIC_OBJECTS} from '../src/cosmic-data.js';
import {traceRay,renderBlackHole} from '../src/black-hole-raytrace.js';
test('Schwarzschild scale is linear in mass and source objects have finite coordinates',()=>{assert.ok(Math.abs(schwarzschildRadiusKm(1)-2.95325)<.001);assert.throws(()=>schwarzschildRadiusKm(0));assert.equal(BLACK_HOLES[1].radiusKm/BLACK_HOLES[0].radiusKm,1625);for(const x of BLACK_HOLES)assert.ok(x.position.every(Number.isFinite));});
test('capture and escape straddle the Schwarzschild critical impact parameter',()=>{for(const b of [0,2,2.5])assert.equal(traceRay([b,0,100],[0,0,-1],{disk:false}).kind,'captured');for(const b of [2.7,3,5])assert.equal(traceRay([b,0,100],[0,0,-1],{disk:false}).kind,'sky');assert.equal(traceRay([2,0,100],[0,0,-1],{disk:false,lens:false}).kind,'sky');});
test('lensing changes the image of the same three-dimensional disk',()=>{const l=renderBlackHole({width:64,height:48}),flat=renderBlackHole({width:64,height:48,lens:false});assert.equal(l.length,64*48*4);assert.ok(l.some((v,i)=>i%4===0&&v>100));assert.notDeepEqual(l,flat);assert.ok(l.every((v,i)=>i%4!==3||v===255));});

test("black holes coincide with their host galaxy centers",()=>{for(const [id,host] of [["sgr-a-star","milky-way"],["m87-star","m87"]])assert.deepEqual(BLACK_HOLES.find(x=>x.id===id).position,COSMIC_OBJECTS.find(x=>x.id===host).position);});
