
/*! app.tictactoe.js — fullscreen Tic-Tac-Toe with PvP / Vs AI (no HTML edits) */
(function(){
  if(!window.x1coOS || !x1coOS.core) return console.warn("x1coOS.core.js não carregado");
  if(window.x1coOS.tictactoe) return;
  const core = x1coOS.core;

  function renderTTT(root){
    const css = document.createElement('style');
    css.textContent = `
      .ttt-wrap{display:flex;flex-direction:column;height:100%;color:#fff}
      .ttt-header{display:flex;gap:8px;align-items:center;padding:10px;background:rgba(0,0,0,.35);border-bottom:1px solid rgba(255,255,255,.16)}
      .ttt-header button{height:40px;border-radius:12px;padding:0 14px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font-weight:800}
      .ttt-header .status{margin-left:auto;font-weight:800}
      .ttt-board{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:14px;flex:1}
      .ttt-cell{display:flex;align-items:center;justify-content:center;aspect-ratio:1/1;border-radius:16px;
        font-size:48px;font-weight:900;cursor:pointer;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);user-select:none}
      .ttt-cell.win{background:rgba(76,175,80,.3)}
      @media (max-width:600px){ .ttt-cell{font-size:40px} }
    `;
    root.appendChild(css);

    const wrap = document.createElement('div'); wrap.className="ttt-wrap";
    wrap.innerHTML = `
      <div class="ttt-header">
        <button data-mode="pvp">2 Jogadores</button>
        <button data-mode="cpu">Vs AI</button>
        <button data-act="reset">Reiniciar</button>
        <div class="status">Vez: X</div>
      </div>
      <div class="ttt-board">
        ${Array.from({length:9},(_,i)=>`<div class="ttt-cell" data-i="${i}"></div>`).join('')}
      </div>
    `;
    root.appendChild(wrap);

    const status = wrap.querySelector('.status');
    const cells = Array.from(wrap.querySelectorAll('.ttt-cell'));
    let board = Array(9).fill(null), turn='X', gameOver=false, mode='pvp';

    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    const setStatus = (t)=> status.textContent = t;

    function checkWinner(){
      for(const [a,b,c] of wins){
        if(board[a] && board[a]===board[b] && board[a]===board[c]){
          [a,b,c].forEach(i=>cells[i].classList.add('win'));
          gameOver = true; setStatus('Vencedor: '+board[a]); return board[a];
        }
      }
      if(board.every(Boolean)){ gameOver = true; setStatus('Empate'); return 'draw'; }
      return null;
    }
    function play(i){
      if(gameOver || board[i]) return;
      board[i]=turn; cells[i].textContent=turn;
      const w=checkWinner(); if(w) return;
      turn = (turn==='X'?'O':'X'); setStatus('Vez: '+turn);
      if(mode==='cpu' && turn==='O') setTimeout(cpuMove,130);
    }
    function cpuMove(){
      const me='O', you='X';
      // ganhar
      for(const [a,b,c] of wins){
        const line=[a,b,c],vals=line.map(i=>board[i]);
        if(vals.filter(v=>v===me).length===2 && vals.includes(null)) return play(line[vals.indexOf(null)]);
      }
      // bloquear
      for(const [a,b,c] of wins){
        const line=[a,b,c],vals=line.map(i=>board[i]);
        if(vals.filter(v=>v===you).length===2 && vals.includes(null)) return play(line[vals.indexOf(null)]);
      }
      if(!board[4]) return play(4);
      for(const i of [0,2,6,8]) if(!board[i]) return play(i);
      for(const i of [1,3,5,7]) if(!board[i]) return play(i);
    }
    function reset(){
      board = Array(9).fill(null); turn='X'; gameOver=false;
      cells.forEach(c=>{c.textContent=''; c.classList.remove('win');}); setStatus('Vez: X');
    }

    cells.forEach(c=> c.addEventListener('click', ()=>play(+c.dataset.i)));
    wrap.querySelector('[data-act="reset"]').addEventListener('click', reset);
    wrap.querySelector('[data-mode="pvp"]').addEventListener('click', ()=>{ mode='pvp'; });
    wrap.querySelector('[data-mode="cpu"]').addEventListener('click', ()=>{ mode='cpu'; });

    return ()=>{ root.innerHTML=""; };
  }

  function open(){
    core.mountApp(renderTTT);
  }

  function init(){
    core.addTile({ id:"tictactoe", label:"Jogo da Velha", emoji:"#️⃣", onOpen: open });
    core.openAppHook("tictactoe", open);
  }

  if(document.readyState === "loading"){ document.addEventListener("DOMContentLoaded", init); }
  else { init(); }

  window.x1coOS.tictactoe = { open };
})();
