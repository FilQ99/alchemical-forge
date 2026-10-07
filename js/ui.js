/* =====================================================================
   INTERFEJS: scena, animacje, panele, okno przedmiotu
   ===================================================================== */
const $=id=>document.getElementById(id);
const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cm=v=>String(v).replace('.',',');
const PCT=v=>'+'+cm(v)+'%';
const bonLine=(k,v)=>BON[k].n+': '+PCT(v);
const U={main:'walka',sub:{postac:'eq',miasto:'shop'},log:[],sheet:null,dirty:true,roll:null,lastSlow:0,lastAct:0};
const SUB={postac:[['eq','Ekwipunek'],['guide','Poradnik'],['skills','Umiejętności'],['comp','Towarzysz']],miasto:[['shop','Sklep'],['kowal','Kowal']]};
const NAVI=[
 ['walka','Walka','<path d="M5 19L18 6M14 6h4v4M6 15l3 3M3 21l3-3"/><path d="M19 19L6 6M6 10V6h4M18 15l-3 3M21 21l-3-3"/>'],
 ['postac','Postać','<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7"/>'],
 ['plecak','Plecak','<path d="M6 8h12l1 12H5L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'],
 ['miasto','Miasto','<path d="M3 21V9l4-3 5 3 5-3 4 3v12z"/><path d="M10 21v-6h4v6"/>'],
 ['mapa','Mapa','<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>']
];
const SVGID={boar:'dzik',wolf:'wilk',skel:'szkielet',wolfBig:'alfa',boarKing:'b1',skelGuard:'b2',witch:'b3',monolith:'mono',skelKing:'kw'};
function eThumb(k){const id=SVGID[k];return ASSETS.enemies[id]?'<img src="'+ASSETS.enemies[id]+'" style="width:100%;height:100%;object-fit:contain" alt="">':eThumb(k);}
function nav(main,sub){
  U.main=main;if(sub)U.sub[main]=sub;
  $('app').dataset.tab=main;
  renderNav();renderTabs();renderContent();
  $('content').scrollTop=0;
}
function actDot(id){return (id==='boss'&&MAP1.bosses.some(b=>Date.now()>=(S.bossReady[b.id]||0)&&S.level>=b.lvRec-1))||(id==='mono'&&Date.now()>=S.monoReady)||(id==='dung'&&(S.mat.przepustka||0)>0);}
function renderNav(){
  const dots={postac:S.pts>0,mapa:['mono','boss','dung'].some(actDot)};
  $('nav').innerHTML=NAVI.map(n=>'<button class="nb '+(U.main===n[0]?'on':'')+'" data-act="nav" data-id="'+n[0]+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+n[2]+'</svg><span>'+n[1]+'</span>'+(dots[n[0]]?'<i class="dot"></i>':'')+(n[0]==='plecak'&&S.inv.length?'<em class="cnt">'+S.inv.length+'</em>':'')+'</button>').join('');
}

function tcol(t){return 'var(--t'+t+')';}
function tile(it,cls,act){
  if(!it)return '';
  const perf=it.bon.concat(it.mbon).some(x=>isPerfect(x.b));
  return '<button class="slot has '+(cls||'')+'" style="--tc:'+tcol(it.tier)+'" data-act="'+(act||'item')+'" data-id="'+it.id+'" aria-label="'+esc(itemName(it))+'">'+
    itemIcon(it.slot,it.tier,it.wtype)+
    '<span class="tier">'+ROM[it.tier-1]+'</span>'+(it.up>0?'<span class="up">+'+it.up+'</span>':'')+(perf?'<span class="perf">★</span>':'')+'</button>';
}
function slotBtn(slot){
  const it=S.items[S.eq[slot]];
  if(it)return tile(it);
  return '<button class="slot" data-act="empty" data-slot="'+slot+'" aria-label="Pusty slot: '+SLOTN[slot]+'">'+ghostIcon(slot)+'<span class="lab" style="display:block">'+SLOTN[slot]+'</span></button>';
}
function price(n,ok){return '<span class="price" '+(ok===false?'style="color:var(--bad)"':'')+'>'+COIN+fmt(n)+'</span>';}

/* ---------- scena ---------- */
function setupScene(){
  $('bg').src=ASSETS.bg;
  $('heroimg').src=ASSETS.hero;
  $('sword').src=ASSETS.sword;
  document.documentElement.style.setProperty('--kc',KINGDOMS[S.kingdom].c1);
  document.documentElement.style.setProperty('--kc2',KINGDOMS[S.kingdom].c2);
  $('emblem').innerHTML=SYMBOLS[KINGDOMS[S.kingdom].symbol];
  makeDust();
}
function sizeEnemy(){
  if(!E)return;const d=E.def,el=$('enemy'),w=$('world');
  const sh=w.clientHeight||230,sw=w.clientWidth||360;
  let hh=sh*d.h/100,ww=hh*d.w;const mx=sw*.54;if(ww>mx){ww=mx;hh=ww/d.w;}
  el.style.width=Math.round(ww)+'px';el.style.height=Math.round(hh)+'px';
}
window.addEventListener('resize',()=>sizeEnemy());
function renderEnemy(){
  if(!E)return;
  if(U.deathAnim){try{U.deathAnim.cancel();}catch(_){}U.deathAnim=null;}
  $('enemyin').getAnimations().forEach(a=>{if(!(window.CSSAnimation&&a instanceof CSSAnimation))try{a.cancel();}catch(_){}});
  const d=E.def,el=$('enemy');
  const wantBg=E.type==='dung'?ASSETS.bgDung:ASSETS.bg,bgEl=$('bg');
  if(bgEl.dataset.src!==(E.type==='dung'?'d':'m')){bgEl.dataset.src=E.type==='dung'?'d':'m';bgEl.src=wantBg;}
  sizeEnemy();
  const img=ASSETS.enemies[d.id];
  $('enemyin').innerHTML=img?'<img src="'+img+'" style="width:100%;height:100%;object-fit:contain" alt="">':enemySvg(d.svg);
  el.classList.toggle('ph',!img&&false);
  const key=E.type+':'+d.id+':'+(E.stage||'');
  if(U.lastKey!==key){U.lastKey=key;
    if(E.type==='boss')banner(d.n,'BOSS');else if(E.type==='mono')banner('Monolit','Rozbij kamień!');else if(E.type==='mini')banner(d.n,'MINI-BOSS');else if(E.type==='dung'&&d.id!=='szkielet')banner(d.n,'Dungeon');}
  const sc=$('scene');
  sc.classList.toggle('boss',E.type==='boss'||(E.type==='dung'&&E.isBoss));
  sc.classList.toggle('monolith',E.type==='mono');
  if(!RM)el.animate([{transform:'translateX(40px)',opacity:0},{transform:'none',opacity:1}],{duration:260,easing:'ease-out'});
}
function swordGlow(){
  const w=equippedWeapon(),sw=$('sword');
  if(w){sw.style.setProperty('--tcol',['#a79b82','#9db0ba','#6fa8dc','#4fc08d','#a07ad8','#ee6a3c'][w.tier-1]);sw.style.setProperty('--glow',(w.up>=7?10:w.up>=4?5:0)+'px');}
  else{sw.style.setProperty('--glow','0px');}
  sw.style.display=w||true?'block':'none';
}
function kindName(){
  if(!E)return '';
  return ({mob:'',mini:'Mini-boss',mono:'Monolit',boss:'Boss',dung:'Dungeon'})[E.type];
}
function renderTarget(){
  if(!E)return;
  const t=$('target');
  t.classList.toggle('isminiboss',E.type==='mini');
  const k=kindName();
  let nm=E.def.n;
  if(E.type==='dung'){const st=MAP1.dungeon.stages[E.stage];nm=E.def.n+(st.kind==='horde'?' ('+E.left+'/'+st.count+')':'');}
  t.querySelector('.nm').innerHTML=esc(nm)+(k?' <small>'+k+'</small>':'');
  const mn=$('mininame');if(mn)mn.textContent=nm+(k?' · '+k:'');
  frameTarget();
}
function frameTarget(){
  if(!E)return;
  const mh=$('minihp');if(mh)mh.style.width=Math.max(0,E.hp/E.max*100)+'%';
  $('hpbar').style.width=Math.max(0,E.hp/E.max*100)+'%';
  $('hpt').textContent=fmt(Math.max(0,E.hp))+' / '+fmt(E.max);
  const tm=$('tm');
  if(E.timeLeft!=null){tm.style.display='block';tm.textContent=Math.ceil(E.timeLeft)+' s';}else tm.style.display='none';
}

/* ---------- efekty walki (wokół postaci, bez ruszania grafik) ---------- */
const SPARKC={boar:'#c98b5a',boarKing:'#c98b5a',wolf:'#e0d5bd',wolfBig:'#e0d5bd',skel:'#f2ece0',skelGuard:'#f2ece0',skelKing:'#c9a8ff',witch:'#a07ad8',monolith:'#c9a8ff'};
function sparks(crit,skill){
  if(RM||!E)return;
  const sc=$('scene'),en=$('enemy').getBoundingClientRect(),sr=sc.getBoundingClientRect();
  if(!en.width)return;
  const x=en.left-sr.left+en.width*(0.3+Math.random()*0.4),y=en.top-sr.top+en.height*(0.3+Math.random()*0.35);
  const col=skill?'#c9a8ff':crit?'#ffd36b':(SPARKC[E.def.svg]||'#ffd36b');
  const n=skill?12:crit?9:5;
  for(let i=0;i<n;i++){
    const s=document.createElement('i');s.className='spark';
    const a=Math.random()*Math.PI*2,r=26+Math.random()*(crit||skill?70:44),sz=3+Math.random()*4;
    s.style.cssText='left:'+x+'px;top:'+y+'px;background:'+col+';box-shadow:0 0 6px '+col+';width:'+sz+'px;height:'+sz+'px';
    sc.appendChild(s);
    const an=s.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+Math.cos(a)*r+'px,'+(Math.sin(a)*r+14)+'px) scale(.2)',opacity:0}],{duration:360+Math.random()*220,easing:'cubic-bezier(.2,.7,.4,1)'});
    an.onfinish=()=>s.remove();
  }
}
function shake(px){if(RM)return;$('world').animate([{transform:'translate(0,0)'},{transform:'translate('+px+'px,'+(-px/2)+'px)'},{transform:'translate('+(-px)+'px,'+(px/2)+'px)'},{transform:'translate('+(px/2)+'px,0)'},{transform:'translate(0,0)'}],{duration:220});}
function bumpCombo(){
  const now=Date.now();U.combo=(U.combo&&now-U.comboT<1300)?U.combo+1:1;U.comboT=now;
  const el=$('combo');
  if(U.combo>=3){el.textContent='×'+U.combo;el.classList.add('on');el.dataset.t=U.combo>=40?'3':U.combo>=20?'2':U.combo>=8?'1':'0';
    if(!RM)el.animate([{transform:'translateX(-50%) scale(1.3)'},{transform:'translateX(-50%) scale(1)'}],{duration:130});}
}
function banner(txt,sub){
  const sc=$('scene'),b=document.createElement('div');b.className='lvbanner bossb';
  b.innerHTML='<div>'+esc(txt)+(sub?'<small>'+esc(sub)+'</small>':'')+'</div>';sc.appendChild(b);
  if(RM){setTimeout(()=>b.remove(),900);return;}
  const an=b.animate([{opacity:0,transform:'scale(1.35)'},{opacity:1,transform:'scale(1)',offset:.18},{opacity:1,offset:.7},{opacity:0}],{duration:1500});an.onfinish=()=>b.remove();
}
function makeDust(){
  const w=$('world');
  for(let i=0;i<14;i++){const d=document.createElement('i');d.className='dust';
    d.style.cssText='left:'+Math.random()*100+'%;top:'+(25+Math.random()*65)+'%;animation-delay:'+(-Math.random()*12)+'s;animation-duration:'+(9+Math.random()*9)+'s;--s:'+(1+Math.random()*2.2)+'px';w.appendChild(d);}
}
function heroAttack(){
  return; /* animacja ataku wyłączona na prośbę – ustaw ATTACK_ANIM=true, aby wrócić */
  if(RM)return;
  const hero=$('hero').firstElementChild,sw=$('sword');
  hero.animate([{transform:'translateX(0)'},{transform:'translateX(5%)',offset:.35},{transform:'translateX(0)'}],{duration:150,easing:'ease-out',composite:'add'});
  const base=24;
  sw.animate([
    {transform:'translate(-50%,-80%) rotate('+base+'deg)'},
    {transform:'translate(-50%,-80%) rotate('+(base+95)+'deg)',offset:.4},
    {transform:'translate(-50%,-80%) rotate('+base+'deg)'}],{duration:170,easing:'ease-out'});
}
function floater(txt,cls,color,size){
  const sc=$('scene'),en=$('enemy').getBoundingClientRect(),sr=sc.getBoundingClientRect();
  const f=document.createElement('div');f.className='floater';
  f.textContent=txt;f.style.color=color;f.style.fontSize=size+'px';
  const x=en.left-sr.left+en.width*(0.25+Math.random()*0.5),y=en.top-sr.top+en.height*(0.15+Math.random()*0.25);
  f.style.left=x+'px';f.style.top=y+'px';sc.appendChild(f);
  if(RM){setTimeout(()=>f.remove(),500);return;}
  const dx=(Math.random()-.5)*50;
  f.animate([{transform:'translate(-50%,0) scale(.6)',opacity:0},{transform:'translate(calc(-50% + '+dx*.3+'px),-14px) scale('+(cls==='crit'?1.25:1)+')',opacity:1,offset:.18},{transform:'translate(calc(-50% + '+dx+'px),-'+(cls==='crit'?90:68)+'px) scale(.95)',opacity:0}],{duration:cls==='crit'?850:650,easing:'ease-out'}).onfinish=()=>f.remove();
}
const vib=ms=>{try{if(navigator.vibrate)navigator.vibrate(ms);}catch(e){}};
UI.hit=function(d,info){
  const en=$('enemy');
  if(!RM){en.classList.remove('hit');void en.offsetWidth;en.classList.add('hit');}
  if(info.kind==='click'&&!info.second)heroAttack();
  else if(info.kind==='auto'&&!info.second)heroAttack();
  if(info.skill){floater(fmt(d),'skill','#c9a8ff',24);vib(25);}
  else if(info.crit){floater(fmt(d)+'!','crit','#ffd36b',26);vib(14);}
  else floater(fmt(d),'n','#fff',info.kind==='auto'?15:17);
  if(info.kind==='click')bumpCombo();
  sparks(info.crit,info.skill);
  if(info.skill)shake(6);else if(info.crit)shake(3.5);
  frameTarget();
};
UI.spawn=function(){renderEnemy();renderTarget();U.dirty=true;};
UI.kill=function(def,sz,drops){
  if(!RM)$('xpbar').animate([{filter:'brightness(2.4)'},{filter:'brightness(1)'}],{duration:450});
  vib(drops&&drops.length?[10,40,10]:8);
  {const m=U.sum;m.sz+=sz;m.k++;const b=m.by[def.n]||(m.by[def.n]={n:0,sz:0});b.n++;b.sz+=sz;(drops||[]).forEach(x=>{m.mat[x.k]=(m.mat[x.k]||0)+x.n;});}
  U.log.unshift({n:def.n,sz:sz,d:(drops||[]).map(x=>({k:x.k,n:x.n}))});if(U.log.length>8)U.log.pop();
  const en=$('enemy').getBoundingClientRect(),co=$('coin').getBoundingClientRect();
  if(!RM){
    const n=Math.min(8,3+Math.floor(Math.log10(sz+1)*2));
    for(let i=0;i<n;i++){
      const c=document.createElement('div');c.innerHTML=COIN;c.style.cssText='position:fixed;z-index:60;width:16px;height:16px;pointer-events:none;left:'+(en.left+en.width/2)+'px;top:'+(en.top+en.height*0.55)+'px';
      document.body.appendChild(c);
      const dx=(Math.random()-.5)*120,dy=-30-Math.random()*50;
      const tx=co.left+co.width/2-(en.left+en.width/2),ty=co.top+co.height/2-(en.top+en.height*0.55);
      c.animate([{transform:'translate(0,0) scale(.7)',opacity:1},{transform:'translate('+dx+'px,'+dy+'px) scale(1)',opacity:1,offset:.35},{transform:'translate('+tx+'px,'+ty+'px) scale(.6)',opacity:.9}],{duration:700+i*40,easing:'cubic-bezier(.3,.1,.5,1)'}).onfinish=()=>{c.remove();if(i===0){const cc=$('coin');cc.classList.remove('pulse');void cc.offsetWidth;cc.classList.add('pulse');}};
    }
    if(def&&def.id!==undefined){
      U.deathAnim=$('enemyin').animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.85) translateY(6%)'}],{duration:180,fill:'forwards'});
    }
  }
  floater('+'+fmt(sz),'sz','#f5d58c',16);
  drops.forEach((d,i)=>setTimeout(()=>dropChip(d),i*260));
  U.dirty=true;
};
function dropChip(d){
  const sc=$('scene'),c=document.createElement('div');c.className='chip';
  c.innerHTML=matIcon(d.k,'ico')+'<span>+'+d.n+' '+esc(MATS[d.k].n)+'</span>';
  c.style.marginLeft='-60px';sc.appendChild(c);
  if(RM){setTimeout(()=>c.remove(),1500);return;}
  c.animate([{transform:'translateY(10px) scale(.8)',opacity:0},{transform:'translateY(0) scale(1)',opacity:1,offset:.15},{transform:'translateY(-4px)',opacity:1,offset:.8},{transform:'translateY(-18px)',opacity:0}],{duration:1700,easing:'ease-out'}).onfinish=()=>c.remove();
}
UI.levelUp=function(lv){
  const b=document.createElement('div');b.className='lvbanner';
  b.innerHTML='<div>Awans!<small>Poziom '+lv+(lv===5?' · Trener w mieście czeka na Ciebie':'')+'</small></div>';
  $('scene').appendChild(b);
  if(!RM){b.animate([{opacity:0,transform:'scale(.6)'},{opacity:1,transform:'scale(1.05)',offset:.2},{opacity:1,transform:'scale(1)',offset:.75},{opacity:0,transform:'scale(1.1)'}],{duration:1700,easing:'ease-out'}).onfinish=()=>b.remove();
    $('hero').animate([{filter:'brightness(1)'},{filter:'brightness(2.2) drop-shadow(0 0 18px #f5d58c)',offset:.2},{filter:'brightness(1)'}],{duration:900});
  }else setTimeout(()=>b.remove(),1500);
  U.dirty=true;
};
UI.skillFx=function(sk,d){
  const hero=$('hero');
  hero.classList.toggle('fury',sk.role==='wzmocnienie');
  if(sk.role==='wzmocnienie'){setTimeout(()=>hero.classList.remove('fury'),SKROLE.wzmocnienie.dur*1000);hook('toast',sk.name+': wzmocnienie aktywne!');}
  if(!RM&&sk.role!=='wzmocnienie'){
    $('scene').animate([{transform:'translate(0,0)'},{transform:'translate(-4px,3px)'},{transform:'translate(4px,-3px)'},{transform:'translate(0,0)'}],{duration:sk.role==='finisher'?360:200});
    heroAttack();
  }
  U.dirty=true;
};
let toastT=0;
UI.toast=function(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),2400);};

/* ---------- HUD ---------- */
function renderHud(){
  const k=KINGDOMS[S.kingdom],c=CLASSES[S.cls];
  $('pname').textContent=S.name;
  $('pinfo').textContent=c.n+(S.path?' · '+c.paths[S.path]:'')+' · '+k.name;
  $('lv').textContent=S.level;
  const cap=levelCap();
  if(S.level>=cap){$('xpt').textContent='Limit mapy ('+cap+')';$('xpbar').style.width='100%';}
  else{$('xpt').textContent=fmt(S.xp)+' / '+fmt(xpNeed(S.level));$('xpbar').style.width=(S.xp/xpNeed(S.level)*100)+'%';}
  $('szardy').textContent=fmt(S.szardy);
}
function renderBuffs(){
  const s=calcStats();const now=Date.now();
  let h='';
  h+='<div class="buff"><span class="ico">'+SYMBOLS[KINGDOMS[S.kingdom].symbol].replace('<svg','<svg width="12" height="12"')+'</span>'+esc(KINGDOMS[S.kingdom].name.split(' ')[0])+'</div>';
  h+='<div class="buff"><span class="ico">✦</span>Siła '+PCT(s.comp.moc)+'</div>';
  h+='<div class="buff"><span class="ico">☘</span>Szczęście '+PCT(s.comp.szczescie)+'</div>';
  h+='<div class="buff"><span class="ico">⏱</span>Tempo '+PCT(s.comp.skupienie)+'</div>';
  const sk=skillList()[1];
  if(sk&&(S.buffEnd[sk.id]||0)>now)h+='<div class="buff act"><span class="ico">'+skGlyph(sk,true)+'</span>'+esc(sk.name)+' '+Math.ceil((S.buffEnd[sk.id]-now)/1000)+'s</div>';
  $('buffs').innerHTML=h;
}
function renderSkillsBar(){
  const list=skillList();let h='';
  for(let i=0;i<3;i++){
    const sk=list[i];
    if(!sk){const L=Object.values(SKROLE)[i]?Object.values(SKROLE)[i].lvl:'';h+='<button class="sk lock" data-act="sklock" data-i="'+i+'" aria-label="Umiejętność zablokowana"><span class="gl">🔒</span><span class="k">'+(i+1)+'</span><span class="lv">'+(L?'lv '+L:'')+'</span></button>';continue;}
    const un=skUnlocked(sk);
    h+='<button class="sk '+(un?'':'lock')+(un&&S.auto[sk.id]===1?' auto':'')+'" data-act="'+(un?'skill':'sklock')+'" data-i="'+i+'" id="sk'+i+'" aria-label="'+esc(sk.name)+(un?'':' (poziom '+sk.lvl+')')+'"><span class="gl">'+skGlyph(sk,un)+'</span><span class="k">'+(i+1)+'</span><span class="cd"></span><span class="t"></span>'+(un?'':'<span class="lv">lv '+sk.lvl+'</span>')+'</button>';
  }
  $('skills').innerHTML=h;
}
function frameSkills(){
  skillList().forEach((sk,i)=>{
    const b=$('sk'+i);if(!b||!skUnlocked(sk))return;
    const rin=skReadyIn(sk),tot=skCd(sk);
    b.querySelector('.cd').style.transform='scaleY('+(rin>0?rin/tot:0)+')';
    b.querySelector('.t').textContent=rin>0?Math.ceil(rin):'';
    b.classList.toggle('ready',rin<=0);
    b.classList.toggle('on',sk.role==='wzmocnienie'&&(S.buffEnd[sk.id]||0)>Date.now());
  });
}
function renderActs(){renderNav();}
function renderTabs(){
  const t=SUB[U.main],el=$('tabs');
  if(!t){el.style.display='none';el.innerHTML='';return;}
  el.style.display='flex';
  el.innerHTML=t.map(x=>'<button class="tab '+(U.sub[U.main]===x[0]?'on':'')+'" data-act="tab" data-id="'+x[0]+'">'+x[1]+(x[0]==='skills'&&S.pts>0?'<span class="badge">'+S.pts+'</span>':'')+'</button>').join('');
}

/* ---------- panele ---------- */
function setsHtml(){
  const sc=setCounts();let h='<div class="sets">';
  for(let i=0;i<6;i++){
    if(sc[i]===0&&i>1)continue;
    let pips='';for(let p=0;p<8;p++)pips+='<i class="pip '+(p<sc[i]?'f':'')+'"></i>';
    h+='<div class="set '+(sc[i]>0?'on':'')+'" style="--tc:'+tcol(i+1)+'"><div><div class="nm">Set '+SETS[i].n+'</div><div class="pips">'+pips+'</div></div><div>'+
      SETB[i].map(t=>'<div class="bl '+(sc[i]>=t.n?'up':'')+'">'+t.n+' elem.: '+Object.keys(t.b).map(k=>bonLine(k,t.b[k])).join(', ')+'</div>').join('')+'</div></div>';
  }
  return h+'</div>';
}
function panelEq(){
  const L=['helmet','armor','shield','boots'],R=['weapon','neck','earrings','bracelet'];
  let h='<div class="sec"><div class="doll"><div class="col">'+L.map(slotBtn).join('')+'</div><div class="mid"><img src="'+ASSETS.hero+'" alt="Postać"></div><div class="col">'+R.map(slotBtn).join('')+'</div></div>';
  h+='<div class="bonusrow">'+BSLOTS.map(slotBtn).join('')+'</div></div>';
  const s=calcStats();
  h+='<div class="sec"><h3>Statystyki <small>~ '+fmt(power())+' obr./s</small></h3><div class="card"><div class="stat"><span>Cios (klik)</span><b class="num">'+fmt(clickDmg())+'</b></div><div class="stat"><span>Cios samoczynny</span><b class="num">'+fmt(autoDmg())+' co '+cm(r1(autoInterval()))+' s</b></div><div class="stat"><span>Szansa na krytyk</span><b class="num">'+cm(r1(s.krytyk))+'%</b></div><div class="stat"><span>Broń</span><b>'+(s.wtype?WEAPONS[s.wtype].n+' (tempo '+cm(WEAPONS[s.wtype].tempo)+')':'brak')+'</b></div></div></div>';
  h+='<div class="sec"><h3>Sety <small>bonusy za 2/4/6/8 elementów</small></h3>'+setsHtml()+'</div>';
  return h;
}
function panelBag(){
  let h='';
  h+='<div class="sec"><h3>Plecak <small>'+S.inv.length+' elem.</small></h3>';
  if(!S.inv.length)h+='<div class="card muted">Plecak jest pusty. Elementy seta Wędrowca kupisz w Mieście, w zakładce Sklep.</div>';
  else{
    const ids=S.inv.slice().sort((a,b)=>{const x=S.items[a],y=S.items[b];return (y.tier-x.tier)||(ALLSLOTS.indexOf(x.slot)-ALLSLOTS.indexOf(y.slot));});
    h+='<div class="grid">'+ids.map(id=>tile(S.items[id])).join('')+'</div>';
  }
  h+='</div>';
  h+=panelMats();
  return h;
}
function recText(lv){return S.level>=lv?'<span class="pill ok">poziom '+lv+'+</span>':'<span class="pill">zalecany poziom '+lv+'+</span>';}
function ttk(hp){const p=power();return p>0?Math.ceil(hp/p):0;}
function dropsTxt(d){return Object.keys(d).map(k=>MATS[k].n+' ×'+(d[k][0]===d[k][1]?d[k][0]:d[k][0]+'–'+d[k][1])).join(', ');}
function panelAct(){
  const now=Date.now();let h='';
  const sel=S.actSel;
  const cur=E?E.type:'mob';
  const inSpecial=cur==='mono'||cur==='boss'||cur==='dung';
  if(sel==='hunt'){
    h+='<div class="sec"><h3>Polowanie <small>Wrzosowe Pogranicze</small></h3>';
    h+='<div class="card"><p class="muted" style="margin:0 0 8px">Stały strumień potworów: bezpieczny zarobek bez ograniczeń czasu. Działa też, gdy nie klikasz, w tempie Twojej broni.</p>';
    h+='<div class="stat"><span>Do mini-bossa</span><b class="num">'+(S.kills%CFG.minibossEvery)+' / '+CFG.minibossEvery+'</b></div>';
    h+='<div class="stat"><span>Drop</span><b>Szardy, doświadczenie, rzadko Kamień ulepszenia</b></div></div>';
    if(inSpecial)h+='<div class="btns" style="margin-top:10px"><button class="btn" data-act="hunt">Wróć do polowania</button></div>';
    h+='</div><div class="sec"><h3>Potwory</h3>';
    MAP1.mobs.forEach(m=>{h+='<div class="act-card"><div style="width:64px;height:48px">'+eThumb(m.svg)+'</div><div class="grow"><b>'+esc(m.n)+'</b><small>poziomy '+m.lv[0]+'–'+m.lv[1]+' · '+fmt(m.hp)+' życia · +'+m.sz+' Szardów</small></div></div>';});
    h+='<div class="act-card"><div style="width:64px;height:48px">'+eThumb('wolfBig')+'</div><div class="grow"><b>'+esc(MAP1.mini.n)+'</b><small>Mini-boss co '+CFG.minibossEvery+' potworów · '+dropsTxt(MAP1.mini.drops)+'</small></div></div></div>';
  }else if(sel==='mono'){
    const d=MAP1.monolith,hp=Math.ceil(representativeHp()*d.hpMul),rdy=Math.max(0,Math.ceil((S.monoReady-now)/1000));
    h+='<div class="sec"><h3>Monolit <small>'+recText(d.lvRec)+'</small></h3><div class="card">';
    h+='<div class="row2" style="align-items:flex-start"><div style="width:70px;height:96px">'+eThumb('monolith')+'</div><div style="flex:1;margin-left:10px"><b style="font-family:var(--fh)">'+esc(d.n)+'</b><p class="muted" style="margin:4px 0 0">Kamienny słup z runami. Duży cel, szybszy zarobek i główne źródło Kamieni ulepszenia, Odłamków i Przepustek do dungeonu.</p></div></div>';
    h+='<div class="sep"></div><div class="stat"><span>Życie</span><b class="num">'+fmt(hp)+'</b></div><div class="stat"><span>Szacowany czas</span><b class="num">~'+ttk(hp)+' s</b></div><div class="stat"><span>Nagrody</span><b style="text-align:right">'+dropsTxt(d.drops)+', Szardy ×'+d.sz+'</b></div><div class="stat"><span>Przepustka do dungeonu</span><b>'+Math.round(d.przepustka*100)+'%</b></div>';
    h+='<div class="btns" style="margin-top:10px"><button class="btn" data-act="mono" '+(rdy>0||cur==='mono'?'disabled':'')+'>'+(cur==='mono'?'Monolit trwa':rdy>0?'Odnawia się '+rdy+' s':'Przywołaj Monolit')+'</button>'+(cur==='mono'?'<button class="btn ghost" data-act="hunt">Porzuć</button>':'')+'</div></div></div>';
  }else if(sel==='boss'){
    h+='<div class="sec"><h3>Bossowie mapy <small>limit czasu '+CFG.bossTime+' s · odrodzenie '+Math.round(CFG.bossRespawn/60)+' min</small></h3>';
    MAP1.bosses.forEach(b=>{
      const rdy=Math.max(0,Math.ceil(((S.bossReady[b.id]||0)-now)/1000));
      const fighting=cur==='boss'&&E.def.id===b.id;
      h+='<div class="card" style="margin-bottom:8px"><div class="row2" style="align-items:flex-start"><div style="width:64px;height:84px;flex:none">'+eThumb(b.svg)+'</div><div style="flex:1;margin-left:10px"><b style="font-family:var(--fh)">'+esc(b.n)+'</b> '+recText(b.lvRec)+'<small class="muted" style="display:block">'+esc(b.desc)+'</small>'+
        '<div class="stat"><span>Życie</span><b class="num">'+fmt(b.hp)+'</b></div><div class="stat"><span>Łup</span><b style="text-align:right;font-size:12px">'+dropsTxt(b.drops)+', Perła '+Math.round(b.perla*100)+'%'+(b.przepustka?', Przepustka '+Math.round(b.przepustka*100)+'%':'')+'</b></div></div></div>'+
        '<div class="btns" style="margin-top:8px"><button class="btn" data-act="boss" data-id="'+b.id+'" '+(rdy>0||fighting?'disabled':'')+'>'+(fighting?'Walka trwa':rdy>0?'Odradza się '+Math.floor(rdy/60)+':'+String(rdy%60).padStart(2,'0'):'Walcz')+'</button>'+(fighting?'<button class="btn ghost" data-act="hunt">Porzuć</button>':'')+'</div></div>';
    });
    h+='<p class="hint">Bossowie dają Perły i Znaki, czyli materiały na Kamień przemiany.</p></div>';
  }else{
    const D=MAP1.dungeon,pass=S.mat.przepustka||0;
    h+='<div class="sec"><h3>'+esc(D.n)+' <small>'+recText(D.lvRec)+'</small></h3><div class="card">';
    h+='<p class="muted" style="margin:0 0 8px">Pradawny kurhan na granicy. Trzy etapy w limicie '+Math.round(CFG.dungeonTime/60)+' minut. Wejście kosztuje 1 Przepustkę (zużywana), wejść możesz tyle, ile masz Przepustek.</p>';
    D.stages.forEach((st,i)=>{h+='<div class="stat"><span>Etap '+(i+1)+': '+esc(st.n)+'</span><b class="num">'+(st.kind==='horde'?st.count+' potworów':fmt(st.hp)+' życia')+'</b></div>';});
    h+='<div class="sep"></div><div class="stat"><span>Nagrody</span><b style="text-align:right">'+dropsTxt(D.drops)+', Szardy</b></div>';
    h+='<div class="stat"><span>Twoje Przepustki</span><b class="num">'+pass+'</b></div>';
    h+='<div class="btns" style="margin-top:10px"><button class="btn" data-act="dung" '+(pass<1||cur==='dung'?'disabled':'')+'>'+(cur==='dung'?'Wyprawa trwa':'Wejdź (1 Przepustka)')+'</button>'+(cur==='dung'?'<button class="btn ghost" data-act="hunt">Opuść</button>':'')+'</div></div><p class="hint">Przepustki wypadają z Monolitów i rzadko z Wiedźmy Wrzosowisk.</p></div>';
  }
  return h;
}


function panelGuide(){
  const g=GOALS[U.goal],rank=k=>{const i=g.top.indexOf(k);return i<0?99:i;};
  let h='<div class="sec"><h3>Jaki ekwipunek jest super?</h3><div class="goalrow">'+Object.keys(GOALS).map(x=>'<button class="gchip '+(U.goal===x?'on':'')+'" data-act="goal" data-id="'+x+'">'+GOALS[x].n+'</button>').join('')+'</div><div class="card"><p style="margin:0">'+g.desc+'</p></div></div>';
  h+='<div class="sec"><h3>Polecane bonusy 1–5 <small>dla każdego elementu</small></h3><div class="card guide">';
  ALLSLOTS.forEach(sl=>{const list=POOL[sl].slice().sort((a,b)=>rank(a)-rank(b)).slice(0,3);h+='<div class="gr"><span>'+SLOTN[sl]+'</span><b>'+list.map(k=>BON[k].n).join(' · ')+'</b></div>';});
  h+='</div></div><div class="sec"><h3>Bonusy 6–7 <small>mistrzowskie</small></h3><div class="card guide"><div class="gr"><span>Najlepsze</span><b>'+g.m.map(k=>BON[k].n).join(' · ')+'</b></div></div></div>';
  h+='<div class="sec"><h3>Jak do tego dojść</h3><div class="card"><ol class="tips"><li>Kup set z Miasta i załóż wszystkie elementy.</li><li>Zmieniacz losuje bonusy 1–5 od nowa, Dodatek dodaje jeden brakujący (maks. 5).</li><li>Szukaj kropek: 5 kropek to perfekt. Dobre bonusy zostają przy ulepszaniu i przerabianiu na nowy set.</li><li>Bonusy 6–7 daj na elementach, które zostają z Tobą najdłużej.</li></ol></div></div>';
  return h;
}
function panelWalka(){
  const now=Date.now(),cur=E?E.type:'mob';
  const defs=[['hunt','Polowanie',cur==='mob'||cur==='mini'],['mono','Monolit',cur==='mono'],['boss','Boss',cur==='boss'],['dung','Dungeon',cur==='dung']];
  let h='<div class="sec"><div class="chips chips4">';
  defs.forEach(([id,n,on])=>{
    let st='';
    if(id==='hunt')st='Potwory';
    else if(id==='mono'){const r=Math.ceil((S.monoReady-now)/1000);st=on?'trwa':r>0?'za '+r+' s':'gotowy';}
    else if(id==='boss'){const k=MAP1.bosses.filter(b=>now>=(S.bossReady[b.id]||0)).length;st=on?'trwa':k+' / '+MAP1.bosses.length+' gotowych';}
    else st='Przepustki: '+(S.mat.przepustka||0);
    h+='<button class="chip2 '+(on?'on':'')+'" data-act="chip" data-id="'+id+'"><b>'+n+'</b><small>'+st+'</small>'+(id!=='hunt'&&actDot(id)&&!on?'<i class="dot"></i>':'')+'</button>';
  });
  h+='</div></div>';
  h+='<div class="sec"><div class="card"><div class="stat"><span>Cios (klik)</span><b class="num">'+fmt(clickDmg())+'</b></div><div class="stat"><span>Cios samoczynny</span><b class="num">'+fmt(autoDmg())+' co '+cm(r1(autoInterval()))+' s</b></div><div class="stat"><span>Do mini-bossa</span><b class="num">'+(S.kills%CFG.minibossEvery)+' / '+CFG.minibossEvery+'</b></div></div></div>';
  h+=lootHtml();
  return h;
}
function lootHtml(){
  const m=U.sum,coin=COIN.replace('<svg','<svg class="mi"');
  const mats=Object.keys(m.mat).filter(k=>m.mat[k]>0);
  const mins=Math.max(1,Math.round((Date.now()-m.t)/60000));
  let h='<div class="sec"><div class="card loot"><button class="lhead" data-act="lootT"><span><b>Łup z tej tury</b><small>'+m.k+' pokonanych · '+mins+' min</small></span><span class="lsum"><b class="num">+'+fmt(m.sz)+'</b> '+coin+'<i class="chev '+(U.sumOpen?'o':'')+'">▾</i></span></button>';
  if(mats.length)h+='<div class="lmats">'+mats.map(k=>matIcon(k,'mi')+'<span>×'+m.mat[k]+'</span>').join('')+'</div>';
  else h+='<div class="lmats muted">Materiały pojawią się tutaj.</div>';
  if(U.sumOpen){
    h+='<div class="lbody">';
    const names=Object.keys(m.by);
    if(names.length)h+=names.map(n=>'<div class="lg"><span>'+esc(n)+' ×'+m.by[n].n+'</span><b class="num">+'+fmt(m.by[n].sz)+' '+coin+'</b></div>').join('');
    if(mats.length)h+='<div class="lg"><span>Materiały</span><span class="lmx">'+mats.map(k=>esc(MATS[k]?MATS[k].n:k)+' ×'+m.mat[k]).join(', ')+'</span></div>';
    h+='<button class="btn ghost" data-act="lootReset" style="margin-top:8px">Zacznij nową turę</button></div>';
  }
  return h+'</div></div>';
}
function panelMapa(){
  let h='<div class="sec"><h3>Teleportacja</h3><div class="maps">';
  h+='<div class="mapcard here"><img src="'+ASSETS.bg+'" alt=""><div class="mc"><b>'+esc(MAP1.name)+'</b><small>Mapa 1 · poziomy '+MAP1.levels+'</small></div><span class="pill ok">Tu jesteś</span></div>';
  h+='<div class="mapcard lockd"><div class="mc"><b>Mapa 2</b><small>Wkrótce</small></div><span class="lk">🔒</span></div>';
  h+='<div class="mapcard lockd"><div class="mc"><b>Mapa 3</b><small>Wkrótce</small></div><span class="lk">🔒</span></div>';
  h+='</div></div><div class="sec"><h3>Aktywności</h3><div class="tiles">';
  const now=Date.now(),cur=E?E.type:'mob';
  const defs=[['hunt','Polowanie','dzik',(cur==='mob'||cur==='mini')?'trwa':'Potwory'],['mono','Monolit','mono',cur==='mono'?'trwa':(S.monoReady>now?'za '+Math.ceil((S.monoReady-now)/1000)+' s':'gotowy')],['boss','Boss','b1',cur==='boss'?'trwa':MAP1.bosses.filter(b=>now>=(S.bossReady[b.id]||0)).length+' / 3 gotowych'],['dung','Dungeon','kw','Przepustki: '+(S.mat.przepustka||0)]];
  defs.forEach(([id,n,img,st])=>{
    h+='<button class="tile2 '+(S.actSel===id?'on':'')+'" data-act="actsel" data-id="'+id+'">'+(ASSETS.enemies[img]?'<img src="'+ASSETS.enemies[img]+'" alt="">':'')+'<b>'+n+'</b><small>'+st+'</small>'+(id!=='hunt'&&actDot(id)?'<i class="dot"></i>':'')+'</button>';
  });
  h+='</div></div>';
  return h+panelAct();
}
function panelShop(){
  const cls=CLASSES[S.cls];
  let h='<div class="sec"><h3>Set Wędrowca <small>drewno, skóra, kość</small></h3><div class="shop">';
  const row=(slot,wt)=>{
    const nm=slot==='weapon'?WNAMES[1][wt]:NAMES[1][slot];
    const p=shopPrice(slot,1),ok=S.szardy>=p;
    return '<div class="shop it"><div class="slot sm has" style="--tc:var(--t1)">'+itemIcon(slot,1,wt)+'</div><div><b>'+esc(nm)+'</b><small>'+(slot==='weapon'?WEAPONS[wt].n+' · tempo '+cm(WEAPONS[wt].tempo):SLOTN[slot])+'</small></div><button class="btn" data-act="buy" data-slot="'+slot+'" data-w="'+(wt||'')+'" '+(ok?'':'disabled')+'>'+price(p,ok)+'</button></div>';
  };
  cls.weapons.forEach(w=>{h+=row('weapon',w);});
  SLOTS.filter(s=>s!=='weapon').forEach(s=>{h+=row(s);});
  h+='</div></div><div class="sec"><h3>Elementy bonusowe</h3><div class="shop">';
  BSLOTS.forEach(s=>{const p=shopPrice(s,1),ok=S.szardy>=p;h+='<div class="shop it"><div class="slot sm has" style="--tc:var(--t1)">'+itemIcon(s,1)+'</div><div><b>'+esc(SLOTN[s]+' wędrowca')+'</b><small>Slot bonusowy, nie wchodzi w skład seta</small></div><button class="btn" data-act="buy" data-slot="'+s+'" data-w="" '+(ok?'':'disabled')+'>'+price(p,ok)+'</button></div>';});
  h+='</div></div><div class="sec"><h3>Ulepszacze</h3><div class="shop">';
  ['zmieniacz','dodatek','ochronny','zmieniaczM','dodatekM'].forEach(k=>{
    const p=matPrice(k),ok=S.szardy>=p;
    h+='<div class="shop it">'+matIcon(k,'slot sm" style="border:0;background:none')+'<div><b>'+MATS[k].n+'</b><small>'+MATS[k].d+' Masz: '+(S.mat[k]||0)+'</small></div><button class="btn" data-act="buymat" data-id="'+k+'" '+(ok?'':'disabled')+'>'+price(p,ok)+'</button></div>';
  });
  h+='<p class="hint">Kamień ulepszenia nie jest w sklepie: wypada z Monolitów, mini-bossów i potworów.</p></div></div>';
  return h;
}
function panelKowal(){
  let h='<div class="sec"><h3>Kowal <small>wytwarzanie</small></h3><p class="hint" style="margin:0 0 8px">Kowal zamienia zebrane materiały na lepsze ulepszacze.</p><div class="shop">';
  const need=c=>Object.keys(c.need).map(k=>MATS[k].n+' '+(S.mat[k]||0)+'/'+c.need[k]).join(', ');
  [['ochronny','Kamień ochronny'],['przemiany','Kamień przemiany'],['dodatekM','Dodatek mistrzowski'],['zmieniaczM','Zmieniacz mistrzowski']].forEach(([id,n])=>{
    const c=CRAFT[id],ok=canCraft(id),fee=craftFee(id);
    h+='<div class="shop it">'+matIcon(c.out,'slot sm" style="border:0;background:none')+'<div><b>'+n+'</b><small>'+need(c)+'</small></div><button class="btn" data-act="craft" data-id="'+id+'" '+(ok?'':'disabled')+'>'+(fee?price(fee,S.szardy>=fee):'Wytwórz')+'</button></div>';
  });
  return h+'</div></div>';
}
function autoHtml(sk,i){
  const st=S.auto[sk.id],p=autoPrice(i);
  if(!st)return '<button class="btn autob" data-act="autobuy" data-id="'+sk.id+'" '+(S.szardy>=p?'':'disabled')+'>Kup autouzywanie · '+fmt(p)+' '+COIN.replace('<svg','<svg class="mi"')+'</button>';
  return '<button class="btn autob '+(st===1?'on':'')+'" data-act="autotog" data-id="'+sk.id+'">Auto: '+(st===1?'WŁ.':'WYŁ.')+'</button>';
}
function panelSkills(){
  const c=CLASSES[S.cls];let h='';
  if(!S.path){
    h+='<div class="sec"><h3>Trener w mieście</h3><div class="card">';
    if(S.level<5)h+='<p class="muted" style="margin:0">Na poziomie 5 trener w mieście pozwoli Ci wybrać ścieżkę i nauczy pierwszej umiejętności. Zostało '+(5-S.level)+' poziomów.</p>';
    else{h+='<p style="margin:0 0 10px">Wybierz ścieżkę. Zmiana później nie będzie możliwa.</p><div class="btns">';
      for(const p in c.paths)h+='<button class="btn" data-act="path" data-id="'+p+'">'+c.paths[p]+'</button>';
      h+='</div>';}
    h+='</div></div>';
  }else{
    h+='<div class="sec"><h3>'+c.n+' · '+c.paths[S.path]+' <small>Punkty: <b>'+S.pts+'</b></small></h3>';
    skillList().forEach((sk,i)=>{
      const R=SKROLE[sk.role],un=skUnlocked(sk),rk=skRank(sk.id);
      let pips='';for(let p=1;p<=10;p++)pips+='<i class="'+(p<=rk?'f':'')+'"></i>';
      const eff=sk.role==='wzmocnienie'?'+'+Math.round(R.buff*(1+(rk-1)*0.1))+'% Mocy przez '+R.dur+' s':'×'+cm(r1(R.mult*(1+(rk-1)*0.15)))+' obrażeń';
      h+='<div class="sklrow '+(un?'':'lock')+'"><div class="gl">'+skGlyph(sk,un)+'</div><div><b>'+esc(sk.name)+'</b><small>'+R.desc+' · '+eff+' · odnowienie '+Math.round(skCd(sk))+' s</small>'+(un?'<div class="rank">'+pips+'</div>'+autoHtml(sk,i):'<small>Odblokowanie: poziom '+sk.lvl+'</small>')+'</div>'+
        (un?'<button class="btn" data-act="rank" data-id="'+sk.id+'" '+(S.pts<1||rk>=5?'disabled':'')+'>+1</button>':'')+'</div>';
    });
    h+='<p class="hint">Rangi 1–5 kosztują punkty umiejętności. Rangi 6–10 wymagają Księgi umiejętności (dodamy z kolejnymi mapami). Skróty: klawisze 1, 2, 3.</p></div>';
  }
  return h;
}
function panelComp(){
  const s=calcStats(),c=S.comp,need=Math.round(CFG.comp.xpBase*Math.pow(CFG.comp.xpGrow,c.lvl-1)),max=c.lvl>=CFG.comp.max;
  let h='<div class="sec"><h3>Towarzysz <small>poziom '+c.lvl+(max?' (maks.)':'')+'</small></h3><div class="card">';
  h+='<div class="row2" style="align-items:flex-start"><div style="width:70px;height:70px;flex:none"><svg viewBox="0 0 70 70"><defs><radialGradient id="wg" cx="50%" cy="40%"><stop offset="0" stop-color="#f5d58c"/><stop offset="1" stop-color="#7a5c8e" stop-opacity=".1"/></radialGradient></defs><circle cx="35" cy="35" r="30" fill="url(#wg)"/><path d="M35 14 C48 22 52 38 40 50 C34 56 26 52 24 44 C22 34 28 22 35 14Z" fill="#f2ece0" stroke="#140d08" stroke-width="2.5"/><circle cx="32" cy="34" r="2.6" fill="#140d08"/><circle cx="40" cy="34" r="2.6" fill="#140d08"/></svg></div><div style="flex:1;margin-left:10px"><b style="font-family:var(--fh)">Duch Pogranicza</b><p class="muted" style="margin:4px 0 0">Wzmacnia bohatera, nie walczy. Każdy ma towarzysza za darmo, a siła zależy od jego poziomu.</p></div></div>';
  if(!max)h+='<div class="bar xp" style="margin-top:10px"><i style="width:'+(c.xp/need*100)+'%"></i></div><div class="stat"><span class="muted">Doświadczenie</span><b class="num">'+fmt(c.xp)+' / '+fmt(need)+'</b></div>';
  h+='<div class="sep"></div><div class="stat"><span>Część XP dla towarzysza</span><b class="num" id="sharev">'+c.share+'%</b></div><input type="range" min="0" max="50" step="5" value="'+c.share+'" data-act="share" aria-label="Część doświadczenia dla towarzysza"><p class="hint">Z każdego zdobytego XP '+c.share+'% idzie do towarzysza, a reszta do bohatera. Przy 0% towarzysz zostaje na swoim poziomie, bez kary.</p></div></div>';
  h+='<div class="sec"><h3>Aktywne wzmocnienia</h3><div class="card">';
  h+='<div class="stat"><span>✦ Siła</span><b class="num" style="color:var(--green)">'+PCT(s.comp.moc)+' obrażeń</b></div>';
  h+='<div class="stat"><span>☘ Szczęście</span><b class="num" style="color:var(--green)">'+PCT(s.comp.szczescie)+' do łupów</b></div>';
  h+='<div class="stat"><span>⏱ Tempo</span><b class="num" style="color:var(--green)">'+PCT(s.comp.skupienie)+' krótsze odnowienia</b></div>';
  h+='<p class="hint">Bonus Wzmocnienie towarzysza z ekwipunku (obecnie '+PCT(r1(s.A.wzmtow))+') zwiększa te wartości.</p></div></div>';
  return h;
}
function panelMats(){
  let h='<div class="sec"><h3>Materiały i ulepszacze</h3><div class="mats">';
  MATORDER.forEach(k=>{const n=S.mat[k]||0;h+='<div class="mat '+(n?'':'zero')+'">'+matIcon(k,'slot sm" style="border:0;background:none;width:34px;height:34px')+'<div><b>'+MATS[k].n+'</b><small>'+MATS[k].d+'</small></div><span class="n num">'+n+'</span></div>';});
  return h+'</div></div>';
}
function renderContent(){
  const c=$('content');const st=c.scrollTop;
  const m=U.main,sb=U.sub[m];
  const fn=m==='walka'?panelWalka:m==='plecak'?panelBag:m==='mapa'?panelMapa:m==='postac'?{eq:panelEq,guide:panelGuide,skills:panelSkills,comp:panelComp}[sb]:{shop:panelShop,kowal:panelKowal}[sb];
  c.innerHTML=fn();c.scrollTop=st;U.dirty=false;
}

/* ---------- okno przedmiotu ---------- */
U.sheetTab='bon';U.goal='exp';U.sum={sz:0,k:0,by:{},mat:{},t:Date.now()};U.sumOpen=false;
function pips(b){let s='';for(let i=0;i<5;i++)s+='<i class="'+(i<=b?'on':'')+'"></i>';return '<span class="pips5 q'+b+'" title="Jakość: '+(b+1)+' / 5">'+s+'</span>';}
function isReco(k,master){const g=GOALS[U.goal];return master?g.m.includes(k):g.top.slice(0,4).includes(k);}
function sheetHtml(it){
  const col=tcol(it.tier);
  const eqd=S.eq[it.slot]===it.id;
  const err=canEquip(it);
  const tab=U.sheetTab;
  let h='<button class="btn ghost x" data-act="closesheet" aria-label="Zamknij">✕</button>';
  h+='<div class="hd"><div class="slot has" id="sheettile" style="--tc:'+col+'">'+itemIcon(it.slot,it.tier,it.wtype)+(it.up>0?'<span class="up">+'+it.up+'</span>':'')+'</div><div><div class="nm" style="color:'+col+'">'+esc(itemName(it))+(it.up>0?' +'+it.up:'')+'</div>'+
    '<div class="req '+(S.level<CFG.tierMinLevel[it.tier-1]?'bad':'')+'">Od poziomu '+CFG.tierMinLevel[it.tier-1]+' · <span class="tag" style="--tc:'+col+'">Set '+SETS[it.tier-1].n+'</span></div></div></div>';
  h+='<div class="stabs">'+[['bon','Bonusy'],['up','Ulepszanie'],['set','Set']].map(t=>'<button class="stab '+(tab===t[0]?'on':'')+'" data-act="stab" data-id="'+t[0]+'">'+t[1]+'</button>').join('')+'</div>';
  h+='<div class="sbody">';
  if(tab==='bon'){
    if(it.slot==='weapon'){
      const a=weaponAtk(it),w=WEAPONS[it.wtype];
      h+='<div class="stat base"><span>Atak</span><b class="num">'+fmt(a*0.85)+' – '+fmt(a*1.15)+'</b></div><div class="stat base"><span>Tempo ('+w.n+')</span><b class="num">'+cm(w.tempo)+' / s</b></div>';
    }
    const bl=builtins(it);
    if(bl.length){h+='<div class="grp-t">Wbudowane <small>rosną z ulepszaniem</small></div>';
      bl.forEach(b=>{h+='<div class="stat built '+(b.on?'':'lockd')+'"><span>'+esc(bonLine(b.k,b.v))+'</span><span class="dim" style="font-size:11px">'+(b.at>0?(b.on?'':'od +'+b.at):'')+'</span></div>';});}
    h+='<div class="goalrow"><span>Cel:</span>'+Object.keys(GOALS).map(g=>'<button class="gchip '+(U.goal===g?'on':'')+'" data-act="goal" data-id="'+g+'">'+GOALS[g].n+'</button>').join('')+'</div>';
    const grp=(arr,max,cls2,master,label)=>{
      let s='<div class="grp-t">'+label+' <small>'+arr.length+' / '+max+'</small></div><div data-grp="'+(master?'m':'n')+'">';
      arr.forEach((x,i)=>{
        const v=master?mVal(x.k,x.b,it.tier):bonVal(x.k,x.b,it.tier);
        s+='<div class="stat bonrow '+cls2+(isPerfect(x.b)?' perfect':'')+'" data-i="'+i+'"><span>'+esc(BON[x.k].n)+(isReco(x.k,master)?'<em class="rec">polecany</em>':'')+'</span>'+pips(x.b)+'<b class="num">'+PCT(v)+'</b></div>';
      });
      for(let i=arr.length;i<max;i++)s+='<div class="stat dim emptyrow"><span>wolny slot</span></div>';
      return s+'</div>';
    };
    const m=(k)=>S.mat[k]||0;
    h+=grp(it.bon,CFG.maxBon,'nb',false,'Bonusy 1–5');
    h+='<div class="btns two"><button class="btn" data-act="reroll" data-id="'+it.id+'" data-m="0" '+(m('zmieniacz')<1||!it.bon.length?'disabled':'')+'><span>⟳ Zmień bonusy</span><small>zmieniacz: '+m('zmieniacz')+'</small></button>'+
      '<button class="btn" data-act="addbon" data-id="'+it.id+'" data-m="0" '+(m('dodatek')<1||it.bon.length>=CFG.maxBon?'disabled':'')+'><span>+ Dodaj bonus</span><small>dodatek: '+m('dodatek')+'</small></button></div>';
    h+=grp(it.mbon,CFG.maxMaster,'mb',true,'Bonusy 6–7 mistrzowskie');
    h+='<div class="btns two"><button class="btn ghost" data-act="reroll" data-id="'+it.id+'" data-m="1" '+(m('zmieniaczM')<1||!it.mbon.length?'disabled':'')+'><span>⟲ Zmień 6–7</span><small>zmieniacz m.: '+m('zmieniaczM')+'</small></button>'+
      '<button class="btn ghost" data-act="addbon" data-id="'+it.id+'" data-m="1" '+(m('dodatekM')<1||it.mbon.length>=CFG.maxMaster?'disabled':'')+'><span>⊕ Dodaj 6–7</span><small>dodatek m.: '+m('dodatekM')+'</small></button></div>';
    h+='<p class="hint">Kropki pokazują jakość bonusu (5 = perfekt). „Polecany” oznacza bonus pasujący do wybranego celu.</p>';
  }else if(tab==='up'){
    if(it.up>=9)h+='<div class="card muted">Maksymalny poziom ulepszenia.</div>';
    else{
      const ch=CFG.upChance[it.up],fee=upgradeFee(it);
      h+='<div class="grp-t">Ulepszanie <small>+'+it.up+' → +'+(it.up+1)+'</small></div>';
      h+='<div class="chance">Szansa <b>'+Math.round(ch*100)+'%</b> · opłata '+price(fee,S.szardy>=fee)+'</div>';
      h+='<div class="btns two"><button class="btn" data-act="up" data-id="'+it.id+'" data-p="0" '+((S.mat.kamien||0)<1?'disabled':'')+'><span>Kamień ulepszenia</span><small>masz: '+(S.mat.kamien||0)+'</small></button><button class="btn ghost" data-act="up" data-id="'+it.id+'" data-p="1" '+((S.mat.ochronny||0)<1?'disabled':'')+'><span>Kamień ochronny</span><small>masz: '+(S.mat.ochronny||0)+'</small></button></div>';
      h+='<p class="hint">'+(it.up>0?'Przy porażce zwykły kamień obniża poziom o 1, ochronny zostawia go bez zmian.':'Na +0 porażka nie obniża poziomu.')+'</p>';
    }
    if(it.tier<6){
      const fee=convFee(it),ch=CFG.convChance[it.tier-1];
      h+='<div class="grp-t">Przerabianie na Set '+SETS[it.tier].n+'</div><div class="chance">Szansa <b>'+Math.round(ch*100)+'%</b> · opłata '+price(fee,S.szardy>=fee)+'</div><p class="hint">Bonusy zostają (przedział się zachowuje), nowy element zaczyna od +1.</p><div class="btns"><button class="btn" data-act="convert" data-id="'+it.id+'" '+((S.mat.przemiany||0)<1?'disabled':'')+'><span>Przerób</span><small>kamień przemiany: '+(S.mat.przemiany||0)+'</small></button></div>';
    }
  }else{
    const sc=setCounts();
    h+='<div class="stat sb"><span>Set '+SETS[it.tier-1].n+'</span><b class="num">'+sc[it.tier-1]+' / 8 założonych</b></div>';
    SETB[it.tier-1].forEach(t=>{h+='<div class="stat '+(sc[it.tier-1]>=t.n?'sb':'dim')+'" style="font-size:12.5px"><span>'+t.n+' elem.</span><span style="text-align:right">'+Object.keys(t.b).map(k=>bonLine(k,t.b[k])).join(', ')+'</span></div>';});
    h+='<div class="classes">'+Object.keys(CLASSES).map(k=>'<span class="cls '+(it.slot!=='weapon'||CLASSES[k].weapons.includes(it.wtype)?'':'no')+'" title="'+CLASSES[k].n+'">'+CLASSES[k].ico+'</span>').join('')+'</div>';
  }
  h+='</div>';
  h+='<div class="sfoot">'+(eqd?'<button class="btn" data-act="unequip" data-id="'+it.id+'">Zdejmij</button>':'<button class="btn" data-act="equip" data-id="'+it.id+'" '+(err?'disabled':'')+'>Załóż</button>')+
    (eqd?'':'<button class="btn ghost" data-act="sell" data-id="'+it.id+'">Sprzedaj '+price(sellValue(it))+'</button>')+(err&&!eqd?'<span class="hint" style="color:var(--bad);flex-basis:100%">'+esc(err)+'</span>':'')+'</div>';
  return h;
}
function openSheet(id){U.sheet=id;U.sheetTab='bon';renderSheet();$('veil').classList.add('on');}
function closeSheet(){U.sheet=null;$('veil').classList.remove('on');U.dirty=true;}
function openBossPick(){U.sheet='boss';renderSheet();$('veil').classList.add('on');}
function bossPickHtml(){
  const now=Date.now(),cur=E?E.type:'mob';
  let h='<button class="x btn ghost" data-act="closesheet">✕</button><div class="nm" style="margin-bottom:10px">Wybierz bossa</div>';
  MAP1.bosses.forEach(b=>{
    const rdy=Math.max(0,Math.ceil(((S.bossReady[b.id]||0)-now)/1000)),fg=cur==='boss'&&E.def.id===b.id;
    h+='<div class="card" style="margin-bottom:8px"><div class="row2" style="align-items:center;gap:10px"><div style="width:56px;height:70px;flex:none">'+eThumb(b.svg)+'</div><div style="flex:1;min-width:0"><b style="font-family:var(--fh)">'+esc(b.n)+'</b><small class="muted" style="display:block">'+recText(b.lvRec)+' · '+fmt(b.hp)+' życia</small></div></div>'+
    '<div class="btns" style="margin-top:8px"><button class="btn" data-act="bosspick" data-id="'+b.id+'" '+(rdy>0||fg?'disabled':'')+'>'+(fg?'Walka trwa':rdy>0?'Odradza się '+Math.floor(rdy/60)+':'+String(rdy%60).padStart(2,'0'):'Walcz')+'</button></div></div>';
  });
  return h;
}
function renderSheet(){
  if(U.sheet==='boss'){const sh=$('sheet');sh.innerHTML=bossPickHtml();return;}
  const it=S.items[U.sheet];if(!it){closeSheet();return;}
  const sh=$('sheet'),st=sh.scrollTop;sh.innerHTML=sheetHtml(it);sh.scrollTop=st;
}
function flashTile(cls){
  const t=$('sheettile');if(!t||RM)return;
  const c=cls==='ok'?'#79c76a':cls==='bad'?'#e0654f':'#f5d58c';
  t.animate([{boxShadow:'0 0 0 0 '+c},{boxShadow:'0 0 28px 8px '+c,offset:.35},{boxShadow:'0 0 0 0 transparent'}],{duration:700});
  t.animate([{transform:'scale(1)'},{transform:'scale(1.12)',offset:.3},{transform:'scale(1)'}],{duration:500});
}
function rollAnim(id,master){
  const it=S.items[id];const arr=master?it.mbon:it.bon;
  const grp=document.querySelector('#sheet [data-grp="'+(master?'m':'n')+'"]');
  const rows=grp?[...grp.querySelectorAll('.stat[data-i]')]:[];
  rows.forEach(r=>r.classList.add('roll'));
  document.querySelectorAll('#sheet .btn[data-act="reroll"]').forEach(b=>b.disabled=true);
  const pool=master?MPOOL:POOL[it.slot];
  const iv=setInterval(()=>{rows.forEach(r=>{const k=pick(pool);r.firstElementChild.textContent=BON[k].n;r.lastElementChild.innerHTML='+'+cm(r1(Math.random()*20+2))+'%';});},70);
  const res=()=>{clearInterval(iv);const nb=reroll(id,master);U.dirty=true;renderSheet();
    if(nb){const g2=document.querySelector('#sheet [data-grp="'+(master?'m':'n')+'"]');const rr=g2?[...g2.querySelectorAll('.stat[data-i]')]:[];
      let pf=0;rr.forEach((r,i)=>{r.style.animationDelay=(i*70)+'ms';r.classList.add('pop');if(nb[i]&&isPerfect(nb[i].b)){pf++;r.classList.add('perf');}});
      const best=Math.max(...nb.map(x=>x.b));
      if(pf){flashTile('gold');banner(pf>1?'PERFEKT ×'+pf+'!':'PERFEKT!','Bonus');vib([15,30,15,30,40]);}
      else if(best>=3){flashTile('gold');hook('toast','Świetny bonus!');}
      else flashTile('ok');}};
  if(RM)res();else setTimeout(res,190);
}

/* ---------- zdarzenia ---------- */
function onClick(e){
  const b=e.target.closest&&e.target.closest('[data-act]');
  if(!b)return;
  const a=b.dataset.act,id=b.dataset.id;
  switch(a){
    case 'nav':nav(id);break;
    case 'stab':U.sheetTab=id;renderSheet();break;
    case 'goal':U.goal=id;if(U.sheet)renderSheet();else renderContent();break;
    case 'tab':U.sub[U.main]=id;renderTabs();renderContent();break;
    case 'actsel':S.actSel=id;nav('mapa');break;
    case 'chip':if(id==='hunt'){abandon();S.actSel='hunt';U.dirty=true;renderNav();renderContent();}else if(id==='boss'){openBossPick();}else{if(id==='mono')startMonolith();else startDungeon();U.dirty=true;renderNav();renderContent();}break;
    case 'bosspick':startBoss(id);closeSheet();U.dirty=true;renderNav();renderContent();break;
    case 'lootT':U.sumOpen=!U.sumOpen;renderContent();break;
    case 'lootReset':U.sum={sz:0,k:0,by:{},mat:{},t:Date.now()};renderContent();break;
    case 'autobuy':if(buyAuto(id))hook('toast','Kupiono autouzywanie.');U.dirty=true;renderHud();renderSkillsBar();renderContent();break;
    case 'autotog':toggleAuto(id);U.dirty=true;renderSkillsBar();renderContent();break;
    case 'item':openSheet(+id);break;
    case 'empty':hook('toast','Pusty slot: '+SLOTN[b.dataset.slot]+'. Kup element w Mieście, w zakładce Sklep.');nav('miasto','shop');break;
    case 'closesheet':closeSheet();break;
    case 'equip':equip(+id);renderSheet();U.dirty=true;renderHud();hook('toast','Założono: '+itemName(S.items[+id]));break;
    case 'unequip':unequip(S.items[+id].slot);renderSheet();U.dirty=true;break;
    case 'sell':sell(+id);closeSheet();renderHud();break;
    case 'up':{const r=upgrade(+id,b.dataset.p==='1');if(r){renderSheet();flashTile(r.ok?'ok':'bad');hook('toast',r.ok?'Sukces! +'+r.to:'Porażka. '+(r.prot?'Poziom bez zmian (+'+r.to+')':'Poziom spadł do +'+r.to));U.dirty=true;renderHud();}break;}
    case 'reroll':{const m=b.dataset.m==='1',it=S.items[+id];if(!it)break;if((S.mat[m?'zmieniaczM':'zmieniacz']||0)<1||!(m?it.mbon:it.bon).length)break;rollAnim(+id,m);break;}
    case 'addbon':{const m=b.dataset.m==='1',r=addBon(+id,m);if(r){renderSheet();const g=document.querySelector('#sheet [data-grp="'+(m?'m':'n')+'"]');if(g){const rows=g.querySelectorAll('.stat[data-i]');rows[rows.length-1].classList.add('flash');}if(isPerfect(r.b)){flashTile('gold');hook('toast','Perfekt bonus!');}U.dirty=true;}break;}
    case 'convert':{const r=convert(+id);if(r){renderSheet();flashTile(r.ok?'gold':'bad');hook('toast',r.ok?'Przerobiono na Set '+SETS[r.tier-1].n+'!':'Przerabianie nieudane. Materiały zużyte.');U.dirty=true;renderHud();}break;}
    case 'hunt':abandon();S.actSel='hunt';U.dirty=true;nav('walka');break;
    case 'mono':startMonolith();U.dirty=true;nav('walka');break;
    case 'boss':startBoss(id);U.dirty=true;nav('walka');break;
    case 'dung':startDungeon();U.dirty=true;nav('walka');break;
    case 'buy':{const it=buyItem(b.dataset.slot,b.dataset.w||null);if(it){hook('toast','Kupiono: '+itemName(it));renderHud();U.dirty=true;}break;}
    case 'buymat':buyMat(id);renderHud();U.dirty=true;break;
    case 'craft':if(craft(id)){hook('toast','Wytworzono.');renderHud();U.dirty=true;}break;
    case 'sklock':{const r=Object.values(SKROLE)[+b.dataset.i];hook('toast',S.path?'Odblokuje się na poziomie '+r.lvl+'.':'Najpierw wybierz ścieżkę u trenera (poziom 5): Postać → Umiejętności.');if(!S.path&&S.level>=5)nav('postac','skills');e.stopPropagation();break;}
    case 'skill':useSkill(+b.dataset.i);e.stopPropagation();break;
    case 'path':choosePath(id);renderHud();renderSkillsBar();renderTabs();renderNav();U.dirty=true;break;
    case 'rank':rankUp(id);renderTabs();U.dirty=true;break;
    case 'dev':devAct(id);break;
  }
}

/* ---------- narzędzia testowe ---------- */
function devHtml(){
  return '<b style="font-size:12px">Narzędzia testowe</b>'+
  [['szardy','+10 kSzardów'],['mats','+10 każdego ulepszacza'],['lv','Poziom +1'],['cap','Limit poziomu: '+(S.unlockCap?'50':'8')],['demo','Stan demonstracyjny'],['reset','Reset gry']].map(x=>'<button class="btn ghost" data-act="dev" data-id="'+x[0]+'">'+x[1]+'</button>').join('');
}
function devAct(id){
  if(id==='szardy')S.szardy+=10000;
  else if(id==='mats')MATORDER.forEach(k=>S.mat[k]=(S.mat[k]||0)+10);
  else if(id==='lv'){S.level=Math.min(CFG.designCap,S.level+1);S.pts++;S.unlockCap=S.unlockCap||S.level>CFG.levelCap;dirty();hook('levelUp',S.level);}
  else if(id==='cap'){S.unlockCap=!S.unlockCap;}
  else if(id==='demo')demoState();
  else if(id==='reset'){if(confirm('Zresetować grę?')){resetAll();}}
  dirty();save();$('dev').innerHTML=devHtml();fullRender();
}
function demoState(){
  resetAll();
  S.level=6;S.xp=40;S.pts=2;S.path='sila';S.szardy=2450;
  S.mat.kamien=14;S.mat.ochronny=3;S.mat.zmieniacz=5;S.mat.dodatek=6;S.mat.odlamek=7;S.mat.znak=3;S.mat.perla=1;S.mat.przepustka=1;S.mat.przemiany=1;S.mat.rdzen=2;
  S.comp.lvl=3;S.comp.xp=12;
  const mk=(slot,up,nb,wt)=>{const it=mkItem(slot,1,wt);it.up=up;it.bon=rollBons(slot,nb,false);S.eq[slot]=it.id;return it;};
  const w=mk('weapon',4,3,'miecz1h');w.bon[0].b=4;w.mbon=rollBons('weapon',1,true);
  mk('armor',3,2);mk('helmet',5,3);mk('shield',2,2);mk('boots',3,2);mk('neck',1,1);
  const extra=mkItem('earrings',1,'');S.inv.push(extra.id);
  const e2=mkItem('bracelet',1);e2.bon=rollBons('bracelet',2,false);S.inv.push(e2.id);
  const cl=mkItem('weapon',1,'miecz2h');S.inv.push(cl.id);
  S.kills=17;dirty();spawnMob();
}

/* ---------- start i pętla ---------- */
function fullRender(){renderHud();renderNav();renderTabs();renderSkillsBar();renderBuffs();renderContent();swordGlow();if(U.sheet)renderSheet();}
let lastT=0;
function loop(now){
  const dt=Math.min(0.25,(now-lastT)/1000||0);lastT=now;
  tick(dt);frameTarget();frameSkills();
  if(U.combo&&Date.now()-U.comboT>1300){U.combo=0;$('combo').classList.remove('on');}
  if(now-U.lastSlow>200){U.lastSlow=now;renderHud();renderBuffs();if(U.dirty){renderActs();renderTabs();if(!U.sheet)renderContent();else{renderSheet();}U.dirty=false;swordGlow();}}
  if(now-U.lastAct>1000){U.lastAct=now;if((U.main==='mapa'||U.main==='walka')&&!U.sheet){renderContent();renderNav();}}
  requestAnimationFrame(loop);
}
function init(){
  load();setupScene();
  if(!E)spawnMob();
  $('scene').addEventListener('pointerdown',e=>{if(e.target.closest('.sk'))return;click();});
  $('scene').addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();click();}});
  document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;if(e.key>='1'&&e.key<='3')useSkill(+e.key-1);if(e.key==='Escape')closeSheet();});
  document.body.addEventListener('click',onClick);
  $('veil').addEventListener('click',e=>{if(e.target.id==='veil')closeSheet();});
  document.body.addEventListener('input',e=>{if(e.target.dataset&&e.target.dataset.act==='share'){setShare(+e.target.value);const sv=$('sharev');if(sv)sv.textContent=S.comp.share+'%';const h=e.target.parentNode.querySelector('.hint');if(h)h.textContent='Z każdego zdobytego XP '+S.comp.share+'% idzie do towarzysza, a reszta do bohatera. Przy 0% towarzysz zostaje na swoim poziomie, bez kary.';}});
  $('devbtn').addEventListener('click',()=>{const d=$('dev');d.classList.toggle('on');d.innerHTML=devHtml();});
  $('app').dataset.tab='walka';
  fullRender();
  setInterval(save,5000);
  requestAnimationFrame(loop);
}
