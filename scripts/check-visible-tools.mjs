// Exercise production UI in Chrome/SwiftShader, without a browser test dependency.
import {spawn} from 'node:child_process';import fs from 'node:fs';
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const preview=spawn('npm',['run','preview','--','--host','127.0.0.1','--port','4173'],{stdio:'ignore'});
const chrome=spawn('google-chrome',['--headless=new','--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-angle=swiftshader','--remote-debugging-port=9222','--user-data-dir=/tmp/universal-browser-check','about:blank'],{stdio:'ignore'});
let ws;const pending=new Map();let serial=0;const timeout=setTimeout(()=>{console.error('Browser verification timed out');preview.kill();chrome.kill();process.exit(1);},110000);
try{
 let tabs;for(let i=0;i<80;i++){try{await fetch('http://127.0.0.1:4173/');tabs=await(await fetch('http://127.0.0.1:9222/json')).json();if(tabs.some(t=>t.type==='page'))break;}catch{}await pause(250);}
 if(!tabs)throw Error('Chrome or preview did not start');ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});ws.onmessage=e=>{const r=JSON.parse(e.data);if(r.method==='Runtime.exceptionThrown')console.error('Browser exception:',JSON.stringify(r.params));if(r.id){const p=pending.get(r.id);pending.delete(r.id);r.error?p.reject(Error(JSON.stringify(r.error))):p.resolve(r.result);}};
 const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 const until=async expression=>{for(let i=0;i<120;i++){if(await evaluate(expression))return;await pause(250);}throw Error('UI condition failed: '+expression);};
 await call('Page.enable');await call('Runtime.enable');await call('Emulation.setDeviceMetricsOverride',{width:1280,height:800,deviceScaleFactor:1,mobile:false});await call('Page.navigate',{url:'http://127.0.0.1:4173/'});
 await until("!!document.querySelector('#stellar-motion-button')");
 await evaluate("document.querySelector('#ruler-button').click();document.querySelector('[data-example]').click()");
 await until("!document.querySelector('.scene-ruler').hidden && document.querySelector('.scene-ruler line').hasAttribute('x1')");
 const ruler=await evaluate(`(()=>{const r=document.querySelector('.scene-ruler'),l=r.querySelector('line'),p=['x1','y1','x2','y2'].map(k=>Number(l.getAttribute(k))),b=r.getBoundingClientRect();return{points:p,width:b.width,height:b.height,svgDisplay:getComputedStyle(r.querySelector('svg')).display,text:r.querySelector('span').textContent};})()`);
 if(ruler.svgDisplay==='none'||Math.hypot(ruler.points[0]-ruler.points[2],ruler.points[1]-ruler.points[3])<50||ruler.points.some((x,i)=>x<0||x>(i%2?ruler.height:ruler.width)))throw Error('Ruler is not framed visibly: '+JSON.stringify(ruler));console.log('Visible Sol–Tierra ruler:',JSON.stringify(ruler));
 await evaluate("document.querySelector('.ruler-controls [data-clear]').click();document.querySelector('#stellar-motion-button').click();document.querySelector('[data-galactic-view]').click()");
 await until("!document.querySelector('.solar-motion-note').hidden && document.querySelector('.solar-motion-note').textContent.includes('circular aproximada')");console.log('Galactic orbit view:',await evaluate("document.querySelector('.solar-motion-note').textContent"));
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await pause(500);
 await evaluate("document.querySelector('.solar-motion-note [data-hide]').click();document.querySelector('#ruler-button').click();document.querySelector('[data-example]').click()");await pause(1000);
 const mobile=await evaluate("(()=>{const b=document.querySelector('#ruler-button').getBoundingClientRect(),r=document.querySelector('.ruler-controls').getBoundingClientRect();return{viewport:innerWidth,buttonRight:b.right,controlsLeft:r.left,controlsRight:r.right};})()");if(mobile.buttonRight>mobile.viewport||mobile.controlsLeft<0||mobile.controlsRight>mobile.viewport)throw Error('Mobile controls are clipped: '+JSON.stringify(mobile));console.log('Mobile ruler controls fit:',JSON.stringify(mobile));
 fs.mkdirSync('/tmp/universal-check',{recursive:true});const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync('/tmp/universal-check/ruler-mobile.png',Buffer.from(shot.data,'base64'));console.log('Browser visibility checks passed');
}finally{clearTimeout(timeout);ws?.close();preview.kill();chrome.kill();}
