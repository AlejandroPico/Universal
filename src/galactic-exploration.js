import {COSMIC_OBJECTS,galacticPosition,LY_KM} from './cosmic-data.js';
import {fromGalactic,SECTOR_SIZE,sectorStar,MW_SOURCES,VIRTUAL_STAR_COUNT} from './milky-way-model.js';
export function renderGalacticExploration(root,item,scene,close){
 root.replaceChildren();root.hidden=item.id!=='milky-way'&&!item.modeled;if(root.hidden)return;
 const title=document.createElement('h3');title.textContent='Explorar la Vía Láctea';
 const note=document.createElement('p');note.className='catalog-note';note.textContent=`Disco, barra central, brazos, alabeo y halo tenue a escala física. La población virtual equivale aproximadamente a ${Math.round(VIRTUAL_STAR_COUNT/1e9)}.000 millones de estrellas; al acercarte se carga solo la zona que recorres. Los puntos lejanos son una muestra de la población, y las estrellas cercanas tienen identidad reproducible. Los catálogos observados conservan sus datos. Es una reconstrucción estadística, no la posición medida de todas las estrellas reales.`;
 const actions=document.createElement('div');actions.className='galactic-actions';
 const activate=()=>{scene.cosmos.layers.population=true;scene.cosmos.layers.galaxies=true;for(const id of ['population-toggle','galaxies-toggle']){const input=document.getElementById(id);if(input)input.checked=true;}};
 const view=(position)=>{activate();scene.focusItem(COSMIC_OBJECTS.find(x=>x.id==='milky-way'));scene.camera.position.fromArray(galacticPosition(...position)).multiplyScalar(LY_KM);scene.zoomTarget=scene.camera.position.length();scene.camera.lookAt(0,0,0);scene.controls.update();close();requestAnimationFrame(()=>scene.resize());};
 const explore=(position)=>{activate();const cell=fromGalactic(position).map(v=>Math.floor(v/SECTOR_SIZE)),target=sectorStar(...cell,0);target.viewDistanceKm=24*LY_KM;scene.focusItem(target);scene.startFreeFlight();close();};
 for(const [label,action,key] of [['Vista del disco',()=>view([0,0,140000]),'disk'],['Vista de canto',()=>view([-140000,0,4000]),'edge'],['Explorar disco interior',()=>explore([-15000,5000,0]),'inner'],['Explorar disco exterior',()=>explore([-40000,5000,200]),'outer']]){
  const button=document.createElement('button');button.type='button';button.className='secondary-button';button.dataset.galacticView=key;button.textContent=label;button.onclick=action;actions.append(button);
 }
 const help=document.createElement('p');help.className='catalog-note';help.textContent='En exploración libre: WASD para desplazarte, E/C para subir o bajar, Mayús para acelerar, arrastre para mirar y rueda para ajustar la escala. Puedes seleccionar las estrellas visibles.';
 const link=document.createElement('a');link.href=MW_SOURCES.density;link.target='_blank';link.rel='noopener';link.textContent='Densidad estelar · censo CNS5 ↗';
 root.append(title,note,actions,help,link);
}
