export function setupInstallation(){
 if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register(new URL('sw.js',document.baseURI),{scope:'./'}).catch(e=>console.warn('Instalación: service worker no disponible',e)));
 const button=document.createElement('button');button.type='button';button.textContent='Instalar Universal';button.hidden=true;document.querySelector('#exploration-tools').before(button);let prompt;
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();prompt=event;button.hidden=false;});
 button.onclick=async()=>{if(!prompt)return;await prompt.prompt();await prompt.userChoice;prompt=null;button.hidden=true;};window.addEventListener('appinstalled',()=>{prompt=null;button.hidden=true;});
}
