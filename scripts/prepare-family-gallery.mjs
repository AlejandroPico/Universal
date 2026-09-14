import fs from 'node:fs/promises';
import path from 'node:path';
import {SATELLITE_GALLERIES} from '../src/satellite-family-gallery.js';
const directory='public/families';await fs.mkdir(directory,{recursive:true});
function valid(b){return b.length>1000&&b[0]===255&&b[1]===216&&b[2]===255;}
for(const item of Object.values(SATELLITE_GALLERIES).flatMap(x=>x.images)){
 const file=path.join(directory,item.file);let old;try{old=await fs.readFile(file);}catch{}
 if(old&&valid(old))continue;
 let error;
 for(let attempt=0;attempt<3;attempt++)try{
  const response=await fetch(item.image,{signal:AbortSignal.timeout(30000),headers:{'User-Agent':'Universal educational atlas (github.com/AlejandroPico/Universal)'}});
  if(!response.ok)throw Error('HTTP '+response.status);
  const bytes=Buffer.from(await response.arrayBuffer());if(!valid(bytes))throw Error('Expected JPEG, received invalid image');
  await fs.writeFile(file+'.tmp',bytes);await fs.rename(file+'.tmp',file);error=null;console.log('Family gallery:',item.file,bytes.length);break;
 }catch(e){error=e;}
 if(error)throw new Error(item.file+': '+error.message);
}
