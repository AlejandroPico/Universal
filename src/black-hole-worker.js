import {renderBlackHole} from './black-hole-raytrace.js';
self.onmessage=({data})=>{try{const pixels=renderBlackHole(data);self.postMessage({id:data.id,width:data.width,height:data.height,pixels},[pixels.buffer]);}catch(error){self.postMessage({id:data.id,error:error.message});}};
