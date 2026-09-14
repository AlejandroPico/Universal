import test from 'node:test';import assert from 'node:assert/strict';
import {satelliteFamily,familyMedia,SATELLITE_GALLERIES} from '../src/satellite-family-gallery.js';
test('family references never identify debris as an intact craft',()=>{
 assert.equal(satelliteFamily({group:'starlink',isDebris:true}),null);
 assert.equal(satelliteFamily({group:'unknown'}),null);
 assert.equal(satelliteFamily({id:'galileo'}).name,'Galileo');
 assert.equal(familyMedia({group:'gps'})[0].file,'families/gps-iif.jpg');
});
test('curated gallery files retain source, credit, license and representation type',()=>{
 const seen=new Set();for(const family of Object.values(SATELLITE_GALLERIES))for(const item of family.images){assert.ok(!seen.has(item.file));seen.add(item.file);assert.ok(item.credit&&item.caption&&item.url.startsWith('https://')&&item.license.startsWith('https://'));assert.match(item.caption,/^(Fotografía|Ilustración|Esquema) ·/);}
});
