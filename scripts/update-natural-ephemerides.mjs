import fs from 'node:fs';import {gzipSync,gunzipSync} from 'node:zlib';
import {NATURAL_TARGETS,parseHorizonsVectors} from '../src/natural-ephemerides.js';
const file='public/data/science/natural-ephemerides.json.gz',now=Date.now(),day=86400000;
let old={tracks:{}};try{old=JSON.parse(gunzipSync(fs.readFileSync(file)));}catch{}
if(process.argv.includes('--if-missing')&&NATURAL_TARGETS.every(([id])=>old.tracks[id]?.samples[0][0]<now&&old.tracks[id].samples.at(-1)[0]>now+day))process.exit(0);
const tracks={...old.tracks},failures=[];
for(const [id,command,center] of NATURAL_TARGETS){
 const moon=center!==10,span=moon?7:190,step=moon?'15 m':'6 h';
 const url=new URL('https://ssd.jpl.nasa.gov/api/horizons.api');
 for(const [k,v]of Object.entries({format:'json',COMMAND:command,EPHEM_TYPE:'VECTORS',CENTER:'500@'+center,START_TIME:new Date(now-span*day).toISOString().slice(0,10),STOP_TIME:new Date(now+span*day).toISOString().slice(0,10),STEP_SIZE:step,TIME_TYPE:'UT',VEC_TABLE:'2',CSV_FORMAT:'YES',OUT_UNITS:'KM-S',REF_PLANE:'ECLIPTIC',REF_SYSTEM:'ICRF',VEC_CORR:'NONE'}))url.searchParams.set(k,k==='format'?v:`'${v}'`);
 let error;
 for(let attempt=0;attempt<2;attempt++)try{const r=await fetch(url,{signal:AbortSignal.timeout(45000)});if(!r.ok)throw Error('HTTP '+r.status);const p=await r.json();if(p.error)throw Error(p.error);const samples=parseHorizonsVectors(p.result);if(samples[0][0]>now||samples.at(-1)[0]<now+day)throw Error('Incomplete interval');tracks[id]={command,center,frame:'J2000 ecliptic',timeScale:'UTC',source:'NASA/JPL Horizons',sourceUrl:url.href,updatedAt:new Date().toISOString(),samples};error=null;break;}catch(e){error=e;}
 if(error){failures.push(id);console.warn(id+': '+error.message);}else console.log('Updated '+id+' / '+tracks[id].samples.length+' vectors');
}
if(failures.some(id=>!tracks[id]))throw Error('Missing natural ephemerides: '+failures.join(', '));
fs.mkdirSync('public/data/science',{recursive:true});fs.writeFileSync(file,gzipSync(JSON.stringify({source:'NASA/JPL Horizons',generatedAt:new Date().toISOString(),failedUpdates:failures,tracks})));
if(failures.length)console.warn('Preserved previous tracks without changing their dates: '+failures.join(', '));
