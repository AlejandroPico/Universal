import {stellarClass} from './context-filters.js';
import {tunePoints} from './point-intensity.js';
import {StellarMotion} from './stellar-motion.js';
import {BLACK_HOLES} from './black-hole-data.js';
import {ScienceCatalogs} from './science-catalogs.js';
import {ExoplanetScene} from './exoplanet-scene.js';
import { LayerAtlas } from './atlas-scene.js';
import * as THREE from 'three';
import { MicrowaveBackground } from './cmb-scene.js';
import { GalacticSectors } from './galactic-sectors.js';
import { AstronomyPhotos } from './astronomy-photos.js';
import { galaxyPopulation } from './galaxy-model.js';
import { CosmicSurveys } from './cosmic-surveys.js';
import { closestPointOnRay } from './picking.js';
import { COSMIC_OBJECTS, LY_KM, PC_KM, equatorialPosition } from './cosmic-data.js';

function cloud(positions,colors,size,texture) {
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  return new THREE.Points(geometry,new THREE.PointsMaterial({size,sizeAttenuation:false,vertexColors:true,map:texture,transparent:true,depthTest:true,depthWrite:false,opacity:.8,blending:THREE.AdditiveBlending,toneMapped:false}));
}
export class CosmicScene {
  constructor(owner) {
    this.owner=owner; this.stellarTypes=new Set(['O','B','A','F','G','K','M','unknown']); this.stars=[]; this.layers={stars:true,galaxies:true,structure:true,labels:true,sdss:true,twoMrs:true,flows:true,sky:true,population:true,cmb:true};
    this.nodes=[]; this.targets=[...COSMIC_OBJECTS,...BLACK_HOLES]; this.galaxyExposure=1.8;this.structureExposure=1;this.catalogExposure=1;this.starState='pending'; this.magnitudeLimit={value:8.5}; this.unitPc={value:1/PC_KM};
    this.surveys=new CosmicSurveys(this);this.motion=new StellarMotion(this);
    this.cmb=new MicrowaveBackground(owner);this.photos=new AstronomyPhotos(owner);this.sectors=new GalacticSectors(owner);
    this.atlas=new LayerAtlas(this);this.science=new ScienceCatalogs(owner);this.exoplanets=new ExoplanetScene(owner);
    for(const item of COSMIC_OBJECTS.filter(x=>x.kind==='galaxy')) {
      const count=item.id==='milky-way'?1500000:item.id==='andromeda'?80000:18000;
      const {positions,colors}=galaxyPopulation(item,count);
      // The same point colours cover the whole disk; no Sun-centred bright patch.
      const node=cloud(positions,colors,item.id==='milky-way'?1.9:2.2,owner.dotTexture);
      node.material.blending=THREE.NormalBlending; // Bounded radiance: overlapping stars retain colour.
      node.scale.setScalar(LY_KM); owner.scene.add(node); this.nodes.push({node,item,layer:'galaxies'});
      // A sparse sample supplies resolved lights above the bounded diffuse disk.
      // It uses the same positions and colours, never a separate sky or catalogue.
      const resolvedPositions=[],resolvedColors=[];
      for(let i=0;i<positions.length;i+=48){resolvedPositions.push(...positions.subarray(i,i+3));resolvedColors.push(...colors.subarray(i,i+3));}
      const resolved=cloud(resolvedPositions,resolvedColors,1.25,owner.dotTexture);resolved.renderOrder=1;
      resolved.scale.setScalar(LY_KM);owner.scene.add(resolved);this.nodes.push({node:resolved,item,layer:'galaxies'});

      const hazePositions=[],hazeColors=[];
      for(let i=0;i<positions.length;i+=(item.id==='milky-way'?54:18)){hazePositions.push(...positions.subarray(i,i+3));hazeColors.push(...colors.subarray(i,i+3).map(v=>v*.55));}
      const haze=cloud(hazePositions,hazeColors,1,owner.dotTexture);
      haze.material.blending=THREE.NormalBlending;haze.renderOrder=-200;
      haze.material.onBeforeCompile=shader=>{
        shader.uniforms.galaxyUnit={value:LY_KM};
        shader.vertexShader=shader.vertexShader.replace('gl_PointSize = size;',`gl_PointSize=clamp(${(item.radiusLy*.022).toFixed(3)}*projectionMatrix[1][1]*600.0/max(.0001,length(mvPosition.xyz)/length(modelMatrix[0].xyz)),1.0,90.0);`);
        shader.fragmentShader=shader.fragmentShader.replace('#include <map_particle_fragment>',`vec2 q=gl_PointCoord*2.0-1.0;float r=dot(q,q);diffuseColor.a*=exp(-r*6.0)*(1.0-smoothstep(.65,1.0,r))*.028;`);
      };
      haze.scale.setScalar(LY_KM);owner.scene.add(haze);this.nodes.push({node:haze,item,layer:'galaxies',haze:true});
    }
    for(const item of [...COSMIC_OBJECTS,...BLACK_HOLES].filter(x=>x.kind!=='cmb')) {
      const marker=owner.makeCosmicMarker(item);
      this.nodes.push({node:marker,item,layer:['galaxy','black-hole'].includes(item.kind)?'galaxies':'structure',marker:true});
    }
  }
  selectStar(item) {
    this.selectedItem=item;
    if(!this.selectedMarker) {
      this.selectedMarker=this.owner.makeCosmicMarker(item);
      this.selectedLabel=this.owner.labels[this.owner.labels.length-1];
    }
    this.selectedMarker.userData.item=item;
    this.selectedMarker.material.color.set(item.color);
    this.selectedLabel.element.querySelector('strong').textContent=item.name;
    this.selectedLabel.element.querySelector('span').textContent=item.kind==='black-hole'?'AGUJERO NEGRO · EHT':item.kind==='star'?(item.modeled?'ESTRELLA MODELADA':'ESTRELLA HYG'):'GALAXIA CATALOGADA';
    this.selectedLabel.id=item.id;
  }
  updateStellarFilter() {
    const attribute=this.starPoints?.geometry.getAttribute('filterVisible');if(!attribute)return;
    for(const star of this.stars)attribute.setX(star.renderIndex,this.stellarTypes.has(stellarClass(star.spect))?1:0);
    attribute.needsUpdate=true;
    if(this.selectedItem?.id?.startsWith('hyg-')&&!this.stellarTypes.has(stellarClass(this.selectedItem.spect)))this.selectedItem=null;
  }
  async loadStars() {
    this.starState='loading';
    try {
      const response=await fetch(`${import.meta.env.BASE_URL}data/stars.json`);
      if(!response.ok)throw new Error('Catálogo HYG no disponible');
      const data=await response.json();
      if(!Array.isArray(data.stars)||data.stars.length<100)throw new Error('Catálogo HYG incompleto');
      const p=[],c=[],absoluteMagnitudes=[];
      this.stars=data.stars.map((row,renderIndex)=>{
        const [id,name,ra,dec,pc,mag,spect,ci,lum,hip,hd]=row;
        const position=equatorialPosition(ra,dec,pc*PC_KM);
        p.push(...position.map(v=>v/PC_KM));
        absoluteMagnitudes.push(mag-5*Math.log10(pc)+5);
        const color=new THREE.Color(ci===null?'#d4e5ff':ci<.0?'#91b4ff':ci<.5?'#dce8ff':ci<1?'#fff1d0':ci<1.5?'#ffc080':'#ff9165');
        c.push(color.r,color.g,color.b);
        return {renderIndex,id:`hyg-${id}`,name,aliases:`${hip?'HIP '+hip:''} ${hd?'HD '+hd:''}`,cosmic:true,kind:'star',position,referenceDistanceLy:pc*PC_KM/LY_KM,distanceLy:pc*PC_KM/LY_KM,mag,spect,lum,ci,color:'#'+color.getHexString(),viewDistanceKm:Math.max(3e8,.005*LY_KM),source:'HYG v4.1 · época J2000',sourceUrl:'https://github.com/astronexus/HYG-Database',summary:`Estrella del catálogo HYG (Hipparcos, Yale y Gliese). Tipo espectral ${spect||'sin clasificar'}. Distancia de catálogo: ${(pc*PC_KM/LY_KM).toLocaleString('es-ES',{maximumFractionDigits:2})} años luz. El punto es un localizador; no representa el diámetro de la estrella. Las distancias tienen incertidumbre y el movimiento lineal con el reloj es opcional.`};
      });
      this.starPoints=cloud(p,c,2.0,this.owner.dotTexture);this.starPoints.scale.setScalar(PC_KM);
      this.starPoints.geometry.setAttribute('filterVisible',new THREE.Float32BufferAttribute(new Float32Array(this.stars.length).fill(1),1));
      this.updateStellarFilter();
      this.starPoints.geometry.setAttribute('absoluteMagnitude',new THREE.Float32BufferAttribute(absoluteMagnitudes,1));
      this.starPoints.material.onBeforeCompile=shader=>{
        shader.uniforms.unitPc=this.unitPc;shader.uniforms.magnitudeLimit=this.magnitudeLimit;
        shader.vertexShader='attribute float filterVisible; attribute float absoluteMagnitude; uniform float unitPc; uniform float magnitudeLimit; varying float starVisibility;\n'+shader.vertexShader;
        shader.vertexShader=shader.vertexShader.replace('gl_PointSize = size;',`float pc = max(0.00001,length(mvPosition.xyz)*unitPc);
          float apparent = absoluteMagnitude + 5.0*log(pc)/log(10.0)-5.0;
          starVisibility = filterVisible*(1.0-smoothstep(magnitudeLimit-1.0,magnitudeLimit+0.5,apparent));
          gl_PointSize = clamp((magnitudeLimit-apparent)*0.65+1.0,1.0,6.0);`);
        shader.fragmentShader='varying float starVisibility;\n'+shader.fragmentShader;
        shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.a *= starVisibility; if (diffuseColor.a < 0.005) discard;');
      };
      this.owner.scene.add(this.starPoints);this.stars.sort((a,b)=>a.distanceLy-b.distanceLy);this.targets.push(...this.stars);this.starState='ready';
    } catch(error) {this.starState='error';console.error(error);}
    return this.stars.length;
  }
  update(origin,distance) {
    this.motion.update(origin,distance);
    this.science.update(origin,distance);this.exoplanets.update(origin);
    this.unitPc.value=this.owner.renderUnit/PC_KM;
    this.surveys.update(origin,distance);
    this.photos.update(origin,distance,this.layers);
    this.cmb.update(origin,distance,this.layers.cmb);
    this.sectors.update(origin,distance,this.layers.population&&this.layers.galaxies);this.sectors.pointGain.value=this.galaxyExposure;
    this.atlas.update(origin,distance);
    if(this.selectedMarker) {
      this.selectedMarker.position.fromArray(this.selectedMarker.userData.item.position).sub(origin);
      this.selectedMarker.visible=!(this.owner.focus?.item?.kind==='black-hole'&&distance<this.owner.focus.item.radiusKm*200)&&!!this.selectedItem && (!this.selectedItem.atlasLayer || this.atlas.enabled[this.selectedItem.atlasLayer]) && this.layers.labels && (this.selectedItem.modeled?this.layers.population&&this.layers.galaxies:this.layers[this.selectedItem.kind==='star'?'stars':'galaxies']);
    }
    if(this.starPoints) {
      this.starPoints.position.copy(origin).negate();
      this.starPoints.visible=this.layers.stars&&distance<12000*LY_KM;
      this.starPoints.material.opacity=.85*(1-THREE.MathUtils.smoothstep(distance/LY_KM,500,12000));
    }
    for(const entry of this.nodes) {
      const {node,item,layer,marker,haze}=entry;
      node.position.fromArray(item.position).sub(origin);
      const observer=this.owner.camera.position.clone().add(origin);
      const range=observer.distanceTo(new THREE.Vector3(...item.position));
      const region=item.radiusLy*LY_KM;
      node.visible=this.layers[layer] && (marker || item.id!=='milky-way' || this.layers.population) && (marker ? distance>region*.1 && distance<region*150 && this.layers.labels : range<region*100);
      if(marker&&item.kind==='black-hole'&&this.owner.focus?.item?.id===item.id&&distance<item.radiusKm*200)node.visible=false;
      if(!marker) {
        node.material.color?.setScalar(1);if(!haze)tunePoints(node.material,this.galaxyExposure);node.material.opacity=(.28+.72*THREE.MathUtils.smoothstep(range/region,.003,.20))*(1-THREE.MathUtils.smoothstep(range/region,12,100))*.8;
        if(item.id==='andromeda')node.material.opacity*=1-this.photos.photoOpacity;
        if(item.id==='milky-way'&&this.photos.sky.visible)node.material.opacity*=1-this.photos.sky.material.opacity;
      }

    }
  }
  pickPhysical(camera,direction,angle) {
    const hits=[];
    for(const items of [...['pulsars','clusters','clouds','remnants'].map(k=>this.science[k+'Points']?.visible?this.science[k].filter(x=>!x.noLocation):[]),this.science.memberPoints?.visible?this.science.members:[]]){const hit=closestPointOnRay(items,x=>x.position,camera,direction,angle);if(hit)hits.push(hit);}
    const atlasHit=this.atlas.pick(camera,direction,angle);if(atlasHit)hits.push(atlasHit);
    const modeled=this.sectors.pick(camera,direction,angle);if(modeled)hits.push(modeled);
    const galaxy=this.surveys.pick(camera,direction,angle);
    if(galaxy)hits.push(galaxy);
    if(this.starPoints?.visible) {
      const star=closestPointOnRay(this.stars,x=>x.position,camera,direction,angle,(star,distance)=>{
        const apparent=star.mag+5*Math.log10(Math.max(1e-12,distance/((star.referenceDistanceLy??star.distanceLy)*LY_KM)));
        return this.stellarTypes.has(stellarClass(star.spect)) && apparent < this.magnitudeLimit.value+.5;
      });
      if(star)hits.push(star);
    }
    return hits.sort((a,b)=>a.distance-b.distance)[0]||null;
  }
}
