// Status notes are independent of the GP catalogue of currently active satellites.
const statuses={
 'gcat-D00431':{status:'Sin comunicación',lastContact:'2003-01-23',sourceUrl:'https://science.nasa.gov/mission/pioneer-10/',note:'Pioneer 10 envió su última señal el 23 de enero de 2003. No se considera destruida por haber dejado de transmitir. Este archivo no contiene una efeméride actual de la sonda: no se inventa una posición presente.'},
 'gcat-D00489':{status:'Sin comunicación',lastContact:'1995-11-24',sourceUrl:'https://science.nasa.gov/mission/pioneer-11/',note:'Pioneer 11 terminó las comunicaciones regulares el 30 de septiembre de 1995; todavía se recibieron datos de ingeniería el 24 de noviembre. La pérdida de comunicación no significa destrucción. No se atribuye una ubicación actual sin efemérides.'},
 'gcat-D00738':{status:'Destruida · entrada en Saturno',endDate:'2017-09-15',sourceUrl:'https://science.nasa.gov/mission/cassini/',note:'Cassini finalizó su misión entrando en la atmósfera de Saturno el 15 de septiembre de 2017. El mapa conserva el registro del evento; no muestra una nave que continúe existiendo.'},
 'gcat-D00680':{status:'Destruida · entrada en Júpiter',endDate:'2003-09-21',sourceUrl:'https://science.nasa.gov/mission/galileo/',note:'Galileo fue destruida deliberadamente en la atmósfera de Júpiter el 21 de septiembre de 2003. El marcador corresponde al evento histórico, no a un vehículo intacto.'}
};
export function missionArchive(data){
 return (data.missions||[]).map(record=>{
  const code=record.id.replace(/^gcat-/,''),events=(data.sites||[]).filter(x=>!x.component&&x.id.startsWith('gcat-landing-'+code+'-'));
  const event=events.sort((a,b)=>Date.parse(b.landDate||0)-Date.parse(a.landDate||0))[0];
  const state=statuses[record.id];
  return {...record,...(state||{}),historical:true,noLocation:true,eventId:event?.id,eventBody:event?.body,
   summary:record.summary+(state?' '+state.note:'')+(event?' Existe además un registro de aterrizaje, impacto o entrada vinculado a esta misión.':'')};
 });
}
