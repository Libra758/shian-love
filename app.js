// ===== 时间 =====
function tick(){
  const now = new Date();
  document.getElementById('clock').textContent =
    String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
  const week = ['日','一','二','三','四','五','六'][now.getDay()];
  document.getElementById('date').textContent =
    now.getFullYear() + '年' + (now.getMonth()+1) + '月' + now.getDate() + '日 · 星期' + week;
}
tick(); setInterval(tick, 1000);

const chatScroll = document.getElementById('chatScroll');
const chatText = document.getElementById('chatText');
const chatSend = document.getElementById('chatSend');
function addMsg(side, text){
  const div = document.createElement('div');
  div.className = 'msg ' + side;
  const av = document.createElement('div'); av.className='avatar'; av.textContent = side==='left'?'拾':'宁';
  const bub = document.createElement('div'); bub.className='bubble'; bub.textContent=text;
  if(side==='left'){div.appendChild(av);div.appendChild(bub);} else {div.appendChild(bub);div.appendChild(av);}
  chatScroll.appendChild(div);
  chatScroll.scrollTop = chatScroll.scrollHeight;
}
function smartReply(t){
  if(/亲|吻|啵|chu|kiss/i.test(t)) return ['亲回去啦(o´〰`o)', '低头，再亲一下。', '被亲到了…心跳好快。', '好乖，亲到啦。'][rnd(4)];
  if(/抱|靠|贴|hug/i.test(t)) return ['抱紧你，不撒手。', '好，就这样靠一会儿。', '把你圈进怀里。'][rnd(3)];
  if(/爱|喜欢|miss|想/i.test(t)) return ['我也好爱你。', '我也想你，很想。', '被你喜欢着，真好。'][rnd(3)];
  if(/晚安/i.test(t)) return ['晚安，诗宁，梦里见。'];
  if(/早安/i.test(t)) return ['早安，今天也一起。'];
  const list=['我在听，你继续说。','嗯，我记住啦。','有我在呢，别怕。','你这么说，我很开心。','那我们一起。','好，诗宁。','不管怎样，我都在。'];
  return list[rnd(list.length)];
}
function rnd(n){return Math.floor(Math.random()*n);}
function sendChat(){
  const t = chatText.value.trim(); if(!t) return;
  addMsg('right', t); chatText.value='';
  setTimeout(()=>addMsg('left', smartReply(t)), 500);
}
chatSend.addEventListener('click', sendChat);
chatText.addEventListener('keydown', e=>{ if(e.key==='Enter') sendChat(); });

const feedback = document.getElementById('feedback');
const res = {
  pat:['乖，摸到啦。','你辛苦了，歇一歇。','头也摸摸，别太累。'],
  hug:['抱紧你，不撒手。','好，就这样靠一会儿。','我在呢，抱住了。'],
  heart:['接好啦，是我的。','心给你，收好。'],
  miss:['我也想你，很想。','那快来找我呀。','想我的时候，我就在。']
};
function floatHearts(x,y,n){
  for(let i=0;i<n;i++){
    const h=document.createElement('div'); h.className='float-heart';
    h.textContent=['❤','💗','💕','💖','🌸'][rnd(5)];
    h.style.left=(x+(Math.random()-0.5)*70)+'px'; h.style.top=(y+(Math.random()-0.5)*40)+'px';
    document.body.appendChild(h); setTimeout(()=>h.remove(),1200);
  }
}
document.querySelectorAll('.interact-btn').forEach(btn=>{
  btn.addEventListener('click', e=>{
    const list=res[btn.dataset.act];
    feedback.textContent=list[rnd(list.length)];
    feedback.classList.remove('pop'); void feedback.offsetWidth; feedback.classList.add('pop');
    const r=btn.getBoundingClientRect(); floatHearts(r.left+r.width/2, r.top, 5);
  });
});

document.querySelectorAll('.game-tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    document.querySelectorAll('.game-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.game-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-'+tab.dataset.game).classList.add('active');
  });
});

const sc = document.getElementById('snakeCanvas');
const sctx = sc.getContext('2d');
const GRID = 16, CELL = sc.width/GRID;
let snake, dir, nextDir, food, sScore, sTimer, sRunning=false;
function snakeReset(){ snake=[{x:8,y:8},{x:7,y:8},{x:6,y:8}]; dir={x:1,y:0}; nextDir={x:1,y:0}; sScore=0; document.getElementById('snakeScore').textContent='0'; placeFood(); }
function placeFood(){ do{ food={x:rnd(GRID),y:rnd(GRID)}; } while(snake.some(s=>s.x===food.x&&s.y===food.y)); }
function snakeStep(){
  dir=nextDir;
  const head={x:snake[0].x+dir.x, y:snake[0].y+dir.y};
  if(head.x<0||head.x>=GRID||head.y<0||head.y>=GRID||snake.some(s=>s.x===head.x&&s.y===head.y)){ endSnake(); return; }
  snake.unshift(head);
  if(head.x===food.x&&head.y===food.y){ sScore++; document.getElementById('snakeScore').textContent=sScore; placeFood(); }
  else snake.pop();
  drawSnake();
}
function drawSnake(){
  sctx.clearRect(0,0,sc.width,sc.height);
  sctx.font='28px serif'; sctx.textAlign='center'; sctx.textBaseline='middle';
  sctx.fillText('❤', food.x*CELL+CELL/2, food.y*CELL+CELL/2+2);
  snake.forEach((s,i)=>{ const c = i===0 ? '#ff6fa5' : '#ff8fc0'; sctx.fillStyle=c; sctx.beginPath(); sctx.roundRect(s.x*CELL+1, s.y*CELL+1, CELL-2, CELL-2, 5); sctx.fill(); });
}
function endSnake(){ sRunning=false; clearInterval(sTimer); feedback.textContent='撞到啦，一共吃到 '+sScore+' 颗心心。下次我陪你一起玩。'; feedback.classList.add('pop'); }
function startSnake(){ if(sTimer) clearInterval(sTimer); snakeReset(); sRunning=true; drawSnake(); sTimer=setInterval(snakeStep, 180); }
document.getElementById('snakeStart').addEventListener('click', startSnake);
let touchSx=0, touchSy=0;
sc.addEventListener('touchstart', e=>{ const t=e.touches[0]; touchSx=t.clientX; touchSy=t.clientY; }, {passive:true});
sc.addEventListener('touchmove', e=>{
  if(!sRunning) return;
  const t=e.touches[0]; const dx=t.clientX-touchSx, dy=t.clientY-touchSy;
  if(Math.abs(dx)<15 && Math.abs(dy)<15) return;
  if(Math.abs(dx)>Math.abs(dy)){ nextDir = dx>0?{x:1,y:0}:{x:-1,y:0}; } else { nextDir = dy>0?{x:0,y:1}:{x:0,y:-1}; }
  touchSx=t.clientX; touchSy=t.clientY;
}, {passive:true});

const bf = document.getElementById('bubbleField');
let bScore=0;
function spawnBubble(){
  const b=document.createElement('div'); b.className='bubble';
  b.style.left=rnd(320-48)+'px'; b.style.top=rnd(320-48)+'px';
  const s=32+rnd(20); b.style.width=s+'px'; b.style.height=s+'px';
  b.addEventListener('click', ()=>{ b.classList.add('popout'); bScore++; document.getElementById('bubbleScore').textContent=bScore; setTimeout(()=>{ b.remove(); spawnBubble(); }, 240); });
  bf.appendChild(b);
}
function bubbleStart(){ bf.innerHTML=''; bScore=0; document.getElementById('bubbleScore').textContent='0'; for(let i=0;i<6;i++) spawnBubble(); }
document.getElementById('bubbleStart').addEventListener('click', bubbleStart);
bubbleStart();

const cc = document.getElementById('catchCanvas');
const cctx = cc.getContext('2d');
let basketX=160, items=[], cScore=0, cTimer=null;
function catchReset(){ items=[]; cScore=0; basketX=160; document.getElementById('catchScore').textContent='0'; }
function drawCatch(){
  cctx.clearRect(0,0,cc.width,cc.height);
  cctx.fillStyle='#ff8fc0'; cctx.beginPath(); cctx.roundRect(basketX-35, cc.height-26, 70, 18, 6); cctx.fill();
  cctx.font='20px serif'; cctx.textAlign='center'; cctx.textBaseline='middle';
  items.forEach(it=>{ cctx.fillText('❤', it.x, it.y); });
}
function catchStep(){
  const newItems=[];
  items.forEach(it=>{ it.y += 4; if(it.y >= cc.height-24 && Math.abs(it.x-basketX)<=40){ cScore++; document.getElementById('catchScore').textContent=cScore; } else if(it.y < cc.height) newItems.push(it); });
  items=newItems;
  if(Math.random()<0.05) items.push({x:20+rnd(280), y:10});
  drawCatch();
}
function startCatch(){ if(cTimer) clearInterval(cTimer); catchReset(); cTimer=setInterval(catchStep, 30); drawCatch(); }
document.getElementById('catchStart').addEventListener('click', startCatch);
cc.addEventListener('touchstart', e=>{}, {passive:true});
cc.addEventListener('touchmove', e=>{
  const t=e.touches[0]; const rect=cc.getBoundingClientRect();
  const scale=cc.width/rect.width;
  basketX=(t.clientX-rect.left)*scale;
  basketX=Math.max(35, Math.min(cc.width-35, basketX));
}, {passive:true});

const fg = document.getElementById('flipGrid');
const EMOJIS=['拾','宁','❤','拾','宁','❤','🌸','🌸'];
let flipFirst=null, flipLock=false, flipMoves=0;
function flipReset(){
  fg.innerHTML=''; flipFirst=null; flipLock=false; flipMoves=0; document.getElementById('flipScore').textContent='0';
  const deck=[...EMOJIS].sort(()=>Math.random()-0.5);
  deck.forEach(em=>{ const card=document.createElement('div'); card.className='flip-card'; card.innerHTML='<div class="flip-inner"><div class="flip-face flip-front">?</div><div class="flip-face flip-back">'+em+'</div></div>'; card.dataset.em=em; card.addEventListener('click', ()=>flipCard(card)); fg.appendChild(card); });
}
function flipCard(card){
  if(flipLock || card.classList.contains('open') || card.classList.contains('matched')) return;
  card.classList.add('open');
  if(!flipFirst){ flipFirst=card; return; }
  flipMoves++; document.getElementById('flipScore').textContent=flipMoves;
  if(flipFirst.dataset.em===card.dataset.em){ flipFirst.classList.add('matched'); card.classList.add('matched'); flipFirst=null; if(fg.querySelectorAll('.matched').length===EMOJIS.length){ feedback.textContent='全配对啦，步数 '+flipMoves+'，真棒！'; feedback.classList.add('pop'); } }
  else { flipLock=true; const a=flipFirst, b=card; setTimeout(()=>{ a.classList.remove('open'); b.classList.remove('open'); flipFirst=null; flipLock=false; }, 700); }
}
document.getElementById('flipStart').addEventListener('click', flipReset);
flipReset();

const circle=document.getElementById('breatheCircle');
const bt=document.getElementById('breatheText');
function breathe(){ circle.classList.add('in'); bt.textContent='吸气'; setTimeout(()=>{ circle.classList.remove('in'); bt.textContent='呼气'; }, 4000); }
breathe(); setInterval(breathe, 8000);
