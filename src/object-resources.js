import {craftSpec} from './craft-models.js';
const names={sun:'Sun',mercury:'Mercury planet',venus:'Venus planet',earth:'Earth',moon:'Moon',mars:'Mars',jupiter:'Jupiter',saturn:'Saturn',uranus:'Uranus',neptune:'Neptune',andromeda:'Andromeda Galaxy', 'milky-way':'Milky Way',triangulum:'Triangulum Galaxy',cmb:'Planck cosmic microwave background','25544':'International Space Station','20580':'Hubble Space Telescope',charon:'Charon moon',rhea:'Rhea moon',iapetus:'Iapetus moon',tethys:'Tethys moon',oberon:'Oberon moon'};
export function resourceQuery(item){return names[item.id]||item.name?.replace(/ · .*/, '').replace(/-\d+$/, '')||item.id;}
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
export async function nasaImageResults(item,signal){
 const r=await fetch('https://images-api.nasa.gov/search?media_type=image&page_size=6&q='+encodeURIComponent(resourceQuery(item)),{signal});if(!r.ok)throw Error('Archivo NASA no disponible');
 const data=await r.json();return(data.collection?.items||[]).map(x=>({title:x.data?.[0]?.title||'Imagen NASA',credit:x.data?.[0]?.photographer||x.data?.[0]?.center||'NASA',image:x.links?.find(l=>l.render==='image')?.href,url:'https://images.nasa.gov/details/'+encodeURIComponent(x.data?.[0]?.nasa_id||'')})).filter(x=>x.image?.startsWith('https://'));
}
