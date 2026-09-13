import {parseClusterMembers} from './cluster-members-parser.mjs';
import fs from 'node:fs';
import {gzipSync,gunzipSync} from 'node:zlib';
const file='public/data/science/cluster-members.json.gz';
try { const old=JSON.parse(gunzipSync(fs.readFileSync(file))); if(old.complete && Object.keys(old.members).length>1000){console.log('Verified cluster members available');process.exit(0);} } catch {}
const url=new URL('https://vizier.cds.unistra.fr/viz-bin/asu-tsv');
url.search=new URLSearchParams({'-source':'J/A+A/618/A93/members','-out':'Source,RA_ICRS,DE_ICRS,Gmag,PMemb,Cluster','PMemb':'>=0.8','-out.max':'unlimited'});
const response=await fetch(url,{signal:AbortSignal.timeout(180000)});
if(!response.ok)throw Error(`VizieR ${response.status}`);
const {members,count}=parseClusterMembers(await response.text());
if(count<100000||Object.keys(members).length<1000)throw Error(`Incomplete VizieR catalogue: ${count} members / ${Object.keys(members).length} clusters`);
fs.writeFileSync(file,gzipSync(JSON.stringify({source:'Cantat-Gaudin et al. 2018 / Gaia DR2',sourceUrl:url.href,complete:true,downloadedAt:new Date().toISOString(),members})));
console.log(`Prepared ${count} observed members in ${Object.keys(members).length} clusters`);
