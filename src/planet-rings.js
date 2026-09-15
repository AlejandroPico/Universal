import * as THREE from 'three';
import {physicalShader} from './shader-support.js';
// Radii and widths in km: NASA NSSDCA ring fact sheets (2015).
// Strength is a display exposure, NOT a measured optical depth or albedo.
export const RING_SYSTEMS={
 saturn:{source:'https://nssdc.gsfc.nasa.gov/planetary/factsheet/satringfact.html',axes:[60268,54364,60268],color:'#bbb1a0',bands:[['D interior',66900,74268.3,.018],['G',166000,173000,.009],['E',180000,480000,.004]],note:'Complemento tenue del modelo NASA: región D interior y anillos G y E. No se superpone al tramo radial de 74.268 a 140.479 km del modelo original. Se aproxima el polvo mediante bandas planas, sin resolver su espesor vertical ni todas las pequeñas estructuras.'},
 jupiter:{source:'https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupringfact.html',axes:[71492,66854,71492],color:'#b4a391',bands:[['Halo',89400,123000,.018],['Principal',123000,128940,.16],['Amaltea',128940,181350,.012],['Tebe',181350,221900,.009],['Extensión de Tebe',221900,280000,.004]],note:'Radios del halo y los anillos principal, de Amaltea y de Tebe según NASA. Modelo radial simplificado: no reproduce el espesor vertical del halo ni granos individuales.'},
 uranus:{source:'https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranringfact.html',axes:[25559,24973,25559],color:'#b6bec5',bands:[['6',41836.25,41837.75,.5],['5',42233,42235,.5],['4',42570,42572,.5],['Alfa',44714.5,44721.5,.6],['Beta',45657,45665,.6],['Eta',47175.2,47176.8,.5],['Gamma',47625.75,47628.25,.6],['Delta',48297.5,48302.5,.6],['Lambda',50023,50025,.4],['Épsilon',51120,51178,.9],['Nu',65400,69200,.008],['Mu',89200,106200,.006]],note:'Doce bandas de la tabla NASA, con radios y anchuras medias. Siguen el plano ecuatorial inclinado de Urano. Aproximación circular: no incluye el anillo Zeta ni la excentricidad y variación azimutal de anchura.'},
 neptune:{source:'https://nssdc.gsfc.nasa.gov/planetary/factsheet/nepringfact.html',axes:[24764,24341,24764],color:'#b4b5c4',bands:[['Galle',40900,42900,.025],['Le Verrier',53150,53250,.35],['Lassell',53200,57200,.018],['Arago',57150,57250,.3],['Adams',62925.5,62940.5,.65]],note:'Cinco anillos principales según NASA. Para Le Verrier y Arago se usa el límite superior tabulado de 100 km de anchura. No se inventa la posición actual de los arcos de Adams.'}
};
export function makePlanetRings(id){
 const spec=RING_SYSTEMS[id];if(!spec)return null;
 const bands=Array.from({length:13},(_,i)=>{const b=spec.bands[i];return b?new THREE.Vector3((b[1]+b[2])/2,(b[2]-b[1])/2,b[3]):new THREE.Vector3();});
 const inner=Math.min(...spec.bands.map(b=>b[1])),outer=Math.max(...spec.bands.map(b=>b[2]));
 const geometry=new THREE.RingGeometry(inner,outer,512);geometry.rotateX(-Math.PI/2);
 const material=physicalShader({transparent:true,depthWrite:false,side:THREE.DoubleSide,
  uniforms:{bands:{value:bands},count:{value:spec.bands.length},gain:{value:2},tint:{value:new THREE.Color(spec.color)},sunDirection:{value:new THREE.Vector3(1,1,0).normalize()},planetAxes:{value:new THREE.Vector3(...spec.axes)}},
  vertexShader:'varying vec3 ringPosition;void main(){ringPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:`uniform vec3 bands[13];uniform int count;uniform float gain;uniform vec3 tint,sunDirection,planetAxes;varying vec3 ringPosition;
  void main(){float r=length(ringPosition.xz),pixel=max(fwidth(r),.001),alpha=0.;
   for(int i=0;i<13;i++){if(i>=count)break;vec3 b=bands[i];float d=abs(r-b.x);float coverage=(1.-smoothstep(max(0.,b.y-pixel),b.y+pixel,d))*min(1.,b.y/pixel);alpha+=coverage*b.z;}
   vec3 p=ringPosition/planetAxes,d=sunDirection/planetAxes;float aa=dot(d,d),bb=dot(p,d),cc=dot(p,p)-1.,disc=bb*bb-aa*cc;
   float light=.45+.55*abs(sunDirection.y);if(disc>0.&&(-bb-sqrt(disc))/aa>0.)light*=.08;
   gl_FragColor=vec4(tint*light,clamp(alpha*gain,0.,.92));
  }`});
 const mesh=new THREE.Mesh(geometry,material);mesh.userData.ringSystem=id;return mesh;
}
