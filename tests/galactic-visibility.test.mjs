import test from 'node:test';import assert from 'node:assert/strict';
import {referenceOpacity} from '../src/galactic-visibility.js';
test('local catalogue references fade smoothly before a whole-galaxy view',()=>{
 assert.equal(referenceOpacity(100),1);assert.equal(referenceOpacity(4000),1);assert.equal(referenceOpacity(30000),0);assert.equal(referenceOpacity(200000),0);
 let last=1;for(let d=4000;d<=30000;d+=100){const a=referenceOpacity(d);assert.ok(a<=last&&a>=0);last=a;}
});
