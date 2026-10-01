// Observations stay in their original projection. A disk image or a local
// measurement must never become an invented global texture on a sphere.
export const SCIENTIFIC_OBSERVATIONS={
 sun:[
  {"id":"sun-uv","label":"Ultravioleta · SDO/AIA 171 Å","file":"sun-uv.jpg","url":"https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0171.jpg","source":"https://sdo.gsfc.nasa.gov/data/","credit":"NASA/SDO/AIA · fecha indicada en la imagen","note":"Hierro ionizado en la corona a 171 Å, color asignado por SDO. Copia de la observación disponible al preparar esta versión, independiente de la fecha del reloj; solo el hemisferio observado."},
  {"id":"sun-radio","label":"Radio · Nobeyama 17 GHz","file":"sun-radio.png","url":"https://solar.nro.nao.ac.jp/norh/html/daily/ifa_latest.png","source":"https://solar.nro.nao.ac.jp/norh/html/daily/ifa_latest.html","credit":"NAOJ/Nobeyama Radioheliograph · fecha impresa en el mapa","note":"Mapa radio a 17 GHz del archivo NoRH. Intensidad representada en falso color con escala y coordenadas originales; no es luz visible ni una observación en directo."},
  {"id":"sun-infrared","label":"Infrarrojo · Dunn/NJIT 1,6 µm","file":"sun-infrared.jpg","url":"https://nso1.b-cdn.net/wp-content/uploads/2018/10/njit_1.jpg","source":"https://nso.edu/press-release/infrared-camera-peeks-below-the-visible-surface-of-the-sun/","credit":"Yan Xu y Guo Yang, NJIT / NSO / AURA / NSF · 29-10-2003","note":"Secuencia regional infrarroja de una fulguración entre 20:40 y 20:47 UT. Rojo: máximos infrarrojos locales; azul: contornos de rayos X RHESSI. No cubre el disco completo."},
  {id:'sun-visible',label:'Visible · SOHO/MDI',file:'sun-visible.jpg',url:'https://svs.gsfc.nasa.gov/vis/a000000/a002700/a002750/rhessi0001.jpg',source:'https://svs.gsfc.nasa.gov/2750/',credit:'NASA/SOHO · 22 de julio de 2002',note:'Intensidad visible del disco solar desde SOHO. Observación de un hemisferio; no representa la fecha del reloj ni una cartografía de la cara oculta.'},
  {id:'sun-xray',label:'Rayos X · NuSTAR + SDO',file:'sun-xray.jpg',url:'https://images-assets.nasa.gov/image/PIA18906/PIA18906~orig.jpg',source:'https://www.nasa.gov/solar-system/sun-sizzles-in-high-energy-x-rays/',credit:'NASA/JPL-Caltech/GSFC · 2014',note:'Composición: rayos X NuSTAR de 2–3 keV en verde y 3–5 keV en azul, sobre ultravioleta SDO. NuSTAR cubre una región del disco, no toda la superficie solar.'},
  {id:'sun-gamma',label:'Gamma · RHESSI 2,2 MeV',file:'sun-gamma.jpg',url:'https://svs.gsfc.nasa.gov/vis/a000000/a002700/a002750/rhessi0254.jpg',source:'https://svs.gsfc.nasa.gov/2750/',credit:'NASA/RHESSI, SOHO y TRACE · 23 de julio de 2002',note:'Región activa AR 10039 durante una fulguración. Violeta: emisión gamma a 2,2 MeV; rojo y azul: rayos X. Es una medición regional superpuesta, no la apariencia permanente de una estrella.'}
 ]
};

export function renderScientificObservations(root,item){
 root.replaceChildren();const observations=SCIENTIFIC_OBSERVATIONS[item.id];root.hidden=!observations;if(!observations)return;
 const title=document.createElement('h4');title.textContent='Observaciones científicas';
 const label=document.createElement('label');label.textContent='Instrumento y banda ';
 const select=document.createElement('select');select.setAttribute('aria-label','Observación científica');
 select.append(...observations.map(x=>new Option(x.label,x.id)));label.append(select);
 const figure=document.createElement('figure'),image=document.createElement('img'),caption=document.createElement('figcaption'),source=document.createElement('a'),status=document.createElement('p');
 source.target='_blank';source.rel='noopener';source.textContent='Observación y créditos ↗';status.className='catalog-note';status.setAttribute('aria-live','polite');image.decoding='async';image.loading='lazy';
 figure.append(image,caption);root.append(title,label,figure,status,source);
 let request=0;
 const update=()=>{const spec=observations.find(x=>x.id===select.value),token=++request;status.textContent='Cargando observación…';image.hidden=false;
  image.onload=()=>{if(token===request)status.textContent=spec.note;};
  image.onerror=()=>{if(token===request){image.hidden=true;status.textContent='No se pudo cargar la imagen. Puedes abrirla en su fuente.';}};
  caption.textContent=spec.label+' · '+spec.credit;source.href=spec.source;image.alt=spec.label+' — '+spec.note;image.src=(import.meta.env?.BASE_URL||'/')+'observations/'+spec.file;
 };
 select.onchange=update;update();
}
