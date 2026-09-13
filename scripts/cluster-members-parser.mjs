export function parseClusterMembers(text){
const lines=text.split(/\r?\n/).filter(l=>l.trim()&&!l.startsWith('#'));
const header=lines.shift().split('\t').map(s=>s.trim());console.log('VizieR fields:',header.join(', '));
const column=(...names)=>{const i=header.findIndex(h=>names.some(n=>h.toLowerCase()===n.toLowerCase()));if(i<0)throw Error('Missing member column: '+names.join('/'));return i;};
const ix={id:column('Source','SourceId','GaiaDR2'),ra:column('RA_ICRS','RAJ2000','RAdeg'),dec:column('DE_ICRS','DEJ2000','DEdeg'),mag:column('Gmag'),p:column('PMemb','proba','Prob','P'),cluster:column('Cluster','Name')};
const members={};let count=0;
for(const line of lines){const r=line.split('\t').map(x=>x.trim()),id=r[ix.id],name=r[ix.cluster],ra=Number(r[ix.ra]),dec=Number(r[ix.dec]),mag=Number(r[ix.mag]),p=Number(r[ix.p]);if(!/^\d{15,20}$/.test(id)||!name||![ra,dec,mag,p].every(Number.isFinite)||ra<0||ra>360||Math.abs(dec)>90||p<.8||p>1)continue;(members[name]??=[]).push([id,ra,dec,mag,p]);count++;}
return {members,count};
}
