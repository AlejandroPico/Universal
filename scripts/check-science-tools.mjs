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


 for(const [name,key] of [['Ío','io'],['Europa','europa'],['Ganímedes','ganymede'],['Calisto','callisto'],['Encélado','enceladus'],['Titán','titan'],['Atlas','atlas'],['Calipso','calypso'],['Dafnis','daphnis'],['Epimeteo','epimetheus'],['Helena','helene'],['Hiperión','hyperion'],['Jano','janus'],['Pan','pan'],['Pandora','pandora'],['Prometeo','prometheus'],['Telesto','telesto'],['Halley','halley'],['Amaltea','amalthea'],['Tebe','thebe'],['Larisa','larissa'],['Proteo','proteus'],['Ida','ida'],['Matilde','mathilde'],['Gaspra','gaspra'],['Hartley 2','hartley-2'],['Haumea','haumea'],['Cariclo','chariklo'],['Quaoar','quaoar']]){
  await evaluate(`document.querySelector('#catalog-button').click();document.querySelector('#catalog-search').value=${JSON.stringify(name)};document.querySelector('#catalog-search').dispatchEvent(new Event('input',{bubbles:true}));`);
  await until("!!document.querySelector('#search-results button') && !document.querySelector('#search-results').hidden");
  await evaluate(`const buttons=[...document.querySelectorAll('#search-results button')];const b=buttons.find(b=>b.querySelector('strong').textContent.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase()===${JSON.stringify(name.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase())})||buttons.find(b=>b.querySelector('strong').textContent.toLowerCase().includes(${JSON.stringify(name.toLowerCase())}));if(!b)throw Error('Target absent: '+${JSON.stringify(name)});b.click();document.querySelector('#control-panel-close').click();`);
  await until(`document.querySelector('#body-appearance').dataset.model===${JSON.stringify(key)} && document.querySelector('#body-appearance').dataset.state==='ready'`);
  if(['haumea','chariklo','quaoar'].includes(key)&&await evaluate("document.querySelector('#ring-contrast-label').hidden"))throw Error('Missing minor-body rings: '+key);
  if(['hyperion','halley','chariklo'].includes(key)){await evaluate("document.querySelector('#detail-close').click()");await pause(500);const shot=await call('Page.captureScreenshot');fs.mkdirSync('artifacts',{recursive:true});fs.writeFileSync('artifacts/science-'+key+'.png',Buffer.from(shot.data,'base64'));}else await evaluate("document.querySelector('#detail-close').click()");
  console.log('Scientific geometry loaded:',key);
 }
 for(const [name,modes] of [['Marte',['mars-elevation','mars-gravity','mars-bouguer','mars-crust','mars']],['Tierra',['earth-relief','earth-night-science','earth']],['Luna',['moon-altimetry','moon']],['Sol',['sun-304','sun']]]){
  await evaluate(`document.querySelector('#catalog-button').click();document.querySelector('#catalog-search').value=${JSON.stringify(name)};document.querySelector('#catalog-search').dispatchEvent(new Event('input',{bubbles:true}));`);
  await until("!!document.querySelector('#search-results button') && !document.querySelector('#search-results').hidden");await evaluate("document.querySelector('#search-results button').click();document.querySelector('#control-panel-close').click()");
  for(const mode of modes){await evaluate(`document.querySelector('#venus-appearance').value=${JSON.stringify(mode)};document.querySelector('#venus-appearance').dispatchEvent(new Event('change',{bubbles:true}));`);await until(`document.querySelector('#body-appearance').dataset.model===${JSON.stringify(mode)} && document.querySelector('#body-appearance').dataset.state==='ready'`);console.log('Scientific appearance:',mode);}
  if(name==='Sol')for(const id of ['sun-uv','sun-radio','sun-infrared','sun-visible','sun-xray','sun-gamma']){await evaluate(`const s=document.querySelector('#scientific-observations select');s.value=${JSON.stringify(id)};s.dispatchEvent(new Event('change'));document.querySelector('#scientific-observations').scrollIntoView();`);await until("document.querySelector('#scientific-observations img').complete && document.querySelector('#scientific-observations img').naturalWidth>0");console.log('Solar observation decoded:',id);}
  await evaluate("document.querySelector('#detail-close').click()");
 }
 // Restore Venus details through the catalog and switch the actual UI control.
 await evaluate("document.querySelector('#catalog-button').click();document.querySelector('#catalog-search').value='Venus';document.querySelector('#catalog-search').dispatchEvent(new Event('input',{bubbles:true}));");
 await until("!!document.querySelector('#search-results button') && !document.querySelector('#search-results').hidden");
 await evaluate("document.querySelector('#search-results button').click();document.querySelector('#control-panel-close').click();document.querySelector('#venus-appearance').value='venus-surface';document.querySelector('#venus-appearance').dispatchEvent(new Event('change',{bubbles:true}));");
 await until("document.querySelector('#body-appearance').dataset.model==='venus-surface' && !document.querySelector('#venus-appearance').disabled");
 if(!(await evaluate("document.querySelector('#body-appearance-note').textContent.includes('radar')")))throw Error('Radar view must be identified');
 await evaluate("document.querySelector('#detail-close').click()");await pause(300);
 
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 // Returning to the already loaded cloud model must not retain both surfaces.
 await evaluate("document.querySelector('#venus-appearance').value='venus-clouds';document.querySelector('#venus-appearance').dispatchEvent(new Event('change',{bubbles:true}));");
 await until("!document.querySelector('#venus-appearance').disabled");
 // The new scientific map uses the same themed selector on mobile.
 await evaluate("document.querySelector('#catalog-button').click();document.querySelector('#catalog-search').value='Mercurio';document.querySelector('#catalog-search').dispatchEvent(new Event('input',{bubbles:true}));");
 await until("!!document.querySelector('#search-results button') && !document.querySelector('#search-results').hidden");
 await evaluate("document.querySelector('#search-results button').click();document.querySelector('#control-panel-close').click();document.querySelector('#venus-appearance').value='mercury-enhanced';document.querySelector('#venus-appearance').dispatchEvent(new Event('change',{bubbles:true}));");
 await until("document.querySelector('#body-appearance').dataset.model==='mercury-enhanced' && document.querySelector('#body-appearance').dataset.state==='ready'");
 await evaluate("document.querySelector('#detail-close').click()");
 
 await call('Emulation.setDeviceMetricsOverride',{width:1280,height:800,deviceScaleFactor:1,mobile:false});
 for(const name of ['Sirius','Betelgeuse']){
  await evaluate(`document.querySelector('#catalog-button').click();document.querySelector('#catalog-search').value=${JSON.stringify(name)};document.querySelector('#catalog-search').dispatchEvent(new Event('input',{bubbles:true}));`);
  await until("!!document.querySelector('#search-results button') && !document.querySelector('#search-results').hidden");
  await evaluate("document.querySelector('#search-results button').click();document.querySelector('#control-panel-close').click();document.querySelector('#stellar-inspect').click();document.querySelector('#detail-close').click()");
  await pause(700);
 }
 await evaluate("document.querySelector('#catalog-button').click();document.querySelector('#catalog-search').value='M87*';document.querySelector('#catalog-search').dispatchEvent(new Event('input',{bubbles:true}));");
 await until("!!document.querySelector('#search-results button') && !document.querySelector('#search-results').hidden");
 await evaluate("document.querySelector('#search-results button').click();document.querySelector('#control-panel-close').click();document.querySelector('#detail-close').click()");
 await until("!!document.querySelector('.black-hole-live-note') && !document.querySelector('.black-hole-live-note').hidden");
 
 for(const [query,text] of [['Pioneer 10','2003'],['Pioneer 11','1995'],['gcat-D00738','2017']]){
  await evaluate(`document.querySelector('#catalog-button').click();document.querySelector('#catalog-search').value=${JSON.stringify(query)};document.querySelector('#catalog-search').dispatchEvent(new Event('input',{bubbles:true}));`);
  await until("!!document.querySelector('#search-results button') && !document.querySelector('#search-results').hidden");
  await evaluate("document.querySelector('#search-results button').click();document.querySelector('#control-panel-close').click()");
  if(!(await evaluate(`document.querySelector('#detail-summary').textContent.includes(${JSON.stringify(text)})`)))throw Error('Missing historical status: '+query);
  if(query==='gcat-D00738'){
   if(await evaluate("document.querySelector('#history-event').hidden"))throw Error('Cassini final event not linked');
   await evaluate("document.querySelector('#history-event').click()");
  }
  await evaluate("document.querySelector('#detail-close').click()");
 }
 console.log('Historical Pioneer records and Cassini event verified');
 console.log('Solar body model and Venus view checks passed');
}finally{clearTimeout(timeout);ws?.close();preview.kill();if(process.platform==='win32')spawn('taskkill',['/pid',String(chrome.pid),'/t','/f'],{stdio:'ignore',windowsHide:true});else chrome.kill();}
