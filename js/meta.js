/* =====================================================================
   META: dźwięk, słabe punkty, nagroda za nieobecność, zadania dzienne,
   seria dni, cele, samouczek, ustawienia, mapy i trudność.
   Ładowane po ui.js; opakowuje funkcje UI zamiast je przepisywać.
   ===================================================================== */

/* ---------- dźwięk (WebAudio, bez plików) ---------- */
const Snd=(()=>{
  let ctx=null,last={};
  const on=()=>S.sfx!==false;
  function ac(){
    if(!ctx){try{ctx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){return null;}}
    if(ctx.state==='suspended')ctx.resume();
    return ctx;
  }
  function tone(f,t0,dur,type,vol,f2){
    const c=ac();if(!c)return;
    const o=c.createOscillator(),g=c.createGain();
    o.type=type||'sine';o.frequency.setValueAtTime(f,c.currentTime+t0);
    if(f2)o.frequency.exponentialRampToValueAtTime(f2,c.currentTime+t0+dur);
    g.gain.setValueAtTime(0.0001,c.currentTime+t0);
    g.gain.exponentialRampToValueAtTime(vol,c.currentTime+t0+.01);
    g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+t0+dur);
    o.connect(g);g.connect(c.destination);o.start(c.currentTime+t0);o.stop(c.currentTime+t0+dur+.05);
  }
  function noise(dur,vol,fc){
    const c=ac();if(!c)return;
    const n=Math.floor(c.sampleRate*dur),b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);
    for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);
    const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();
    s.buffer=b;f.type='lowpass';f.frequency.value=fc||1800;g.gain.value=vol;
    s.connect(f);f.connect(g);g.connect(c.destination);s.start();
  }
  const FX={
    hit(){noise(.07,.16,1500);tone(150,0,.08,'triangle',.1,70);},
    crit(){noise(.1,.2,3200);tone(520,0,.12,'sawtooth',.09,880);tone(260,0,.12,'triangle',.1,120);},
    weak(){noise(.14,.22,4200);tone(700,0,.18,'sawtooth',.1,1400);tone(350,.02,.2,'triangle',.12,150);},
    skill(){noise(.25,.2,900);tone(220,0,.3,'sawtooth',.12,60);},
    kill(){tone(660,0,.09,'square',.05);tone(880,.07,.12,'square',.05);},
    level(){[523,659,784,1047].forEach((f,i)=>tone(f,i*.09,.25,'triangle',.12));},
    rare(){[392,523,659,784,1047,1319].forEach((f,i)=>tone(f,i*.08,.32,'triangle',.13));tone(196,0,.9,'sine',.12);},
    perfect(){[880,1175,1568,2093].forEach((f,i)=>tone(f,i*.06,.3,'sine',.1));},
    ok(){tone(600,0,.1,'sine',.08);tone(800,.08,.12,'sine',.08);},
    claim(){[523,659,784].forEach((f,i)=>tone(f,i*.07,.2,'triangle',.11));},
    tap(){tone(420,0,.05,'sine',.05);},
    boss(){tone(110,0,.6,'sawtooth',.14,55);tone(165,.05,.5,'square',.06,80);}
  };
  return {
    play(n){
      if(!on()||!FX[n])return;
      const t=performance.now(),gap=(n==='hit'?70:n==='crit'?90:0);
      if(gap&&last[n]&&t-last[n]<gap)return;
      last[n]=t;try{FX[n]();}catch(e){}
    },
    unlock(){ac();}
  };
})();
document.addEventListener('pointerdown',()=>Snd.unlock(),{once:true,passive:true});

/* ---------- pomocnicze ---------- */
const Meta={};
const todayKey=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const yesterdayKey=()=>{const d=new Date(Date.now()-864e5);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
function matChips(rew){
  return Object.keys(rew).map(k=>(k==='szardy'?COIN.replace('<svg','<svg class="mi"'):matIcon(k,'mi'))+'<span>×'+fmt(rew[k])+'</span>').join('');
}
function giveRew(rew){for(const k in rew){if(k==='szardy')S.szardy+=rew[k];else addMat(k,rew[k]);}}

/* ---------- vib z wyłącznikiem ---------- */
const _vib=window.vib;
window.vib=function(p){if(S.vibOn===false)return;try{return _vib(p);}catch(e){}};

/* ---------- mapa / trudność ---------- */
Meta.refreshMap=function(){
  const m=curMap();
  const n=$('mapname');if(n){n.textContent=m.name;if(n.nextElementSibling)n.nextElementSibling.textContent='Mapa '+(S.map||1)+(S.dif?' · '+CFG.diff[S.dif].n:'');}
  $('scene').dataset.map=S.map||1;
  $('scene').dataset.dif=S.dif||0;
};
Meta.goMap=function(n){
  if(n===2&&!S.unlock2){hook('toast','Pokonaj Wiedźmę Wrzosowisk, aby odblokować Mapę 2.');return;}
  if((S.map||1)===n)return;
  S.map=n;S.dif=Math.min(S.dif||0,S.difMax[n]||0);S.actSel='hunt';
  U.lastKey='';E=null;spawnMob();save();
  Meta.refreshMap();fullRender();
  hook('toast','Teleportacja: '+curMap().name);Snd.play('ok');
};
Meta.setDif=function(i){
  if(i>(S.difMax[S.map]||0)){hook('toast','Pokonaj ostatniego bossa na poprzednim poziomie trudności.');return;}
  if(S.dif===i)return;
  S.dif=i;U.lastKey='';E=null;spawnMob();save();Meta.refreshMap();fullRender();
  hook('toast','Poziom trudności: '+CFG.diff[i].n);Snd.play('ok');
};
UI.mapUnlock=function(){
  banner('Mapa 2 odblokowana','Mglista Dolina · limit poziomu 16');Snd.play('rare');vib([20,40,20,40,60]);
  hook('toast','Odblokowano Mapę 2: Mglista Dolina! Otwórz zakładkę Mapa.');
};

/* ---------- słabe punkty (złote cele na wrogu) ---------- */
let weakEl=null,weakNext=0;
function killWeak(){if(weakEl){weakEl.remove();weakEl=null;}}
function spawnWeak(){
  if(!E||weakEl||U.sheet)return;
  if(Date.now()<(E.spawnAt||0)+300)return;
  const en=$('enemy').getBoundingClientRect(),w=$('world').getBoundingClientRect();
  if(en.width<20)return;
  const x=en.left-w.left+en.width*(.28+Math.random()*.44),y=en.top-w.top+en.height*(.18+Math.random()*.5);
  const el=document.createElement('button');el.className='weak';el.setAttribute('aria-label','Słaby punkt');
  el.style.left=x+'px';el.style.top=y+'px';
  el.addEventListener('pointerdown',ev=>{
    ev.stopPropagation();ev.preventDefault();
    if(el.dataset.hit)return;el.dataset.hit='1';
    lastClick=performance.now();autoAcc=0;
    const burst=3;for(let i=0;i<burst;i++)sparks(true,true);
    shake(7);vib([12,30,18]);Snd.play('weak');
    el.classList.add('boom');
    const d=clickDmg()*CFG.weakMul*vsMul();
    dealDamage(d,{crit:true,kind:'click',weak:true});
    Meta.prog('weak');
    setTimeout(()=>{if(weakEl===el)weakEl=null;el.remove();},260);
  });
  $('world').appendChild(el);weakEl=el;
  setTimeout(()=>{if(weakEl===el&&!el.dataset.hit){el.classList.add('fade');setTimeout(()=>{if(weakEl===el)weakEl=null;el.remove();},220);}},CFG.weakLife*1000);
}
function scheduleWeak(){const r=CFG.weakEvery;weakNext=Date.now()+(r[0]+Math.random()*(r[1]-r[0]))*1000;}
setInterval(()=>{
  if(document.hidden||!E)return;
  if(!weakNext)scheduleWeak();
  if(Date.now()>=weakNext){spawnWeak();scheduleWeak();}
},300);

/* ---------- zadania dzienne i seria ---------- */
Meta.daily=function(){
  const t=todayKey();
  if(!S.daily||S.daily.day!==t){
    const pool=QPOOL.slice().sort(()=>Math.random()-.5).slice(0,3);
    S.daily={day:t,q:pool.map(q=>{
      const hard=S.level>=6?1:0,g=q.goal[Math.min(hard,q.goal.length-1)];
      return {id:q.id,goal:g,p:0,claimed:false};
    })};
    if(S.streak.last!==t){
      S.streak.n=S.streak.last===yesterdayKey()?S.streak.n+1:1;
      S.streak.last=t;S.streak.claimed=false;
    }
    save();
  }
};
Meta.qDef=id=>QPOOL.find(q=>q.id===id);
Meta.qRew=q=>Object.assign({szardy:120*Math.max(1,S.level)},Meta.qDef(q.id).rew);
Meta.prog=function(type,n){
  if(!S.daily)return;
  S.daily.q.forEach(q=>{
    if(q.id!==type||q.p>=q.goal)return;
    q.p=Math.min(q.goal,q.p+(n||1));
    if(q.p>=q.goal){hook('toast','Zadanie wykonane: '+Meta.qDef(q.id).t+'! Odbierz w Mieście.');Snd.play('ok');U.dirty=true;renderNav();}
  });
  U.questDirty=true;
};
Meta.claimQ=function(i){
  const q=S.daily.q[i];if(!q||q.claimed||q.p<q.goal)return;
  q.claimed=true;giveRew(Meta.qRew(q));save();Snd.play('claim');vib([10,30,10]);
  hook('toast','Odebrano nagrodę za zadanie.');renderHud();renderNav();renderContent();
};
Meta.claimStreak=function(){
  if(S.streak.claimed)return;
  const r=STREAK[(S.streak.n-1)%STREAK.length];
  S.streak.claimed=true;giveRew(r);save();Snd.play('rare');vib([15,40,15,40]);
  hook('toast','Nagroda za serię: dzień '+S.streak.n+'!');renderHud();renderNav();renderContent();
};
Meta.claimable=function(){
  return !S.streak.claimed||(S.daily&&S.daily.q.some(q=>!q.claimed&&q.p>=q.goal));
};
window.panelQuests=function(){
  Meta.daily();
  const n=S.streak.n||1,cyc=(n-1)%STREAK.length;
  let h='<div class="sec"><h3>Seria dni <small>dzień '+n+'</small></h3><div class="card streak">';
  h+='<div class="sdays">'+STREAK.map((r,i)=>'<div class="sd '+(i<cyc||(i===cyc&&S.streak.claimed)?'done':i===cyc?'now':'')+'"><b>'+(i+1)+'</b></div>').join('')+'</div>';
  const r=STREAK[cyc];
  h+='<div class="srow"><div class="chipsrow">'+matChips(r)+'</div>'+(S.streak.claimed?'<span class="pill ok">odebrano</span>':'<button class="btn" data-act="claimstreak">Odbierz</button>')+'</div>';
  h+='<p class="hint" style="margin:8px 0 0">Wracaj codziennie. Każdy dzień z rzędu to lepsza nagroda, dzień 7 daje Perłę.</p></div></div>';
  h+='<div class="sec"><h3>Zadania na dziś <small>odnowią się o północy</small></h3>';
  S.daily.q.forEach((q,i)=>{
    const d=Meta.qDef(q.id),pct=Math.min(100,q.p/q.goal*100),done=q.p>=q.goal;
    h+='<div class="card qcard '+(q.claimed?'cl':done?'rd':'')+'"><div class="qtop"><b>'+esc(d.t)+'</b><span class="num">'+q.p+' / '+q.goal+'</span></div><div class="bar qb"><i style="width:'+pct+'%"></i></div><div class="srow"><div class="chipsrow">'+matChips(Meta.qRew(q))+'</div>'+(q.claimed?'<span class="pill ok">odebrano</span>':'<button class="btn" data-act="claimq" data-i="'+i+'" '+(done?'':'disabled')+'>Odbierz</button>')+'</div></div>';
  });
  return h+'</div>';
};
setInterval(()=>{if(S.daily&&S.daily.day!==todayKey()){Meta.daily();U.dirty=true;renderNav();}},30000);

/* ---------- cele na ekranie Walka ---------- */
window.goalsHtml=function(){
  Meta.daily();
  const rows=[],now=Date.now(),m=curMap(),cur=E?E.type:'mob';
  // 1. poziom
  if(S.level<levelCap()){const need=xpNeed(S.level);rows.push({ic:'⬆',t:'Poziom '+(S.level+1),p:S.xp/need,r:Math.floor(S.xp/need*100)+'%',a:''});}
  else rows.push({ic:'⬆',t:S.unlock2?'Limit poziomu mapy':'Limit poziomu: pokonaj Wiedźmę',p:1,r:'MAX',a:S.unlock2?'':'data-act="chip" data-id="boss"'});
  // 2. gotowe aktywności
  if(cur!=='mono'&&now>=S.monoReady)rows.push({ic:'◆',t:'Monolit gotowy: rozbij go',p:1,r:'Start',a:'data-act="mono"',hot:1});
  else if(cur!=='boss'){
    const rb=m.bosses.find(b=>now>=(S.bossReady[b.id]||0)&&S.level>=b.lvRec-1);
    if(rb)rows.push({ic:'☠',t:'Boss gotowy: '+rb.n,p:1,r:'Wybierz',a:'data-act="chip" data-id="boss"',hot:1});
  }
  // 3. mini-boss
  rows.push({ic:'⚔',t:'Mini-boss za '+(CFG.minibossEvery-(S.kills%CFG.minibossEvery))+' potworów',p:(S.kills%CFG.minibossEvery)/CFG.minibossEvery,r:(S.kills%CFG.minibossEvery)+'/'+CFG.minibossEvery,a:''});
  // 4. zadanie
  const cl=S.daily.q.findIndex(q=>!q.claimed&&q.p>=q.goal);
  if(cl>=0||!S.streak.claimed)rows.push({ic:'🎁',t:'Nagroda czeka na odbiór',p:1,r:'Odbierz',a:'data-act="nav" data-id="miasto" data-sub="quests"',hot:1});
  else{
    const open=S.daily.q.filter(q=>!q.claimed).sort((a,b)=>b.p/b.goal-a.p/a.goal)[0];
    if(open)rows.push({ic:'✦',t:Meta.qDef(open.id).t,p:open.p/open.goal,r:open.p+'/'+open.goal,a:'data-act="nav" data-id="miasto" data-sub="quests"'});
  }
  return '<div class="sec"><div class="card goals">'+rows.slice(0,4).map(r=>'<button class="gr2 '+(r.hot?'hot':'')+'" '+(r.a||'disabled')+'><span class="gi">'+r.ic+'</span><span class="gt"><b>'+esc(r.t)+'</b><span class="bar gb"><i style="width:'+Math.min(100,r.p*100)+'%"></i></span></span><span class="gv num">'+r.r+'</span></button>').join('')+'</div></div>';
};

/* ---------- nagroda za nieobecność ---------- */
Meta.offline=function(){
  const last=S.last||0;if(!last)return null;
  let el=(Date.now()-last)/1000;
  if(el<CFG.offlineMinS)return null;
  const capped=Math.min(el,CFG.offlineMaxH*3600);
  const dps=autoDmg()*vsMul()/Math.max(.2,autoInterval());
  if(dps<=0)return null;
  let hp=0,xp=0,sz=0;const N=24;
  for(let i=0;i<N;i++){const d=mobForLevel();hp+=d.hp;xp+=d.xp;sz+=d.sz;}
  hp/=N;xp/=N;sz/=N;
  const dm=diffMul(),s=calcStats();
  hp*=dm.hp;
  const per=hp/dps+CFG.spawnDelay;
  const kills=Math.floor(capped*CFG.offlineEff/per);
  if(kills<1)return null;
  const gSz=Math.floor(kills*sz*(1+s.A.chciwosc/100)*dm.rw),gXp=kills*xp*(1+s.A.madrosc/100)*dm.rw;
  const luck=(1+s.szczescie/100)*dm.luck,mats={};
  for(const k in CFG.mobDrops){const x=kills*CFG.mobDrops[k]*luck,n=Math.floor(x)+(Math.random()<x%1?1:0);if(n>0){mats[k]=n;addMat(k,n);}}
  S.szardy+=gSz;S.kills+=kills;
  const lv0=S.level;gainXp(gXp);
  S.last=Date.now();save();
  return {secs:el,capped:capped<el,kills,sz:gSz,mats,lv:S.level-lv0};
};
function fmtDur(s){const h=Math.floor(s/3600),m=Math.floor((s%3600)/60);return h?h+' godz. '+m+' min':Math.max(1,m)+' min';}

/* ---------- okna (sheet) ---------- */
Meta.sheets={
  offline(){
    const o=U.offlineData;
    let h='<div class="sh2"><div class="nm" style="font-size:20px">Witaj z powrotem!</div><p class="muted" style="margin:4px 0 12px">Nie było Cię '+fmtDur(o.secs)+'. Twoja postać biła potwory'+(o.capped?' (do limitu '+CFG.offlineMaxH+' godz.)':'')+'.</p>';
    h+='<div class="card"><div class="stat"><span>Pokonanych potworów</span><b class="num">'+fmt(o.kills)+'</b></div><div class="stat"><span>Szardy</span><b class="num">+'+fmt(o.sz)+' '+COIN.replace('<svg','<svg class="mi"')+'</b></div>'+(o.lv?'<div class="stat"><span>Awans</span><b class="num">+'+o.lv+' poz.</b></div>':'')+(Object.keys(o.mats).length?'<div class="stat"><span>Materiały</span><div class="chipsrow">'+matChips(o.mats)+'</div></div>':'')+'</div>';
    h+='<p class="hint">Postać bije z '+Math.round(CFG.offlineEff*100)+'% siły podczas Twojej nieobecności.</p><div class="btns" style="margin-top:10px"><button class="btn big" data-act="closesheet">Odbierz i graj</button></div></div>';
    return h;
  },
  tut(){
    const st=[
      ['Stukaj w scenę','Każde stuknięcie to cios. Gdy przestaniesz, postać sama bije dalej. Wróć po czasie, a zbierzesz nagrodę za nieobecność.'],
      ['Złote punkty','Na wrogu co kilka sekund pojawia się złoty punkt. Stuknij go, zanim zniknie, a zadasz potężny cios krytyczny.'],
      ['Dolny pasek','Walka: potwory, Monolit, bossy. Postać: ekwipunek i umiejętności. Plecak: materiały. Miasto: sklep, kowal, zadania dzienne. Mapa: teleport i poziom trudności.']
    ];
    const i=Math.min(U.tutStep||0,2),t=st[i];
    return '<div class="sh2"><div class="tutd">'+st.map((_,k)=>'<i class="'+(k===i?'on':'')+'"></i>').join('')+'</div><div class="nm" style="font-size:20px;margin-top:8px">'+t[0]+'</div><p style="margin:8px 0 14px;line-height:1.5">'+t[1]+'</p><div class="btns"><button class="btn big" data-act="tutnext">'+(i<2?'Dalej':'Zaczynamy')+'</button></div></div>';
  },
  settings(){
    const code=(()=>{try{return btoa(unescape(encodeURIComponent(JSON.stringify(S))));}catch(e){return '';}})();
    return '<button class="x btn ghost" data-act="closesheet">✕</button><div class="nm" style="margin-bottom:10px">Ustawienia</div>'+
    '<div class="card"><button class="setrow" data-act="tsfx"><span>Dźwięk</span><b class="'+(S.sfx!==false?'on':'')+'">'+(S.sfx!==false?'WŁ.':'WYŁ.')+'</b></button><button class="setrow" data-act="tvib"><span>Wibracje</span><b class="'+(S.vibOn!==false?'on':'')+'">'+(S.vibOn!==false?'WŁ.':'WYŁ.')+'</b></button></div>'+
    '<div class="sec"><h3>Kod zapisu</h3><div class="card"><p class="hint" style="margin:0 0 6px">Skopiuj kod i zachowaj go. Wklejony na innym urządzeniu przywróci postęp.</p><textarea id="savecode" class="ta" readonly rows="3">'+code+'</textarea><div class="btns" style="margin-top:8px"><button class="btn" data-act="copysave">Kopiuj kod</button></div>'+
    '<textarea id="loadcode" class="ta" rows="2" placeholder="Wklej kod, aby wczytać zapis" style="margin-top:10px"></textarea><div class="btns" style="margin-top:8px"><button class="btn ghost" data-act="loadsave">Wczytaj zapis</button></div></div></div>'+
    '<div class="btns two" style="margin-top:10px"><button class="btn ghost" data-act="opendev">Narzędzia testowe</button><button class="btn ghost" data-act="replaytut">Pokaż samouczek</button></div>';
  }
};
Meta.open=function(name){U.sheet=name;renderSheet();$('veil').classList.add('on');};

/* ---------- akcje ---------- */
const _onClick=window.onClick;
document.body.addEventListener('click',function(e){
  const b=e.target.closest&&e.target.closest('[data-act]');if(!b)return;
  const a=b.dataset.act,id=b.dataset.id;
  switch(a){
    case 'gomap':Meta.goMap(+id);break;
    case 'dif':Meta.setDif(+id);break;
    case 'claimq':Meta.claimQ(+b.dataset.i);break;
    case 'claimstreak':Meta.claimStreak();break;
    case 'tutnext':if((U.tutStep||0)<2){U.tutStep=(U.tutStep||0)+1;renderSheet();Snd.play('tap');}else{S.tut=1;save();closeSheet();}break;
    case 'replaytut':U.tutStep=0;Meta.open('tut');break;
    case 'tsfx':S.sfx=S.sfx===false;save();renderSheet();if(S.sfx)Snd.play('ok');break;
    case 'tvib':S.vibOn=S.vibOn===false;save();renderSheet();vib(15);break;
    case 'opendev':closeSheet();{const d=$('dev');d.classList.add('on');d.innerHTML=devHtml();}break;
    case 'copysave':{const t=$('savecode');t.select();try{navigator.clipboard.writeText(t.value).then(()=>hook('toast','Skopiowano kod zapisu.'),()=>{document.execCommand('copy');hook('toast','Skopiowano.');});}catch(_){try{document.execCommand('copy');hook('toast','Skopiowano.');}catch(__){}}break;}
    case 'loadsave':{
      const v=($('loadcode').value||'').trim();if(!v)break;
      try{const o=JSON.parse(decodeURIComponent(escape(atob(v))));if(!o||typeof o.level!=='number'||!o.items)throw 0;
        localStorage.setItem(LSKEY,JSON.stringify(o));location.reload();
      }catch(_){hook('toast','Nieprawidłowy kod zapisu.');}
      break;}
    case 'resetgame':break;
  }
  if(a==='nav'&&b.dataset.sub){U.sub[id]=b.dataset.sub;renderTabs();renderContent();}
},true);

/* ---------- opakowania UI ---------- */
const _renderSheet=window.renderSheet;
window.renderSheet=function(){
  if(typeof U.sheet==='string'&&Meta.sheets[U.sheet]){$('sheet').innerHTML=Meta.sheets[U.sheet]();return;}
  return _renderSheet();
};
const _hit=UI.hit;
UI.hit=function(d,info){
  _hit(d,info);
  if(info.skill)Snd.play('skill');else if(info.weak){}else if(info.crit)Snd.play('crit');else Snd.play('hit');
  if(info.crit)Meta.prog('crit');
};
const _kill=UI.kill;
UI.kill=function(def,sz,drops){
  const type=E?E.type:'mob';
  _kill(def,sz,drops);
  killWeak();scheduleWeak();
  Snd.play('kill');
  if(type==='mob'||type==='mini'||(type==='dung'&&!E.isBoss))Meta.prog('kills');
  if(type==='boss')Meta.prog('boss');
  if(type==='mono')Meta.prog('mono');
  const rare=(drops||[]).filter(x=>RARE.includes(x.k));
  if(rare.length||(type==='boss'&&!def.last&&0))Meta.fanfare(rare);
};
Meta.fanfare=function(rare){
  const sc=$('scene'),f=document.createElement('div');f.className='rareflash';sc.appendChild(f);
  if(!RM)f.animate([{opacity:0},{opacity:.85,offset:.15},{opacity:0}],{duration:900,easing:'ease-out'}).onfinish=()=>f.remove();else setTimeout(()=>f.remove(),600);
  const nm=rare.map(x=>MATS[x.k].n+(x.n>1?' ×'+x.n:'')).join(', ');
  banner(nm,'Rzadki łup!');
  Snd.play('rare');vib([20,40,20,40,80]);
  for(let i=0;i<4;i++)setTimeout(()=>sparks(true,true),i*90);
};
const _lv=UI.levelUp;
UI.levelUp=function(lv){_lv(lv);Snd.play('level');vib([15,30,15,30,50]);for(let i=0;i<5;i++)setTimeout(()=>sparks(true,true),i*80);};
const _sfx=UI.skillFx;
UI.skillFx=function(sk,d){_sfx(sk,d);Meta.prog('skill');};
const _spawn=UI.spawn;
UI.spawn=function(){killWeak();_spawn();
  if(E&&E.type==='boss')Snd.play('boss');
  if(U.main==='walka')U.dirty=true;
};
const _fr=window.fullRender;
window.fullRender=function(){Meta.refreshMap();_fr();};

/* ---------- ripple po stuknięciu ---------- */
$('scene').addEventListener('pointerdown',e=>{
  if(e.target.closest('.sk')||e.target.closest('.weak'))return;
  const r=$('scene').getBoundingClientRect(),d=document.createElement('i');d.className='ripple';
  d.style.left=(e.clientX-r.left)+'px';d.style.top=(e.clientY-r.top)+'px';
  $('scene').appendChild(d);setTimeout(()=>d.remove(),480);
},{passive:true});

/* ---------- start ---------- */
Meta.start=function(){
  Meta.daily();
  Meta.refreshMap();
  const o=Meta.offline();
  if(o){U.offlineData=o;fullRender();Meta.open('offline');Snd.play('claim');}
  else if(!S.tut){U.tutStep=0;Meta.open('tut');}
  else if(!S.streak.claimed){hook('toast','Nagroda za serię czeka w Mieście → Zadania.');}
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){save();return;}
    if(U.sheet)return;
    const o2=Meta.offline();
    if(o2){U.offlineData=o2;fullRender();Meta.open('offline');Snd.play('claim');}
  });
};
