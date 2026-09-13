import {COSMIC_OBJECTS,galacticPosition} from './cosmic-data.js';
// Circular guide through the Sun, centered on the catalogue's Galactic center.
// Y points in the direction of Galactic rotation (Bovy, Galactic coordinates).
export function solarOrbitGuide(segments=256){
 const center=COSMIC_OBJECTS.find(x=>x.id==='milky-way').position,radius=Math.hypot(...center),radial=center.map(x=>-x/radius),y=galacticPosition(0,1,0),dot=y.reduce((s,x,i)=>s+x*radial[i],0),t=y.map((x,i)=>x-dot*radial[i]),n=Math.hypot(...t),tangent=t.map(x=>x/n);
 const points=Array.from({length:segments+1},(_,i)=>{const angle=i===segments?0:i/segments*Math.PI*2;return center.map((x,j)=>x+radius*(radial[j]*Math.cos(angle)+tangent[j]*Math.sin(angle)));});return{center,radius,radial,tangent,points};
}
