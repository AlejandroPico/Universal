import {PC_KM} from './cosmic-data.js';
export function velocityToScene(v){const e=23.43928*Math.PI/180;return[v[0]*PC_KM,(v[2]*Math.cos(e)-v[1]*Math.sin(e))*PC_KM,(-v[1]*Math.cos(e)-v[2]*Math.sin(e))*PC_KM];}
export function projectedStar(base,velocity,years){if(!Number.isFinite(years)||Math.abs(years)>10000)return [...base];return base.map((x,i)=>x+velocity[i]*years);}
