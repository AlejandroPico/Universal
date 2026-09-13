import fs from 'node:fs';
import {gzipSync,gunzipSync} from 'node:zlib';
const file='public/data/science/cluster-members.json.gz';
try { const old=JSON.parse(gunzipSync(fs.readFileSync(file))); if(old.complete && Object.keys(old.members).length>1000){console.log('Verified cluster members available');process.exit(0);} } catch {}
const url=new URL('https://vizier.cds.unistra.fr/viz-bin/asu-tsv');
url.search=new URLSearchParams({'-source':'J/A+A/618/A93/members','-out.all':'','-out.max':'unlimited'});
const response=await fetch(url,{signal:AbortSignal.timeout(180000)});
if(!response.ok)throw Error(`VizieR ${response.status}`);
const lines=(await response.text()).split(/\r?\n/).filter(l=>l.trim()&&!l.startsWith('#'));
const header=lines.shift().split('\t').map(s=>s.trim());console.log('VizieR fields:',header.join(', '));
const column=(...names)=>{const i=header.findIndex(h=>names.some(n=>h.toLowerCase()===n.toLowerCase()));if(i<0)throw Error('Missing member column: '+names.join('/'));return i;};
const ix={id:column('Source','SourceId','GaiaDR2'),ra:column('RA_ICRS','RAJ2000','RAdeg'),dec:column('DE_ICRS','DEJ2000','DEdeg'),mag:column('Gmag'),p:column('proba','Prob','P'),cluster:column('Cluster','Name')};
const members={};let count=0;
for(const line of lines){const r=line.split('\t').map(x=>x.trim()),id=r[ix.id],name=r[ix.cluster],ra=Number(r[ix.ra]),dec=Number(r[ix.dec]),mag=Number(r[ix.mag]),p=Number(r[ix.p]);if(!/^\d{15,20}$/.test(id)||!name||![ra,dec,mag,p].every(Number.isFinite)||ra<0||ra>360||Math.abs(dec)>90||p<.8||p>1)continue;(members[name]??=[]).push([id,ra,dec,mag,p]);count++;}
if(count<100000||Object.keys(members).length<1000)throw Error(`Incomplete VizieR catalogue: ${count} members / ${Object.keys(members).length} clusters`);
fs.writeFileSync(file,gzipSync(JSON.stringify({source:'Cantat-Gaudin et al. 2018 / Gaia DR2',sourceUrl:url.href,complete:true,downloadedAt:new Date().toISOString(),members})));
console.log(`Prepared ${count} observed members in ${Object.keys(members).length} clusters`);
