import test from 'node:test';
import assert from 'node:assert/strict';
import {trajectoryPosition,trajectoryWindow} from '../src/trajectory.js';
test('Hermite follows curved motion and refuses to extrapolate',()=>{
 const track={samples:[[0,0,0,0,1,0,0],[10000,10,100,0,1,20,0],[20000,20,400,0,1,40,0]]};
 assert.deepEqual(trajectoryPosition(track,5000),{x:5,y:25,z:0});assert.deepEqual(trajectoryPosition(track,20000),{x:20,y:400,z:0});assert.equal(trajectoryPosition(track,-1),null);assert.equal(trajectoryPosition(track,20001),null);
 const points=trajectoryWindow(track,10000,1);assert.equal(points.length,3);assert.deepEqual(points[0],{x:0,y:0,z:0});assert.deepEqual(points.at(-1),{x:20,y:400,z:0});
});
