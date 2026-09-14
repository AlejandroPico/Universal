// Curated files, checked against their description pages on 2026-09-14.
// Family-level context only: never an identification of the selected NORAD object.
const commons='https://commons.wikimedia.org/wiki/File:';
export const SATELLITE_GALLERIES={
 starlink:{name:'Starlink',images:[{file:'starlink-stack.jpg',image:'https://upload.wikimedia.org/wikipedia/commons/9/91/Starlink_Mission_%2847926144123%29.jpg',caption:'Fotografía · lote de 60 satélites de prueba Starlink antes del despliegue, mayo de 2019. Diseño histórico.',credit:'SpaceX · CC0 1.0',url:commons+'Starlink_Mission_(47926144123).jpg',license:'https://creativecommons.org/publicdomain/zero/1.0/'}]},
 oneweb:{name:'OneWeb',images:[{file:'oneweb-integration-preview.jpg',image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/LVM3_M2%2C_OneWeb_India-1_campaign_16.jpg/960px-LVM3_M2%2C_OneWeb_India-1_campaign_16.jpg',caption:'Fotografía · integración de la misión OneWeb India-1 / LVM3 M2, octubre de 2022.',credit:'Indian Space Research Organisation · GODL-India · vista reducida',url:commons+'LVM3_M2,_OneWeb_India-1_campaign_16.jpg',license:'https://data.gov.in/government-open-data-license-india',original:'https://www.isro.gov.in/mission_lvm3_gallery.html'}]},
 gps:{name:'GPS',images:[{file:'gps-iif.jpg',image:'https://upload.wikimedia.org/wikipedia/commons/8/8d/GPS_Satellite_NASA_art-iif.jpg',caption:'Ilustración · satélite GPS Block IIF. No representa todos los bloques de la constelación.',credit:'NASA · dominio público',url:commons+'GPS_Satellite_NASA_art-iif.jpg',license:'https://commons.wikimedia.org/wiki/Template:PD-USGov-NASA'},{file:'gps-constellation.jpg',image:'https://upload.wikimedia.org/wikipedia/commons/e/e2/GPS-constellation-3D-NOAA.jpg',caption:'Esquema · disposición de la constelación GPS. Diagrama histórico, no posiciones actuales.',credit:'NOAA · dominio público',url:commons+'GPS-constellation-3D-NOAA.jpg',license:'https://commons.wikimedia.org/wiki/Template:PD-USGov-NOAA'}]},
 galileo:{name:'Galileo',images:[{file:'galileo-foc.jpg',image:'https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2014/07/galileo_satellite2/14642060-2-eng-GB/Galileo_satellite_pillars.jpg',caption:'Ilustración · diseño Galileo FOC, 2014. Referencia de la familia.',credit:'ESA–Pierre Carril, 2014 · ESA Standard Licence',url:'https://www.esa.int/ESA_Multimedia/Images/2014/07/Galileo_satellite2',license:'https://www.esa.int/ESA_Multimedia/Terms_and_conditions_of_use_of_images_and_videos_available_on_the_esa_website'},{file:'galileo-constellation.jpg',image:'https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2007/05/galileo_constellation/9542530-4-eng-GB/Galileo_constellation_pillars.jpg',caption:'Ilustración · concepto de la constelación Galileo, 2007. No muestra la flota actual.',credit:'ESA–J. Huart · ESA Standard Licence',url:'https://www.esa.int/ESA_Multimedia/Images/2007/05/Galileo_constellation',license:'https://www.esa.int/ESA_Multimedia/Terms_and_conditions_of_use_of_images_and_videos_available_on_the_esa_website'}]},
 iridium:{name:'Iridium',images:[{file:'iridium-replica.jpg',image:'https://upload.wikimedia.org/wikipedia/commons/b/b6/Iridium_Satellite.jpg',caption:'Fotografía · réplica de museo de un Iridium de primera generación, 2008. No es un Iridium NEXT en vuelo.',credit:'Cliff · CC BY 2.0 · sin modificaciones',url:commons+'Iridium_Satellite.jpg',license:'https://creativecommons.org/licenses/by/2.0/'}]}
};
export function satelliteFamily(item){
 if(!item||item.isDebris||item.component)return null;
 if(SATELLITE_GALLERIES[item.group])return SATELLITE_GALLERIES[item.group];
 if(SATELLITE_GALLERIES[item.id])return SATELLITE_GALLERIES[item.id];
 return null;
}
export function familyMedia(item){return (satelliteFamily(item)?.images||[]).map(x=>({...x,file:'families/'+x.file}));}
export function renderFamilyGallery(root,item){
 const family=satelliteFamily(item);root.replaceChildren();root.hidden=!family;if(!family)return;
 const title=document.createElement('h3');title.textContent='Galería de la familia · '+family.name;
 const note=document.createElement('p');note.className='catalog-note';note.textContent='Referencias verificadas de la familia. No identifican el satélite seleccionado ni su generación.';root.append(title,note);
 for(const x of familyMedia(item)){
  const figure=document.createElement('figure'),a=document.createElement('a'),img=document.createElement('img'),caption=document.createElement('figcaption'),license=document.createElement('a');
  a.href=x.url;a.target='_blank';a.rel='noreferrer';img.src=(import.meta.env?.BASE_URL||'/')+x.file;img.alt=x.caption;img.loading='lazy';img.decoding='async';a.append(img);
  caption.textContent=x.caption+' '+x.credit+' · ';license.href=x.license;license.textContent='Licencia ↗';license.target='_blank';license.rel='noreferrer';caption.append(license);
  img.onerror=()=>{img.hidden=true;a.textContent='Abrir imagen en su fuente ↗';};figure.append(a,caption);root.append(figure);
 }
}
