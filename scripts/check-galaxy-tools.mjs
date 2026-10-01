// Exercise production UI in Chrome/SwiftShader, without a browser test dependency.
import {spawn} from 'node:child_process';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';const profile=fs.mkdtempSync(path.join(os.tmpdir(),'universal-science-'));
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const preview=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4179'],{stdio:'ignore',windowsHide:true});
const chrome=spawn(process.env.UNIVERSAL_CHROME||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':'google-chrome'),['--headless=new','--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-angle=swiftshader','--remote-debugging-port=9239','--user-data-dir='+profile,'about:blank'],{stdio:'ignore',windowsHide:true});
let ws;const pending=new Map();let serial=0;const timeout=setTimeout(()=>{console.error('Browser verification timed out');preview.kill();chrome.kill();process.exit(1);},420000);
try{
 let tabs;for(let i=0;i<80;i++){try{await fetch('http://127.0.0.1:4179/');tabs=await(await fetch('http://127.0.0.1:9239/json')).json();if(tabs.some(t=>t.type==='page'))break;}catch{}await pause(250);}
 if(!tabs)throw Error('Chrome or preview did not start');ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});ws.onmessage=e=>{const r=JSON.parse(e.data);if(r.method==='Runtime.consoleAPICalled'&&r.params.type==='error')console.error('Browser console:',r.params.args.map(x=>x.value||x.description).join(' '));if(r.method==='Runtime.exceptionThrown')console.error('Browser exception:',JSON.stringify(r.params));if(r.id){const p=pending.get(r.id);pending.delete(r.id);r.error?p.reject(Error(JSON.stringify(r.error))):p.resolve(r.result);}};
 const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression:'(async()=>eval('+JSON.stringify(expression)+'))()',returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 const until=async expression=>{for(let i=0;i<120;i++){if(await evaluate(expression))return;await pause(250);}console.error('Current UI:',await evaluate("({title:document.title,galactic:document.querySelector('#galactic-exploration')?.dataset,body:document.querySelector('#detail-name')?.textContent})"));throw Error('UI condition failed: '+expression);};
 await call('Page.enable');await call('Runtime.enable');await call('Network.enable');await call('Network.setCacheDisabled',{cacheDisabled:true});await call('Network.setBypassServiceWorker',{bypass:true});await call('Emulation.setDeviceMetricsOverride',{width:1280,height:800,deviceScaleFactor:1,mobile:false});await call('Page.navigate',{url:'http://127.0.0.1:4179/'});
 await until("!!document.querySelector('#stellar-motion-button')");



 const openGalaxy=async()=>{await evaluate("document.querySelector('#catalog-button').click();document.querySelector('#catalog-search').value='Vía Láctea';document.querySelector('#catalog-search').dispatchEvent(new Event('input',{bubbles:true}));");await until("!!document.querySelector('#search-results button') && !document.querySelector('#search-results').hidden");await evaluate("document.querySelector('#search-results button').click();document.querySelector('#control-panel-close').click();document.querySelector('#galactic-exploration').scrollIntoView();");};
 await until("document.querySelector('#galactic-exploration').dataset.populationState==='ready'");
 console.log('Galactic background generated in worker');
 fs.mkdirSync('artifacts',{recursive:true});
 for(const view of ['disk','edge','inner','outer']){
  const previousKey=await evaluate("document.querySelector('#galactic-exploration').dataset.sectorKey");
  await openGalaxy();await evaluate(`document.querySelector('[data-galactic-view="${view}"]').click();`);
  if(['inner','outer'].includes(view)){await until(`document.querySelector('#galactic-exploration').dataset.sectorState==='ready' && document.querySelector('#galactic-exploration').dataset.sectorKey!==${JSON.stringify(previousKey)} && Number(document.querySelector('#galactic-exploration').dataset.sectorCount)>0`);const counts=await evaluate("({...document.querySelector('#galactic-exploration').dataset})");if(Number(counts.sectorCount)>90000)throw Error('Sector budget exceeded');console.log('Exploration '+view,counts);}
  await pause(3500);const shot=await call('Page.captureScreenshot');fs.writeFileSync('artifacts/milky-way-'+view+'.png',Buffer.from(shot.data,'base64'));
 }
 await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Shift',code:'ShiftLeft'});await call('Input.dispatchKeyEvent',{type:'keyDown',key:'w',code:'KeyW'});await pause(1800);await call('Input.dispatchKeyEvent',{type:'keyUp',key:'w',code:'KeyW'});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Shift',code:'ShiftLeft'});await until("document.querySelector('#galactic-exploration').dataset.sectorState==='ready'");
 await evaluate("document.querySelector('#layers-button').click();document.querySelector('#population-toggle').checked=false;document.querySelector('#population-toggle').dispatchEvent(new Event('change',{bubbles:true}));document.querySelector('#control-panel-close').click();");
 await until("document.querySelector('#galactic-exploration').dataset.sectorVisible==='false'");console.log('Population toggle and free flight exercised');
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await until("window.innerWidth===390");await openGalaxy();
 await evaluate("Promise.all(document.querySelector('#detail-panel').getAnimations().map(animation=>animation.finished.catch(()=>{})))");
 const boxes=await evaluate("[...document.querySelectorAll('[data-galactic-view]')].map(b=>({x:b.getBoundingClientRect().x,width:b.getBoundingClientRect().width}))");if(boxes.some(b=>b.x<0||b.x+b.width>391))throw Error('Mobile exploration controls overflow: '+JSON.stringify(boxes));console.log('Mobile galactic controls fit');
 console.log('Milky Way production-browser checks passed');
}finally{clearTimeout(timeout);ws?.close();preview.kill();if(process.platform==='win32')spawn('taskkill',['/pid',String(chrome.pid),'/t','/f'],{stdio:'ignore',windowsHide:true});else chrome.kill();}
