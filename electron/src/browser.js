/* ThriveOS Browser — renderer */
'use strict';

const api = window.thriveAPI;

let activeTabId  = null;
let activePinned = 'home';
let tabs         = [];
let tabIdCounter = 1;

const $back      = document.getElementById('btn-back');
const $forward   = document.getElementById('btn-forward');
const $reload    = document.getElementById('btn-reload');
const $iReload   = document.getElementById('icon-reload');
const $iStop     = document.getElementById('icon-stop');
const $newTab    = document.getElementById('btn-new-tab');
const $addr      = document.getElementById('address-input');
const $regTabs   = document.getElementById('regular-tabs');
const $toast     = document.getElementById('toast');
const $ntPage    = document.getElementById('newtab-page');
const $ntSearch  = document.getElementById('newtab-search-input');
const $pinHome   = document.getElementById('tab-home');
const $pinBizbox = document.getElementById('tab-bizbox');
const $pinLifebud= document.getElementById('tab-lifebud');

// Toast
let _tt;
function toast(msg) { $toast.textContent=msg; $toast.classList.add('show'); clearTimeout(_tt); _tt=setTimeout(()=>$toast.classList.remove('show'),2200); }

// URL normalise
function toUrl(raw) {
  const s=raw.trim(); if(!s)return null;
  if(/^[a-z][a-z0-9+\-.]*:\/\//i.test(s))return s;
  if(/^localhost/.test(s))return 'http://'+s;
  if(/^[\w.-]+\.\w{2,}(\/|$)/.test(s)&&!s.includes(' '))return 'https://'+s;
  return 'https://www.google.com/search?q='+encodeURIComponent(s);
}
function setAddr(url){ $addr.value=(!url||url.startsWith('file://'))? '' : url; }

// Pinned sections
function setPinned(section) {
  activePinned=section; activeTabId=null;
  [$pinHome,$pinBizbox,$pinLifebud].forEach(b=>b.classList.remove('active'));
  ({home:$pinHome,bizbox:$pinBizbox,lifebud:$pinLifebud})[section].classList.add('active');
  document.querySelectorAll('#regular-tabs .tab').forEach(el=>el.classList.remove('active'));
  $ntPage.classList.add('hidden');
  setAddr('');
  $back.disabled=$forward.disabled=true;
  api.navigatePinned(section);
}

// Tab rendering
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function globeSVG(){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`; }
function spinSVG(){ return `<svg class="spinning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-9-9"/></svg>`; }

function renderTabs() {
  $regTabs.innerHTML='';
  tabs.forEach(tab=>{
    const el=document.createElement('button');
    el.className='tab'+(tab.id===activeTabId?' active':'');
    const iconHtml=tab.favicon
      ? `<img src="${esc(tab.favicon)}" onerror="this.outerHTML='${globeSVG()}'"/>`
      : tab.loading ? spinSVG() : globeSVG();
    el.innerHTML=`<span class="tab-icon">${iconHtml}</span><span class="tab-label">${esc(tab.title||'New Tab')}</span><button class="tab-x">×</button>`;
    el.querySelector('.tab-x').addEventListener('click',e=>{ e.stopPropagation(); closeTab(tab.id); });
    el.addEventListener('click',()=>activateTab(tab.id));
    $regTabs.appendChild(el);
  });
}

function activateTab(id) {
  activeTabId=id; activePinned=null;
  [$pinHome,$pinBizbox,$pinLifebud].forEach(b=>b.classList.remove('active'));
  renderTabs();
  const tab=tabs.find(t=>t.id===id); if(!tab)return;
  $ntPage.classList.add('hidden'); setAddr(tab.url); api.switchTab(id);
}

function openTab(url) {
  const id=tabIdCounter++;
  tabs.push({id,url:url||'',title:'New Tab',loading:!!url,favicon:null});
  activeTabId=id; activePinned=null;
  [$pinHome,$pinBizbox,$pinLifebud].forEach(b=>b.classList.remove('active'));
  if(!url){ renderTabs(); $ntPage.classList.remove('hidden'); if($ntSearch){$ntSearch.value='';$ntSearch.focus();} }
  else { $ntPage.classList.add('hidden'); api.newTab(id,url); renderTabs(); }
}

function closeTab(id) {
  const idx=tabs.findIndex(t=>t.id===id); if(idx===-1)return;
  api.closeTab(id); tabs.splice(idx,1);
  if(activeTabId===id){ tabs.length ? activateTab(tabs[Math.max(0,idx-1)].id) : setPinned('home'); }
  renderTabs();
}

// Events
$addr.addEventListener('keydown',e=>{
  if(e.key!=='Enter')return;
  const url=toUrl($addr.value); if(!url)return;
  if(activeTabId!==null){
    const tab=tabs.find(t=>t.id===activeTabId);
    if(tab){tab.url=url;tab.loading=true;tab.favicon=null;renderTabs();}
    api.navigate(url); $ntPage.classList.add('hidden');
  } else openTab(url);
});
$addr.addEventListener('focus',()=>$addr.select());

$ntSearch && $ntSearch.addEventListener('keydown',e=>{
  if(e.key!=='Enter')return;
  const url=toUrl($ntSearch.value); if(!url)return;
  $ntSearch.value=''; $ntPage.classList.add('hidden');
  if(activeTabId!==null){
    const tab=tabs.find(t=>t.id===activeTabId);
    if(tab){tab.url=url;tab.loading=true;tab.favicon=null;renderTabs();}
    api.navigate(url);
  } else openTab(url);
});

$back.addEventListener('click',()=>api.goBack());
$forward.addEventListener('click',()=>api.goForward());
$reload.addEventListener('click',()=>{ $iStop.classList.contains('hidden') ? api.reload() : api.stop(); });
$newTab.addEventListener('click',()=>openTab(null));

document.querySelectorAll('.nt-tile').forEach(tile=>{
  tile.addEventListener('click',()=>{
    const t=tile.dataset.url;
    if(['home','bizbox','lifebud'].includes(t)){ $ntPage.classList.add('hidden'); if(activeTabId!==null)closeTab(activeTabId); setPinned(t); }
    else { const url=toUrl(t); $ntPage.classList.add('hidden'); if(activeTabId!==null){const tab=tabs.find(x=>x.id===activeTabId);if(tab){tab.url=url;tab.loading=true;tab.favicon=null;renderTabs();}api.navigate(url);}else openTab(url); }
  });
});

$pinHome.addEventListener('click',()=>setPinned('home'));
$pinBizbox.addEventListener('click',()=>setPinned('bizbox'));
$pinLifebud.addEventListener('click',()=>setPinned('lifebud'));

// IPC from main
api.on('tab-title',({tabId,title})=>{ const t=tabs.find(x=>x.id===tabId);if(t){t.title=title;renderTabs();} });
api.on('tab-url',({tabId,url})=>{ const t=tabs.find(x=>x.id===tabId);if(t){t.url=url;if(t.id===activeTabId)setAddr(url);} });
api.on('tab-favicon',({tabId,favicon})=>{ const t=tabs.find(x=>x.id===tabId);if(t){t.favicon=favicon;renderTabs();} });
api.on('tab-loading',({tabId,loading})=>{
  if(tabId===null){ $iReload.classList.toggle('hidden',loading);$iStop.classList.toggle('hidden',!loading);return; }
  const t=tabs.find(x=>x.id===tabId);if(!t)return;
  t.loading=loading;renderTabs();
  if(t.id===activeTabId){$iReload.classList.toggle('hidden',loading);$iStop.classList.toggle('hidden',!loading);}
});
api.on('nav-state',({canGoBack,canGoForward})=>{ $back.disabled=!canGoBack;$forward.disabled=!canGoForward; });
api.on('toast',msg=>toast(msg));
api.on('open-tab',({url})=>openTab(url||null));

// Shortcuts
document.addEventListener('keydown',e=>{
  const mod=e.metaKey||e.ctrlKey; if(!mod)return;
  if(e.key==='t'){e.preventDefault();openTab(null);}
  if(e.key==='w'){e.preventDefault();if(activeTabId!==null)closeTab(activeTabId);}
  if(e.key==='l'){e.preventDefault();$addr.focus();}
  if(e.key==='r'){e.preventDefault();api.reload();}
  if(e.key==='1'){e.preventDefault();setPinned('home');}
  if(e.key==='2'){e.preventDefault();setPinned('bizbox');}
  if(e.key==='3'){e.preventDefault();setPinned('lifebud');}
});

setPinned('home');
