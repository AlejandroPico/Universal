import {CURATED_BODY_IMAGES} from './curated-body-images.js';
import {craftSpec} from './craft-models.js';
const names={sun:'Sun',mercury:'Mercury planet',venus:'Venus planet',earth:'Earth',moon:'Moon',mars:'Mars',jupiter:'Jupiter',saturn:'Saturn',uranus:'Uranus',neptune:'Neptune',andromeda:'Andromeda Galaxy', 'milky-way':'Milky Way',triangulum:'Triangulum Galaxy',cmb:'Planck cosmic microwave background','25544':'International Space Station','20580':'Hubble Space Telescope',charon:'Charon moon',rhea:'Rhea moon',iapetus:'Iapetus moon',tethys:'Tethys moon',oberon:'Oberon moon'};
export function resourceQuery(item){return names[item.id]||(Number.isFinite(item.radiusKm)&&!item.cosmic?item.id:null)||item.name?.replace(/ · .*/, '').replace(/-\d+$/, '')||item.id;}
export function objectLinks(item){
 const q=resourceQuery(item),links=[];
 const official=item.id==='25544'?'https://www.nasa.gov/international-space-station/':craftSpec(item)?.sourceUrl||item.sourceUrl;
 if(official?.startsWith('https://'))links.push({label:'Fuente / página oficial',url:official});
 links.push({label:'Buscar en Wikipedia',url:'https://es.wikipedia.org/w/index.php?search='+encodeURIComponent(item.name||q)},
  {label:'Fotografías en Wikimedia Commons',url:'https://commons.wikimedia.org/w/index.php?title=Special:MediaSearch&type=image&search='+encodeURIComponent(q)},
  {label:'Archivo de imágenes NASA',url:'https://images.nasa.gov/search?q='+encodeURIComponent(q)});
 if(item.id==='milky-way')links.unshift({label:'Explorar mosaico VISTA · 9 gigapíxeles',url:'https://www.eso.org/public/images/eso1242a/zoomable/'});
 if(item.id==='andromeda')links.unshift({label:'Ampliar fotografía original de M31',url:'https://esahubble.org/images/heic1502b/zoomable/'});
 return links;
}
export function rankNasaImage(record,item){
 const d=record.data?.[0]||{},solar=Number.isFinite(item.radiusKm)&&!item.cosmic;
 const title=d.title||'',keywords=(d.keywords||[]).join(' '),text=[title,d.description,d.photographer].join(' ');
 if(solar&&/celebration|costume|dress(?:ed|ing) up|bill ingalls|halloween|mascot|press conference|ribbon.cutting|schoolchildren|rally|groundbreaking|red carpet|parade|selfie with|award ceremony/i.test(text))return -1;
 const subject=resourceQuery(item).replace(/ planet$| moon$/,'');
 const escape=x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const target=new RegExp('\\b'+escape(subject)+'\\b','i');
 if(solar&&!target.test(title+' '+keywords))return -1;
 if(solar&&['venus','mercury','mars','jupiter','saturn','uranus','neptune'].includes(item.id)&&/night sky|conjunction|from earth|transit of|skywatch|stargaz/i.test(title))return -1;
 return (target.test(title)?10:0)+(/^PIA/.test(d.nasa_id||'')?8:0)+(/global|mosaic|portrait|surface|cloud|hemisphere|close.up/i.test(title)?4:0);
}
export async function nasaImageResults(item,signal){
 if(CURATED_BODY_IMAGES[item.id])return CURATED_BODY_IMAGES[item.id];
 const r=await fetch('https://images-api.nasa.gov/search?media_type=image&page_size=100&q='+encodeURIComponent(resourceQuery(item)),{signal});if(!r.ok)throw Error('Archivo NASA no disponible');
 const data=await r.json(),seen=new Set();
 return(data.collection?.items||[]).map(x=>({x,score:rankNasaImage(x,item)})).filter(x=>x.score>=0).sort((a,b)=>b.score-a.score).map(({x})=>{
  const d=x.data?.[0]||{},links=(x.links||[]).filter(l=>l.render==='image'&&l.href?.startsWith('https://'));
  const image=(links.find(l=>l.width>=500&&l.width<=1280)||links.find(l=>l.rel==='preview')||links[0])?.href;
  return{title:d.title||'Imagen NASA',credit:d.photographer||d.center||'NASA',image,url:'https://images.nasa.gov/details/'+encodeURIComponent(d.nasa_id||''),id:d.nasa_id};
 }).filter(x=>{if(!x.image||!x.id||seen.has(x.id))return false;seen.add(x.id);return true;}).slice(0,6);
}
