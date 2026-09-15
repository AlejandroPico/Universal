// Exercise production UI in Chrome/SwiftShader, without a browser test dependency.
import {spawn} from 'node:child_process';import fs from 'node:fs';
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const preview=spawn('npm',['run','preview','--','--host','127.0.0.1','--port','4173'],{stdio:'ignore'});
const chrome=spawn('google-chrome',['--headless=new','--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-angle=swiftshader','--remote-debugging-port=9222','--user-data-dir=/tmp/universal-solar-check','about:blank'],{stdio:'ignore'});
let ws;const pending=new Map();let serial=0;const timeout=setTimeout(()=>{console.error('Browser verification timed out');preview.kill();chrome.kill();process.exit(1);},300000);
try{
 let tabs;for(let i=0;i<80;i++){try{await fetch('http://127.0.0.1:4173/');tabs=await(await fetch('http://127.0.0.1:9222/json')).json();if(tabs.some(t=>t.type==='page'))break;}catch{}await pause(250);}
 if(!tabs)throw Error('Chrome or preview did not start');ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});ws.onmessage=e=>{const r=JSON.parse(e.data);if(r.method==='Runtime.exceptionThrown')console.error('Browser exception:',JSON.stringify(r.params));if(r.id){const p=pending.get(r.id);pending.delete(r.id);r.error?p.reject(Error(JSON.stringify(r.error))):p.resolve(r.result);}};
 const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 const until=async expression=>{for(let i=0;i<120;i++){if(await evaluate(expression))return;await pause(250);}throw Error('UI condition failed: '+expression);};
 await call('Page.enable');await call('Runtime.enable');await call('Emulation.setDeviceMetricsOverride',{width:1280,height:800,deviceScaleFactor:1,mobile:false});await call('Page.navigate',{url:'http://127.0.0.1:4173/'});
 await until("!!document.querySelector('#stellar-motion-button')");

 for(const [name,key] of [['Mercurio','mercury'],['Fobos','phobos'],['Deimos','deimos'],['Venus','venus-clouds'],['Júpiter','jupiter'],['Saturno','saturn'],['Urano','uranus'],['Neptuno','neptune'],['Plutón','pluto'],['Caronte','charon'],['Vesta','vesta'],['Mimas','mimas']]){
  await evaluate(`document.querySelector('#catalog-button').click();document.querySelector('#catalog-search').value=${JSON.stringify(name)};document.querySelector('#catalog-search').dispatchEvent(new Event('input',{bubbles:true}));`);
  await until("!!document.querySelector('#search-results button') && !document.querySelector('#search-results').hidden");
  await evaluate("document.querySelector('#search-results button').click();document.querySelector('#control-panel-close').click()");
  await until(`document.querySelector('#body-appearance').dataset.model===${JSON.stringify(key)} && document.querySelector('#body-appearance').dataset.state==='ready'`);
  const note=await evaluate("document.querySelector('#body-appearance-note').textContent");
  if(!note.includes('NASA'))throw Error('Missing model provenance');
  await evaluate("document.querySelector('#detail-close').click()");await pause(300);
  console.log('SOLAR_'+key+'='+(await call('Page.captureScreenshot',{format:'jpeg',quality:40})).data);
  console.log('Original NASA model loaded in scene:',key);
 }
 // Restore Venus details through the catalog and switch the actual UI control.
 await evaluate("document.querySelector('#catalog-button').click();document.querySelector('#catalog-search').value='Venus';document.querySelector('#catalog-search').dispatchEvent(new Event('input',{bubbles:true}));");
 await until("!!document.querySelector('#search-results button') && !document.querySelector('#search-results').hidden");
 await evaluate("document.querySelector('#search-results button').click();document.querySelector('#control-panel-close').click();document.querySelector('#venus-appearance').value='venus-surface';document.querySelector('#venus-appearance').dispatchEvent(new Event('change',{bubbles:true}));");
 await until("document.querySelector('#body-appearance').dataset.model==='venus-surface' && !document.querySelector('#venus-appearance').disabled");
 if(!(await evaluate("document.querySelector('#body-appearance-note').textContent.includes('radar')")))throw Error('Radar view must be identified');
 await evaluate("document.querySelector('#detail-close').click()");await pause(300);
 console.log('SOLAR_venus-surface='+(await call('Page.captureScreenshot',{format:'jpeg',quality:40})).data);
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 // Returning to the already loaded cloud model must not retain both surfaces.
 await evaluate("document.querySelector('#venus-appearance').value='venus-clouds';document.querySelector('#venus-appearance').dispatchEvent(new Event('change',{bubbles:true}));");
 await until("!document.querySelector('#venus-appearance').disabled");
 console.log('Solar body model and Venus view checks passed');
}finally{clearTimeout(timeout);ws?.close();preview.kill();chrome.kill();}
