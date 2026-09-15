import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {missionArchive} from '../src/mission-history.js';
const data=JSON.parse(fs.readFileSync(new URL('../public/data/exploration.json',import.meta.url)));
test('all 466 historical missions are searchable without fabricated current positions',()=>{
 const a=missionArchive(data);assert.equal(a.length,466);assert.ok(a.every(x=>x.noLocation&&!x.positionKm));
 assert.equal(a.find(x=>x.name==='Pioneer 10').lastContact,'2003-01-23');
 assert.equal(a.find(x=>x.name==='Pioneer 11').status,'Sin comunicación');
 const cassini=a.find(x=>x.id==='gcat-D00738');assert.ok(cassini.status.startsWith('Destruida'));
 assert.ok(data.sites.some(x=>x.id===cassini.eventId&&x.body==='saturn'));
});
