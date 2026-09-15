import {equatorialPosition,LY_KM} from './cosmic-data.js';
export function schwarzschildRadiusKm(massSolar){
 if(!Number.isFinite(massSolar)||massSolar<=0)throw new RangeError('Masa positiva requerida');
 return 2*1.32712440018e11*massSolar/299792.458**2;
}
export const BLACK_HOLES=[
 {id:'sgr-a-star',name:'Sagitario A*',aliases:'Sagittarius A* Sgr A* centro galáctico',raDeg:266.4168333,decDeg:-29.0078444,distanceLy:27000,massSolar:4e6,image:'https://cdn.eso.org/images/screen/eso2208-eht-mwa.jpg',sourceUrl:'https://www.eso.org/public/images/eso2208-eht-mwa/',releaseYear:2022},
 {id:'m87-star',name:'M87*',aliases:'Agujero negro de Virgo A Messier 87',raDeg:187.70593,decDeg:12.391123,distanceLy:55e6,massSolar:6.5e9,image:'https://cdn.eso.org/images/publicationjpg/eso1907a.jpg',sourceUrl:'https://www.eso.org/public/images/eso1907a/',releaseYear:2019}
].map(x=>({...x,kind:'black-hole',cosmic:true,position:equatorialPosition(x.raDeg/15,x.decDeg,x.distanceLy*LY_KM),radiusKm:schwarzschildRadiusKm(x.massSolar),radiusLy:schwarzschildRadiusKm(x.massSolar)/LY_KM,viewDistanceKm:schwarzschildRadiusKm(x.massSolar)*32,color:'#ffc38e',source:'EHT Collaboration / ESO',evidence:'Observación EHT · modelo separado',summary:`Agujero negro supermasivo. Masa de referencia aproximada: ${x.massSolar.toLocaleString('es-ES')} masas solares. La imagen EHT publicada en ${x.releaseYear} reconstruye la emisión de radio a 1,3 mm observada en 2017, en falso color; no muestra una superficie. La sombra es mayor que el horizonte. Al acercarte se aplica el mismo modelo óptico de agujero negro sin rotación a cualquier objeto de este catálogo: la lente deforma el entorno de su propia posición, sin superponer un disco ilustrado. Distancia aproximada de referencia; no es una efeméride.`}));
