import {SceneRuler} from './scene-ruler.js';
import {LY_KM} from './cosmic-data.js';
const C=299792.458;
export function comparisonRows(a,b){
 const radius=x=>x.radiusKm??(x.radiusLy?x.radiusLy*LY_KM:null);
 return [['Radio (km)',radius(a),radius(b)],['Distancia de referencia (a.l.)',a.distanceLy,b.distanceLy],['Periodo (días)',a.periodDays??(a.periodHours?a.periodHours/24:null),b.periodDays??(b.periodHours?b.periodHours/24:null)],['Magnitud aparente',a.mag,b.mag],['Luminosidad (soles)',a.lum,b.lum]];
}
export function lightTravel(km){return {seconds:km/C,years:km/LY_KM};}
export const TOURS=[
 {name:'Del Sol a Carina',ids:['sun','earth','jupiter','pluto','milky-way','carina'],note:'Explora las escalas del sistema solar y la galaxia. Termina en el campo observado de Carina.'},
 {name:'Observatorios espaciales',ids:['20580','jwst','euclid','sun-earth-l2'],note:'Compara órbita terrestre, trayectorias de observatorios y el punto L2. Las posiciones requieren datos válidos para la fecha.'},
 {name:'Del Grupo Local al CMB',ids:['milky-way','andromeda','triangulum','laniakea','cmb'],note:'Al aumentar la escala, distingue posiciones catalogadas, modelos de estructura y el mapa angular del CMB.'}
];
export function mountExplorationTools(scene,select){
 const dialog=document.createElement('dialog');dialog.className='app-dialog exploration-dialog';dialog.innerHTML=`<div class="dialog-heading"><strong>Explorar y comparar</strong><button data-close aria-label="Cerrar exploración">×</button></div><div class="exploration-body"><p>Selecciona objetos en el mapa o en el buscador y guárdalos en A y B.</p><div class="exploration-actions"><button data-save="a">Usar selección como A</button><button data-save="b">Usar selección como B</button></div><div data-comparison></div><div class="exploration-actions"><button data-ruler>Dibujar regla A–B</button><button data-clear-ruler>Quitar regla</button></div><p data-ruler-status></p><h3>Recorridos</h3><select data-tour aria-label="Recorrido"></select><p data-tour-note></p><div class="exploration-actions"><button data-prev>Anterior</button><button data-next>Siguiente parada</button></div><p data-stop></p><h3>Captura con créditos</h3><p>Exporta la escena con fecha, foco y procedencia. Las fotografías conservan sus licencias originales.</p><button data-capture>Guardar imagen PNG</button><p data-capture-status></p></div>`;document.body.append(dialog);
 const $=s=>dialog.querySelector(s);$('[data-close]').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 scene.ruler??=new SceneRuler(scene);
 $('[data-ruler]').onclick=()=>{if(!values.a||!values.b){$('[data-ruler-status]').textContent='Guarda primero los dos extremos A y B.';return;}scene.ruler.set(values.a,values.b);dialog.close();};
 $('[data-clear-ruler]').onclick=()=>scene.ruler.clear();
 const values={};const format=v=>v==null?'Sin dato':Number(v).toLocaleString('es-ES',{maximumSignificantDigits:6});
 const render=()=>{const root=$('[data-comparison]');root.replaceChildren();if(!values.a||!values.b){root.textContent='A: '+(values.a?.name||'sin seleccionar')+' · B: '+(values.b?.name||'sin seleccionar');return;}
  const table=document.createElement('table');const add=cells=>{const tr=document.createElement('tr');for(const text of cells){const td=document.createElement('td');td.textContent=text;tr.append(td);}table.append(tr);};add(['Propiedad',values.a.name,values.b.name]);for(const [label,a,b] of comparisonRows(values.a,values.b))add([label,format(a),format(b)]);root.append(table);
  const position=x=>scene.currentAbsolutePosition(x,scene.simulationDate),a=position(values.a),b=position(values.b);if(a&&b){const km=a.distanceTo(b),t=lightTravel(km),p=document.createElement('p');p.textContent=`Separación en el modelo: ${format(km)} km (${format(t.years)} a.l.). Tiempo a velocidad de la luz, sin expansión: ${format(t.seconds)} segundos.`;root.append(p);}
  const note=document.createElement('p');note.className='catalog-note';note.textContent='La separación corresponde a las coordenadas del visor. En escalas cosmológicas, distancia comóvil / c no equivale a la antigüedad de la luz observada. Los datos ausentes se muestran como tales.';root.append(note);
 };
 for(const button of dialog.querySelectorAll('[data-save]'))button.onclick=()=>{if(scene.selected)values[button.dataset.save]=scene.selected;render();};
 TOURS.forEach((t,i)=>{const o=document.createElement('option');o.value=i;o.textContent=t.name;$('[data-tour]').append(o);});let stop=-1;
 const tour=()=>TOURS[Number($('[data-tour]').value)];const show=()=>{$('[data-tour-note]').textContent=tour().note;$('[data-stop]').textContent=stop<0?'Elige una parada para empezar.':`${stop+1} / ${tour().ids.length}`;};
 const go=delta=>{stop=Math.max(0,Math.min(tour().ids.length-1,stop+delta));const id=tour().ids[stop],item=[...scene.getFocusTargets(),...scene.records].find(x=>x.id===id);show();if(item){select(item);dialog.close();}else $('[data-stop]').textContent+=' · Este destino aún no está cargado; prueba la siguiente parada.';};
 $('[data-tour]').onchange=()=>{stop=-1;show();};$('[data-next]').onclick=()=>go(1);$('[data-prev]').onclick=()=>go(-1);show();render();
 $('[data-capture]').onclick=()=>{dialog.close();scene.captureRequest=()=>{try{const source=scene.renderer.domElement,canvas=document.createElement('canvas');canvas.width=source.width;canvas.height=source.height+110;const ctx=canvas.getContext('2d');ctx.fillStyle='#07101a';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(source,0,0);ctx.fillStyle='#fff';ctx.font='16px sans-serif';const lines=[`Universal · ${scene.selected?.name||scene.focus.id} · ${scene.simulationDate.toISOString()}`,'Datos: NASA/JPL · HYG · ESA/Planck · CDS · SDSS/2MRS · Cosmicflows', [...document.querySelectorAll('#photo-credit,#atlas-credit,#map-credit')].filter(x=>!x.hidden).map(x=>x.textContent).join(' · ')||'Modelos y fuentes descritos en las fichas de Universal.'];lines.forEach((line,i)=>ctx.fillText(line,16,source.height+28+i*26,canvas.width-32));canvas.toBlob(blob=>{if(!blob)return;const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Universal-'+new Date().toISOString().slice(0,10)+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});}catch{$('[data-capture-status]').textContent='No se pudo exportar la imagen con las fuentes cargadas.';dialog.showModal();}};};
 return ()=>{render();dialog.showModal();};
}
