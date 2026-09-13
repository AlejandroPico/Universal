export const NATURAL_TARGETS=[
 ['mercury',199,10],['venus',299,10],['earth',399,10],['mars',499,10],['jupiter',599,10],['saturn',699,10],['uranus',799,10],['neptune',899,10],['pluto',999,10],
 ['moon',301,399],['phobos',401,499],['deimos',402,499],['io',501,599],['europa',502,599],['ganymede',503,599],['callisto',504,599],['mimas',601,699],['enceladus',602,699],['tethys',603,699],['dione',604,699],['rhea',605,699],['titan',606,699],['iapetus',608,699],['miranda',705,799],['ariel',701,799],['umbriel',702,799],['titania',703,799],['oberon',704,799],['triton',801,899],['charon',901,999],
 ['bary-ssb',0,10],['bary-earth',3,10],['bary-jupiter',5,10],['bary-saturn',6,10],['bary-uranus',7,10],['bary-neptune',8,10],['bary-pluto',9,10]
];
export const BARYCENTERS=[['bary-ssb','Baricentro del Sistema Solar',1.5e8],['bary-earth','Baricentro Tierra–Luna',1e6],['bary-jupiter','Baricentro de Júpiter',4e6],['bary-saturn','Baricentro de Saturno',5e6],['bary-uranus','Baricentro de Urano',2e6],['bary-neptune','Baricentro de Neptuno',2e6],['bary-pluto','Baricentro Plutón–Caronte',1e5]];
export function parseHorizonsVectors(result){
 const block=result?.split('$$SOE')[1]?.split('$$EOE')[0];if(!block)throw Error('Horizons: no vector block');
 const samples=block.trim().split(/\r?\n/).map(line=>{const r=line.split(',');return[(Number(r[0])-2440587.5)*86400000,...r.slice(2,8).map(Number)];});
 if(samples.length<2||samples.some((r,i)=>r.length!==7||!r.every(Number.isFinite)||(i&&r[0]<=samples[i-1][0])))throw Error('Horizons: invalid or unordered vectors');
 return samples;
}
