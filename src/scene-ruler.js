import * as THREE from 'three';
import {LY_KM} from './cosmic-data.js';
export class SceneRuler {
 constructor(scene){this.scene=scene;this.items=null;this.last=0;this.root=document.createElement('div');this.root.className='scene-ruler';this.root.hidden=true;this.root.innerHTML='<svg aria-hidden="true"><line/><circle r="5"/><circle r="5"/></svg><span role="status"></span><div class="ruler-controls"><button data-fit>Encuadrar A–B</button><button data-clear>Cerrar regla ×</button></div>';scene.container.append(this.root);this.root.querySelector('[data-fit]').onclick=()=>this.fit();this.root.querySelector('[data-clear]').onclick=()=>this.clear();}
 set(a,b){this.items=[a,b];this.last=0;this.fit();this.update();}
 fit(){
  if(!this.items)return;const s=this.scene,p=this.items.map(x=>!x.noLocation&&s.currentAbsolutePosition(x,s.simulationDate));if(p.some(x=>!x))return;
  const span=p[0].distanceTo(p[1]),mid=p[0].clone().add(p[1]).multiplyScalar(.5),axis=p[1].clone().sub(p[0]).normalize();
  let direction=new THREE.Vector3().crossVectors(axis,new THREE.Vector3(0,1,0));if(direction.lengthSq()<.001)direction.crossVectors(axis,new THREE.Vector3(1,0,0));if(!direction.lengthSq())direction.set(0,0,1);direction.normalize();
  const distance=Math.max(1000,span*.85/(Math.tan(s.camera.fov*Math.PI/360)*Math.min(1,s.camera.aspect)));
  const item={id:'ruler-view',name:'Regla A–B',kind:'region',cosmic:true,solarRegion:span<.1*LY_KM,position:mid.toArray(),viewDistanceKm:distance};
  s.focus={type:'object',item};s.zoomTarget=null;s.controls.minDistance=1;s.camera.position.copy(direction.multiplyScalar(distance));s.controls.target.set(0,0,0);s.controls.update();s.updateWorld(s.simulationDate,true);s.prepareRender();s.onFocus?.(item);this.last=0;
 }
 clear(){this.items=null;this.root.hidden=true;}
 update(){if(!this.items)return;if(performance.now()-this.last<100)return;this.last=performance.now();const s=this.scene,[a,b]=this.items,svg=this.root.querySelector('svg'),label=this.root.querySelector('span');this.root.hidden=false;
 const pos=x=>x.noLocation||x.satrec&&!s.catalogSupports(s.simulationDate)?null:s.currentAbsolutePosition(x,s.simulationDate);
 const p=pos(a),q=pos(b);if(!p||!q){svg.style.display='none';label.textContent='Regla: posición no disponible en esta fecha.';return;}
 const km=p.distanceTo(q),distance=km>LY_KM?`${(km/LY_KM).toLocaleString('es-ES',{maximumSignificantDigits:5})} a.l.`:`${km.toLocaleString('es-ES',{maximumSignificantDigits:6})} km`;
 label.textContent=`A: ${a.name} ↔ B: ${b.name} · ${distance} · luz ${(km/299792.458).toLocaleString('es-ES',{maximumSignificantDigits:4})} s (sin expansión)`;
 const projected=[p,q].map(v=>v.clone().sub(s.focusOrigin).divideScalar(s.renderUnit).project(s.renderCamera));
 if(projected.some(v=>!Number.isFinite(v.x)||v.z < -1||v.z>1)){svg.style.display='none';label.textContent+=' · Extremos fuera de vista: pulsa Encuadrar A–B.';return;}svg.style.display='block';
 const [u,v]=projected.map(p=>[(p.x*.5+.5)*s.container.clientWidth,(-p.y*.5+.5)*s.container.clientHeight]);const line=svg.querySelector('line');for(const[k,n]of Object.entries({x1:u[0],y1:u[1],x2:v[0],y2:v[1]}))line.setAttribute(k,n);svg.querySelectorAll('circle').forEach((c,i)=>{c.setAttribute('cx',[u,v][i][0]);c.setAttribute('cy',[u,v][i][1]);});
 }
}
