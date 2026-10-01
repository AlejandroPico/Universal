import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {SCIENTIFIC_OBSERVATIONS} from '../src/scientific-appearances.js';
await fs.mkdir('public/observations',{recursive:true});
const manifest=[];
for(const spec of Object.values(SCIENTIFIC_OBSERVATIONS).flat()){
 const file='public/observations/'+spec.file;let data;
 try{data=await fs.readFile(file);}catch{}
 if(!data){const r=await fetch(spec.url,{headers:{'User-Agent':'Universal astronomy viewer/1.9 Mozilla/5.0'},signal:AbortSignal.timeout(60000)});if(!r.ok)throw Error(spec.id+': HTTP '+r.status);data=Buffer.from(await r.arrayBuffer());}
 const valid=data.length>1000&&(data[0]===255&&data[1]===216||data[0]===137&&data[1]===80||data.subarray(0,3).toString()==='GIF');
 if(!valid)throw Error('Observación inválida: '+spec.id);
 await fs.writeFile(file,data);manifest.push({id:spec.id,file:spec.file,source:spec.source,url:spec.url,credit:spec.credit,sha256:createHash('sha256').update(data).digest('hex')});
 console.log('Observación preparada:',spec.id,data.length);
}
await fs.writeFile('public/observations/manifest.json',JSON.stringify(manifest,null,2));
