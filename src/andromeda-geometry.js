import * as THREE from 'three';
import {equatorialPosition,LY_KM} from './cosmic-data.js';
import {equatorialBasis} from './atlas-data.js';
// Geometry convention: M31 PA 38° east of north, inclination 77°.
// https://academic.oup.com/mnras/article/528/2/2653/7512223
export const M31_DISK_RADIUS_LY=71000;
export const M31_PHOTO={ra:10.75225,dec:41.2608694444,widthArcmin:362,heightArcmin:234.12,northLeftDeg:1.9};
export function andromedaBasis(item){
 const b=equatorialBasis(item.position),north=new THREE.Vector3(...b.up),east=new THREE.Vector3(...b.right).negate(),view=new THREE.Vector3(...b.normal);
 const pa=THREE.MathUtils.degToRad(38),inc=THREE.MathUtils.degToRad(77);
 const major=north.clone().multiplyScalar(Math.cos(pa)).addScaledVector(east,Math.sin(pa));
 const minor=new THREE.Vector3().crossVectors(view,major).normalize().multiplyScalar(Math.cos(inc)).addScaledVector(view,Math.sin(inc));
 const pole=new THREE.Vector3().crossVectors(major,minor).normalize();
 return new THREE.Matrix4().makeBasis(major,minor,pole);
}
export function andromedaPhotoPosition(distanceLy){return equatorialPosition(M31_PHOTO.ra/15,M31_PHOTO.dec,distanceLy*LY_KM);}
