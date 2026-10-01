import {milkyWayPopulation,sectorNeighborhood} from './milky-way-model.js';
self.onmessage=({data})=>{
 try{const result=data.type==='galaxy'?milkyWayPopulation(data.count):sectorNeighborhood(data.observer,data.budget);const buffers=Object.values(result).filter(x=>ArrayBuffer.isView(x)).map(x=>x.buffer);self.postMessage({type:data.type,key:data.key,...result},buffers);}
 catch(error){self.postMessage({type:data.type,key:data.key,error:error.message});}
};
