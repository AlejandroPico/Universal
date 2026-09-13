import {LY_KM} from './cosmic-data.js';
export class SceneRuler {
 constructor(scene){this.scene=scene;this.items=null;this.last=0;this.root=document.createElement('div');this.root.className='scene-ruler';this.root.hidden=true;this.root.innerHTML='<svg aria-hidden="true"><line/><circle r="5"/><circle r="5"/></svg><span role="status"></span>';scene.container.append(this.root);}
 set(a,b){this.items=[a,b];this.last=0;this.update();}
 clear(){this.items=null;this.root.hidden=true;}
 update(){if(!this.items)return;if(performance.now()-this.last<100)return;this.last=performance.now();const s=this.scene,[a,b]=this.items,svg=this.root.querySelector('svg'),label=this.root.querySelector('span');this.root.hidden=false;
 const pos=x=>x.noLocation||x.satrec&&!s.catalogSupports(s.simulationDate)?null:s.currentAbsolutePosition(x,s.simulationDate);
 const p=pos(a),q=pos(b);if(!p||!q){svg.style.display='none';label.textContent='Regla: posición no disponible en esta fecha.';return;}
 const km=p.distanceTo(q),distance=km>LY_KM?`${(km/LY_KM).toLocaleString('es-ES',{maximumSignificantDigits:5})} a.l.`:`${km.toLocaleString('es-ES',{maximumSignificantDigits:6})} km`;
 label.textContent=`${a.name} ↔ ${b.name} · ${distance} · luz ${(km/299792.458).toLocaleString('es-ES',{maximumSignificantDigits:4})} s (sin expansión)`;
 const projected=[p,q].map(v=>v.clone().sub(s.focusOrigin).divideScalar(s.renderUnit).project(s.renderCamera));
 if(projected.some(v=>!Number.isFinite(v.x)||v.z < -1||v.z>1)){svg.style.display='none';return;}svg.style.display='block';
 const [u,v]=projected.map(p=>[(p.x*.5+.5)*s.container.clientWidth,(-p.y*.5+.5)*s.container.clientHeight]);const line=svg.querySelector('line');for(const[k,n]of Object.entries({x1:u[0],y1:u[1],x2:v[0],y2:v[1]}))line.setAttribute(k,n);svg.querySelectorAll('circle').forEach((c,i)=>{c.setAttribute('cx',[u,v][i][0]);c.setAttribute('cy',[u,v][i][1]);});
 }
}
