import test from 'node:test';
import assert from 'node:assert/strict';
import {stellarClass,solarClass} from '../src/context-filters.js';
test('spectral filters retain unclassified stars separately',()=>{
 for(const [value,expected] of [['G2V','G'],[' M3 III','M'],['DA2','unknown'],[null,'unknown'],['B9V','B']])assert.equal(stellarClass(value),expected);
});
test('solar classes distinguish moons and minor bodies',()=>{
 for(const [body,expected] of [[{id:'sun'},'star'],[{type:'moon'},'moon'],[{type:'planet'},'planet'],[{type:'dwarf'},'minor'],[{type:'asteroid'},'minor']])assert.equal(solarClass(body),expected);
});
