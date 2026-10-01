import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {CASSINI_SHAPES,CASSINI_SHAPE_ROOT,cassiniShapeOBJ,STOOKE_SHAPES,STOOKE_ROOT,stookeShapeOBJ,HARTLEY_SHAPE_URL,hartleyShapeOBJ} from '../src/measured-moon-models.js';
await fs.mkdir('public/models',{recursive:true});
const manifest=[];
try{await fs.access('public/models/hartley-2-epoxi.obj');}catch{
 const response=await fetch(HARTLEY_SHAPE_URL,{signal:AbortSignal.timeout(90000)});if(!response.ok)throw Error('Hartley 2: HTTP '+response.status);
 await fs.writeFile('public/models/hartley-2-epoxi.obj',hartleyShapeOBJ(await response.text()));console.log('Forma EPOXI preparada: Hartley 2');
}
for(const id of CASSINI_SHAPES){
 const file='public/models/'+id+'-cassini.obj',url=CASSINI_SHAPE_ROOT+'data/'+id+'_30k_plt.tab';
 let cached;try{cached=await fs.readFile(file,'utf8');}catch{}
 if(cached?.startsWith('# Cassini ISS')){console.log('Forma preparada:',id);continue;}
 const response=await fetch(url,{headers:{'User-Agent':'Universal astronomy viewer/1.9 Mozilla/5.0'},signal:AbortSignal.timeout(90000)});
 if(!response.ok)throw Error(id+': HTTP '+response.status);
 const bytes=Buffer.from(await response.arrayBuffer()),shape=cassiniShapeOBJ(bytes.toString('ascii'));
 await fs.writeFile(file,shape.obj);
 manifest.push({id,url,source:'https://doi.org/10.26033/ewy3-jy61',sourceSHA256:createHash('sha256').update(bytes).digest('hex'),vertices:shape.vertices,plates:shape.plates,extentKm:shape.extent});
 console.log('Forma Cassini:',id,shape.vertices,'vértices;',shape.extent.toFixed(3),'km');
}
if(manifest.length)await fs.writeFile('public/models/cassini-provenance.json',JSON.stringify(manifest,null,2));
for(const [id,name] of Object.entries(STOOKE_SHAPES)){
 const file='public/models/'+id+'-stooke.obj';let cached;try{cached=await fs.readFile(file,'utf8');}catch{}
 if(cached?.startsWith('# Stooke'))continue;
 const response=await fetch(STOOKE_ROOT+name+'.tab',{headers:{'User-Agent':'Universal astronomy viewer/1.9 Mozilla/5.0'},signal:AbortSignal.timeout(90000)});
 if(!response.ok)throw Error(id+': HTTP '+response.status);
 const text=await response.text();await fs.writeFile(file,stookeShapeOBJ(text,['amalthea','thebe','larissa','proteus'].includes(id)));
 console.log('Forma Stooke preparada:',id);
}
