import * as THREE from 'three';
import {equatorialBasis} from './atlas-data.js';
import {GALAXY_ORIENTATIONS} from './galaxy-orientations.js';
export function galaxyDiskBasis(item){
 const fit=GALAXY_ORIENTATIONS[item.id];if(!fit)return null;
 const b=equatorialBasis(item.position),north=new THREE.Vector3(...b.up),east=new THREE.Vector3(...b.right).negate(),view=new THREE.Vector3(...b.normal);
 const pa=THREE.MathUtils.degToRad(fit.pa),inc=THREE.MathUtils.degToRad(fit.inclination);
 const major=north.clone().multiplyScalar(Math.cos(pa)).addScaledVector(east,Math.sin(pa));
 const minor=new THREE.Vector3().crossVectors(view,major).normalize().multiplyScalar(Math.cos(inc)).addScaledVector(view,Math.sin(inc));
 return new THREE.Matrix4().makeBasis(major,minor,new THREE.Vector3().crossVectors(major,minor).normalize());
}
