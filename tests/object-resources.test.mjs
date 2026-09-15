import {test} from 'node:test';import assert from 'node:assert/strict';
import {resourceQuery,rankNasaImage,nasaImageResults} from '../src/object-resources.js';
const mars={id:'mars',name:'Marte',radiusKm:3389.5};
test('planet images reject events and costumes while retaining science',()=>{
 assert.equal(rankNasaImage({data:[{title:'Mars Celebration',photographer:'Bill Ingalls',keywords:['Mars']}]},mars),-1);
 assert.equal(rankNasaImage({data:[{title:'Mars event',description:'Visitors wearing costumes',keywords:['Mars']}]},mars),-1);
 assert.ok(rankNasaImage({data:[{title:'Mars surface mosaic',nasa_id:'PIA00001'}]},mars)>0);
 assert.equal(rankNasaImage({data:[{title:'Venus in the night sky'}]},{id:'venus',radiusKm:6052}),-1);
});
test('moon names are searched using their catalog identity',()=>{assert.equal(resourceQuery({id:'ganymede',name:'Ganímedes',radiusKm:2634}),'ganymede');});
test('reviewed Mars Venus and Ganymede images do not depend on live search rankings',async()=>{for(const id of ['mars','venus','ganymede']){const rows=await nasaImageResults({id});assert.ok(rows.length>=2);assert.ok(rows.every(x=>x.verified&&x.image.startsWith('https://images-assets.nasa.gov/')&&x.url.includes(x.id)));}});
