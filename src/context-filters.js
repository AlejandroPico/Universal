// Filters share the existing layer controls, so there is one source of truth.
export function stellarClass(spectrum) {
 const match=String(spectrum||'').trim().toUpperCase().match(/^[OBAFGKM]/);
 return match?match[0]:'unknown';
}
export function solarClass(body) {
 if(body.id==='sun')return 'star';
 if(body.type==='moon')return 'moon';
 return ['dwarf','asteroid','minor'].includes(body.type)?'minor':'planet';
}
export function mountContextFilters(scene) {
 const root=document.querySelector('#filters-section');
 const groups=[
 ['solar','Sistema solar',[['missions-toggle','Sondas y misiones'],['surface-toggle','Misiones en superficie'],['atlas-belts','Cinturones'],['atlas-oort','Nube de Oort']]],
 ['nearby','Vecindad estelar',[['stars-toggle','Estrellas observadas · HYG'],['atlas-clusters','Cúmulos estelares'],['atlas-nebulae','Nebulosas y supernovas'],['atlas-dust','Polvo interestelar']]],
 ['galactic','Vía Láctea',[['population-toggle','Estrellas modeladas de la galaxia'],['atlas-streams','Corrientes estelares'],['atlas-fermi','Burbujas de Fermi']]],
 ['galaxies','Galaxias y grandes estructuras',[['twoMrs-toggle','Catálogo 2MRS'],['sdss-toggle','Catálogo SDSS'],['atlas-desi','Catálogo DESI DR1'],['flows-toggle','Flujos de Laniakea'],['atlas-voids','Vacíos y paredes']]],
 ['lensing','Universo profundo',[['atlas-desi','Galaxias DESI DR1'],['atlas-mass','Masa por lentes gravitatorias'],['atlas-voids','Vacíos y paredes']]],
 ['horizon','Universo observable',[['structure-toggle','Densidad cósmica modelada'],['cmb-toggle','Fondo de microondas']]]
 ];
 const row=(container,label,checked,onchange)=>{
  const el=document.createElement('label');el.className='context-filter-row';
  const input=document.createElement('input');input.type='checkbox';input.checked=checked;
  const span=document.createElement('span');span.textContent=label;el.append(input,span);container.append(el);
  input.addEventListener('change',()=>onchange(input.checked));return input;
 };
 const linked=[];
 for(const [id,title,controls] of groups){
  const group=document.createElement('details');group.className='layer-group filter-group';group.id='filter-group-'+id;
  const summary=document.createElement('summary');summary.textContent=title;
  const content=document.createElement('div');content.className='layer-group-content';group.append(summary,content);root.append(group);
  if(id==='solar'){
   scene.solarTypes=new Set(['star','planet','moon','minor']);
   for(const [key,label] of [['star','Sol'],['planet','Planetas'],['moon','Lunas'],['minor','Planetas enanos y cuerpos menores']]){
    const input=row(content,label,true,checked=>{checked?scene.solarTypes.add(key):scene.solarTypes.delete(key);});input.dataset.solarType=key;
   }
  }
  if(id==='nearby'){
   const title=document.createElement('p');title.className='catalog-note';title.textContent='Tipos espectrales del catálogo HYG';content.append(title);
   for(const [key,label] of [['O','O · azules'],['B','B · azuladas'],['A','A · blancas'],['F','F · blanco amarillentas'],['G','G · amarillas'],['K','K · anaranjadas'],['M','M · rojas'],['unknown','Sin tipo clasificado']]){
    const input=row(content,label,true,checked=>{checked?scene.cosmos.stellarTypes.add(key):scene.cosmos.stellarTypes.delete(key);scene.cosmos.updateStellarFilter();});input.dataset.stellarType=key;
   }
  }
  for(const [control,label] of controls){
   const source=document.getElementById(control);if(!source)continue;
   const input=row(content,label,source.checked,checked=>{source.checked=checked;source.dispatchEvent(new Event('change',{bubbles:true}));sync();});
   linked.push({input,source});
  }
 }
 function sync(){for(const {input,source} of linked)input.checked=source.checked;}
 document.querySelector('#layers-section').addEventListener('change',sync);
 // Some layer shortcuts change their checkboxes directly.
 document.querySelector('#filters-button').addEventListener('click',sync);
 document.querySelector('#reset-filters').addEventListener('click',()=>{
  for(const input of root.querySelectorAll('[data-solar-type],[data-stellar-type]')){input.checked=true;input.dispatchEvent(new Event('change'));}
 });
}
