
/*! x1coOS.core.js — core helpers for adding apps without touching HTML
   Usage:
   <script src="x1coOS.core.js"></script>
   <script src="app.tictactoe.js"></script>
*/
(function(){
  if(window.x1coOS?.core) return; // avoid double load

  const core = {
    getGrid(){
      return document.getElementById('iconGrid')
          || document.querySelector('.grid, .app-grid')
          || document.getElementById('desktop')
          || document.body;
    },
    addTile({id, label, emoji, onOpen}){
      const grid = core.getGrid();
      if(!grid || grid.querySelector(`.appIcon[data-app="${id}"]`)) return;
      const tile = document.createElement('div');
      tile.className = 'appIcon';
      tile.dataset.app = id;
      tile.innerHTML = `<div class="icon" aria-hidden="true" style="font-size:36px">${emoji||"⚙️"}</div><div class="label">${label||id}</div>`;
      tile.addEventListener('click', ()=> onOpen && onOpen());
      grid.appendChild(tile);
    },
    ensureOverlay(id="x1coOS-overlay"){
      let node = document.getElementById(id);
      if(node) return node;
      node = document.createElement('div');
      node.id = id;
      node.style.cssText = [
        "position:fixed","left:0","right:0",
        "top:calc(var(--topbar-height, 48px))","bottom:0",
        "zIndex:99999","display:none",
        "background:rgba(0,0,0,.45)",
        "backdrop-filter:blur(4px) saturate(1)",
        "-webkit-backdrop-filter:blur(4px) saturate(1)"
      ].join(";");
      const hdr = document.createElement('div');
      hdr.style.cssText = "position:absolute;top:6px;right:8px;display:flex;gap:8px;z-index:2";
      const btnHome = document.createElement('button'); btnHome.textContent = "Home";
      const btnClose = document.createElement('button'); btnClose.textContent = "Fechar";
      [btnHome, btnClose].forEach(b=>{
        b.style.cssText="height:36px;padding:0 12px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.35);color:#fff;font-weight:800";
      });
      hdr.appendChild(btnHome); hdr.appendChild(btnClose);
      node.appendChild(hdr);
      const body = document.createElement('div');
      body.id = id + "-body";
      body.style.cssText = "position:absolute;inset:48px 8px 8px 8px;border:1px solid rgba(255,255,255,.12);border-radius:12px;overflow:hidden;background:rgba(0,0,0,.25)";
      node.appendChild(body);
      document.body.appendChild(node);
      btnHome.addEventListener('click', ()=> core.hideOverlay(id));
      btnClose.addEventListener('click', ()=> core.hideOverlay(id, true));
      return node;
    },
    showOverlay(id="x1coOS-overlay"){ const n = core.ensureOverlay(id); n.style.display = "block"; },
    hideOverlay(id="x1coOS-overlay", reset=false){
      const n = document.getElementById(id);
      if(!n) return;
      if(reset){
        const body = document.getElementById(id+"-body");
        if(body) body.innerHTML = "";
      }
      n.style.display = "none";
    },
    mountApp(appRenderFn, id="x1coOS-overlay"){
      core.showOverlay(id);
      const body = document.getElementById(id+"-body");
      if(!body) return;
      body.innerHTML = "";
      appRenderFn(body);
    },
    openAppHook(name, fn){
      const old = window.openApp;
      window.openApp = function(n){
        if(n === name){ fn(); return; }
        return (old ? old.apply(this, arguments) : null);
      };
    }
  };

  window.x1coOS = window.x1coOS || {};
  window.x1coOS.core = core;
})();
