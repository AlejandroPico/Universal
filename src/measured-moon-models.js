// Cassini ISS shape models, P. Thomas (2018), PDS bundle version 1.0.
export const CASSINI_SHAPES=['atlas','calypso','daphnis','epimetheus','helene','hyperion','janus','pan','pandora','prometheus','telesto'];
export const CASSINI_SHAPE_ROOT='https://sbnarchive.psi.edu/pds4/cassini/saturn_satellite_shape_models_V1_0/';
export const MEASURED_MOON_MODELS=Object.fromEntries(CASSINI_SHAPES.map(id=>[id,{
 file:id+'-cassini.obj',format:'obj',kmPerUnit:1,
 source:'https://doi.org/10.26033/ewy3-jy61',
 note:'Forma medida Cassini/ISS · P. Thomas, PDS (2018). Malla original en kilómetros; material neutro sin cartografía fotográfica inventada. La orientación de inspección es aproximada y no reproduce una solución de rotación SPICE, especialmente en Hiperión.'
}]));

// PDS tables use zero-based indices; OBJ uses one-based indices. Keep the
// native center and dimensions, validate every plate before conversion.
export function cassiniShapeOBJ(text){
 const rows=text.trim().split(/\r?\n/).map(s=>s.trim().split(/\s+/).map(Number));
 const [vertices,plates]=rows.shift();
 if(!Number.isInteger(vertices)||!Number.isInteger(plates)||vertices<4||plates<4||rows.length!==vertices+plates)throw Error('Tabla Cassini incompleta');
 const xyz=rows.slice(0,vertices),faces=rows.slice(vertices);
 if(xyz.some(r=>r.length!==3||!r.every(Number.isFinite))||faces.some(r=>r.length!==3||r.some(v=>!Number.isInteger(v)||v<0||v>=vertices)))throw Error('Geometría Cassini inválida');
 const extent=Math.max(...xyz.map(r=>Math.hypot(...r)));
 if(!Number.isFinite(extent)||extent<=0)throw Error('Escala Cassini inválida');
 return {obj:'# Cassini ISS / P. Thomas / NASA PDS — kilometers, original body frame\n'+xyz.map(r=>'v '+r.join(' ')).join('\n')+'\n'+faces.map(r=>'f '+r.map(v=>v+1).join(' ')).join('\n')+'\n',vertices,plates,extent};
}

export const STOOKE_ROOT='https://sbnarchive.psi.edu/pds4/non_mission/small_bodies.stooke.shape-models/data/';
export const STOOKE_SHAPES={halley:'1682q1halley',ida:'243ida',mathilde:'253mathilde',gaspra:'951gaspra',amalthea:'j5amalthea',thebe:'j14thebe',larissa:'n7larissa',proteus:'n8proteus'};
export const STOOKE_BODY_MODELS=Object.fromEntries(Object.entries(STOOKE_SHAPES).map(([id,file])=>[id,{
 file:id+'-stooke.obj',format:'obj',kmPerUnit:1,source:'https://sbn.psi.edu/pds/resource/stkshape.html',
 note:'Modelo de forma histórica de Philip Stooke / NASA PDS, derivado de imágenes de las misiones de sobrevuelo. Malla de radios planetocéntricos cada 5°, en kilómetros, sin textura inventada ni evolución temporal. '+(id==='halley'?'Halley: datos Giotto/Vega; crédito Alain Abergel y Philip Stooke. Incertidumbre absoluta estimada de 0,5–1 km, muy superior al detalle de la malla. ':'La cobertura y precisión son limitadas; orientación de inspección aproximada.')
}]));

export const HARTLEY_SHAPE_URL='https://pdssbn.astro.umd.edu/holdings/dif-c-hriv_mri-5-hartley2-shape-v1.0/data/hartley2_2012_cart.wrl';
export function hartleyShapeOBJ(text){
 const coordinate=text.match(/Coordinate\s*\{\s*point\s*\[([^]*?)\]/),indices=text.match(/coordIndex\s*\[([^]*?)\]/);
 if(!coordinate||!indices)throw Error('Geometría EPOXI ausente');
 const numbers=s=>s.replace(/#[^\r\n]*/g,'').trim().split(/[\s,]+/).filter(Boolean).map(Number),xyz=numbers(coordinate[1]),flat=numbers(indices[1]),faces=[];let face=[];
 if(xyz.length!==16022*3||!xyz.every(Number.isFinite))throw Error('Vértices EPOXI inválidos');
 for(const i of flat){if(i===-1){if(face.length!==3)throw Error('Placa EPOXI inválida');faces.push(face);face=[];}else{if(!Number.isInteger(i)||i<0||i>=16022)throw Error('Índice EPOXI inválido');face.push(i+1);}}
 if(face.length||faces.length!==32040)throw Error('Malla EPOXI incompleta');
 return '# EPOXI / Farnham & Thomas / NASA PDS (2013) — kilometers\n'+Array.from({length:16022},(_,i)=>'v '+xyz.slice(i*3,i*3+3).join(' ')).join('\n')+'\n'+faces.map(f=>'f '+f.join(' ')).join('\n')+'\n';
}

export function stookeShapeOBJ(text,west=false){
 const rows=text.trim().split(/[\r\n]+/).map(s=>s.trim().split(/\s+/).map(Number));
 if(rows.length!==2701||rows.some(r=>r.length!==3||!r.every(Number.isFinite)||r[2]<=0))throw Error('Tabla Stooke incompleta');
 const samples=new Map(rows.map(([l,b,r])=>[`${l}:${b}`,r]));
 const xyz=[],faces=[];
 const vertex=(l,b)=>{const r=samples.get(`${l}:${b}`);if(!r)throw Error('Coordenada Stooke ausente');const a=l*Math.PI/180*(west?-1:1),e=b*Math.PI/180;xyz.push([r*Math.cos(e)*Math.cos(a),r*Math.cos(e)*Math.sin(a),r*Math.sin(e)]);return xyz.length;};
 const south=vertex(0,-90),north=vertex(0,90);
 for(let l=0;l<360;l+=5)for(let b=-85;b<=85;b+=5)vertex(l,b);
 const index=(l,j)=>3+(l%72)*35+j;
 for(let l=0;l<72;l++){
  faces.push([south,index(l+1,0),index(l,0)],[north,index(l,34),index(l+1,34)]);
  for(let j=0;j<34;j++){const a=index(l,j),b=index(l+1,j),c=index(l+1,j+1),d=index(l,j+1);faces.push([a,b,c],[a,c,d]);}
 }
 // Both longitude conventions produce outward-facing triangles.
 for(const f of faces){const [a,b,c]=f.map(i=>xyz[i-1]),u=b.map((v,i)=>v-a[i]),v=c.map((x,i)=>x-a[i]);const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];if(n.reduce((s,x,i)=>s+x*a[i],0)<0)[f[1],f[2]]=[f[2],f[1]];}
 return '# Stooke / NASA PDS — native kilometers; planetocentric 5-degree grid\n'+xyz.map(r=>'v '+r.join(' ')).join('\n')+'\n'+faces.map(r=>'f '+r.join(' ')).join('\n')+'\n';
}
