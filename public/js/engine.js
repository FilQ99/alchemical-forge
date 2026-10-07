/* =====================================================================
   SILNIK: stan, statystyki, walka, drop, ulepszanie, bonusy
   ===================================================================== */
const LSKEY='kamien-cienia-ekran-v1';
const UI={};   // haki interfejsu (uzupełnia ui.js)
const hook=(n,...a)=>{try{UI[n]&&UI[n](...a);}catch(e){console.error(n,e);}};
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const tpow=t=>Math.pow(CFG.tierMul,t-1);

function fmt(n){
  n=Math.floor(n);if(n<1000)return String(n);
  const u=['k','kk','kkk','kkkk'];let i=-1,v=n;
  while(v>=1000&&i<3){v/=1000;i++;}
  const s=(v>=100?v.toFixed(0):v>=10?v.toFixed(1):v.toFixed(2));
  return String(parseFloat(s)).replace('.',',')+u[i];
}
const r1=x=>Math.round(x*10)/10;

function newState(){
  return {v:1,name:'Wędrowiec',kingdom:'marchia',cls:'wojownik',path:null,level:1,xp:0,pts:0,
    skills:{},szardy:300,
    mat:{kamien:6,ochronny:1,zmieniacz:3,dodatek:4,odlamek:0,znak:0,perla:0,rdzen:0,przepustka:0,przemiany:0,zmieniaczM:0,dodatekM:0},
    items:{},inv:[],eq:{},nid:1,
    comp:{lvl:1,xp:0,share:25},
    kills:0,cd:{},monoReady:0,bossReady:{b1:0,b2:0,b3:0},buffEnd:{},
    auto:{},actSel:'hunt',unlockCap:false,mute:true};
}
let S=newState();
let E=null;                // aktualne starcie
let lastClick=0,autoAcc=0,ST=null;
const dirty=()=>{ST=null;};

/* ---------- przedmioty ---------- */
function mkItem(slot,tier,wtype){
  const it={id:S.nid++,slot,tier,up:0,wtype:slot==='weapon'?wtype:null,bon:[],mbon:[]};
  S.items[it.id]=it;return it;
}
function itemName(it){
  if(it.slot==='weapon')return WNAMES[it.tier][it.wtype];
  if(NAMES[it.tier][it.slot])return NAMES[it.tier][it.slot];
  return SLOTN[it.slot]+' '+BADJ[it.tier-1].toLowerCase();
}
const bonVal=(k,b,tier)=>r1(BON[k].b[b]*tpow(tier));
const mVal=(k,b,tier)=>r1(BON[k].b[b]*CFG.masterMul*tpow(tier));
function pickBand(){const w=[40,30,18,9,3];let r=Math.random()*100,i=0;for(;i<4;i++){r-=w[i];if(r<0)break;}return i;}
function builtins(it){
  const list=[];
  const tmpl=BUILTIN[it.slot];
  for(let i=0;i<4;i++){
    let e=tmpl[i];
    if(it.slot==='weapon'&&i===0){const s=WEAPONS[it.wtype].sig;e={k:s.k,v:s.v,at:0};}
    if(!e)continue;
    list.push({k:e.k,at:e.at,v:r1(e.v*tpow(it.tier)*(1+0.05*it.up)),on:it.up>=e.at});
  }
  return list;
}
function weaponAtk(it){return CFG.atkPerTier[it.tier-1]*WEAPONS[it.wtype].dmg*(1+CFG.atkUp*it.up);}
function rollBons(slot,n,master,keep){
  const used=new Set((keep||[]).map(x=>x.k));
  const pool=(master?MPOOL:POOL[slot]).filter(k=>!used.has(k));
  const out=[];
  for(let i=0;i<n&&pool.length;i++){
    const k=pool.splice(Math.floor(Math.random()*pool.length),1)[0];
    out.push({k,b:pickBand()});
  }
  return out;
}
function isPerfect(b){return b===4;}

/* ---------- statystyki ---------- */
function setCounts(){
  const c=[0,0,0,0,0,0];
  for(const sl of SLOTS){const it=S.items[S.eq[sl]];if(it)c[it.tier-1]++;}
  return c;
}
function classWeapons(){return CLASSES[S.cls].weapons;}
function equippedWeapon(){return S.items[S.eq.weapon]||null;}
function compBase(){return CFG.comp.base+CFG.comp.perLvl*(S.comp.lvl-1);}
function calcStats(){
  if(ST)return ST;
  const A={};for(const k in BON)A[k]=0;
  let klik=0,auto=0;
  for(const sl of ALLSLOTS){
    const it=S.items[S.eq[sl]];if(!it)continue;
    for(const b of builtins(it))if(b.on)A[b.k]+=b.v;
    for(const x of it.bon)A[x.k]+=bonVal(x.k,x.b,it.tier);
    for(const x of it.mbon)A[x.k]+=mVal(x.k,x.b,it.tier);
  }
  const sc=setCounts();
  SETB.forEach((tiers,i)=>{for(const t of tiers)if(sc[i]>=t.n)for(const k in t.b)A[k]+=t.b[k];});
  const kg=KINGDOMS[S.kingdom].bonus;
  A.krytyk+=kg.krytyk||0;A.skupienie+=kg.skupienie||0;klik+=kg.klik||0;auto+=kg.auto||0;
  // towarzysz (Siła -> moc, Szczęście -> szczęście, Tempo -> skupienie)
  const cb=compBase()*(1+A.wzmtow/100);
  const comp={moc:r1(cb),szczescie:r1(cb),skupienie:r1(cb*0.6)};
  A.moc+=comp.moc;A.szczescie+=comp.szczescie;A.skupienie+=comp.skupienie;
  // aktywne wzmocnienie ze skilli
  const now=Date.now();let buffMoc=0;
  const sk=skillList()[1];
  if(sk&&(S.buffEnd[sk.id]||0)>now)buffMoc=SKROLE.wzmocnienie.buff*(1+(skRank(sk.id)-1)*0.1);
  A.moc+=buffMoc;
  const cap=CFG.caps;
  const krytyk=Math.min(A.krytyk,cap.krytyk+CFG.critBase*0+0);
  const stats={A,klik,auto,comp,buffMoc,
    krytyk:CFG.critBase+Math.min(A.krytyk,cap.krytyk),
    skupienie:Math.min(A.skupienie,cap.skupienie),
    szybkosc:Math.min(A.szybkosc,cap.szybkosc),
    podwojny:Math.min(A.podwojny,cap.podwojny),
    szczescie:Math.min(A.szczescie,cap.szczescie)};
  const w=equippedWeapon();
  stats.wtype=w?w.wtype:null;
  stats.tempo=w?WEAPONS[w.wtype].tempo:1.0;
  stats.atk=w?weaponAtk(w):2;
  stats.base=CFG.lvBase+CFG.lvStep*S.level+stats.atk;
  stats.hit=stats.base*(1+A.moc/100);
  ST=stats;return stats;
}
function clickDmg(){const s=calcStats();return s.hit*(1+s.klik/100)*s.tempo;}
function autoDmg(){const s=calcStats();return s.hit*(1+s.auto/100);}
function autoInterval(){const s=calcStats();return 1/(s.tempo*(1+s.szybkosc/100));}
function critMul(){return CFG.critMulBase+calcStats().A.skrytyka/100;}
function power(){const s=calcStats();return s.hit*(1+s.krytyk/100*(critMul()-1))*s.tempo*5; } // orientacyjne dmg/s przy ~5 klik/s

/* ---------- umiejętności ---------- */
const ROLES=['uderzenie','wzmocnienie','finisher'];
function pathKey(){return S.path?S.cls+'.'+S.path:null;}
function skillList(){
  const pk=pathKey();if(!pk)return [];
  return PATHSK[pk].map((x,i)=>({id:pk+'.'+ROLES[i],role:ROLES[i],name:x[0],glyph:x[1],lvl:SKROLE[ROLES[i]].lvl}));
}
const skRank=id=>S.skills[id]||1;
const skUnlocked=sk=>S.level>=sk.lvl;
function skCd(sk){return SKROLE[sk.role].cd*(1-calcStats().skupienie/100);}
function skReadyIn(sk){return Math.max(0,((S.cd[sk.id]||0)-Date.now())/1000);}
function useSkill(i){
  const sk=skillList()[i];if(!sk||!skUnlocked(sk)||!E)return false;
  if(skReadyIn(sk)>0)return false;
  const s=calcStats(),R=SKROLE[sk.role],rk=skRank(sk.id);
  S.cd[sk.id]=Date.now()+skCd(sk)*1000;
  if(sk.role==='wzmocnienie'){
    S.buffEnd[sk.id]=Date.now()+R.dur*1000;dirty();hook('skillFx',sk,0);return true;
  }
  const isB=E.type==='boss'||E.type==='mini'&&false||(E.type==='dung'&&E.isBoss);
  let d=s.hit*R.mult*(1+(rk-1)*0.15)*(1+s.A.umi/100)*vsMul();
  if(sk.role==='finisher'&&isBossEnc())d*=1.5;
  dealDamage(d,{skill:sk});hook('skillFx',sk,d);return true;
}
function isBossEnc(){return E&&(E.type==='boss'||(E.type==='dung'&&E.isBoss));}
function vsMul(){const s=calcStats();return 1+(isBossEnc()?s.A.lboss:s.A.lpot)/100;}

/* ---------- walka ---------- */
function xpNeed(L){return Math.round(CFG.xpBase*Math.pow(CFG.xpGrow,L-1));}
function levelCap(){return S.unlockCap?CFG.designCap:CFG.levelCap;}
function mobForLevel(){
  const c=MAP1.mobs.filter(m=>S.level>=m.lv[0]&&S.level<=m.lv[1]);
  return pick(c.length?c:[MAP1.mobs[MAP1.mobs.length-1]]);
}
function setEnc(e){E=e;E.spawnAt=Date.now()+CFG.spawnDelay*1000;hook('spawn');}
function spawnMob(){
  const d=mobForLevel();
  setEnc({type:'mob',def:d,hp:d.hp,max:d.hp});
}
function spawnMini(){const d=MAP1.mini;setEnc({type:'mini',def:d,hp:d.hp,max:d.hp});hook('toast','Pojawił się mini-boss: '+d.n+'!');}
function representativeHp(){return mobForLevel().hp;}
function startMonolith(){
  const now=Date.now();
  if(now<S.monoReady){hook('toast','Monolit się odnawia.');return;}
  if(S.level<MAP1.monolith.lvRec-1&&!S.unlockCap&&S.level<2){}
  const d=MAP1.monolith;const hp=Math.ceil(representativeHp()*d.hpMul);
  S.monoReady=now+CFG.monolithCd*1000;
  setEnc({type:'mono',def:d,hp,max:hp});save();
}
function startBoss(id){
  const d=MAP1.bosses.find(b=>b.id===id);if(!d)return;
  if(Date.now()<(S.bossReady[id]||0)){hook('toast',d.n+' jeszcze się nie odrodził.');return;}
  setEnc({type:'boss',def:d,hp:d.hp,max:d.hp,timeLeft:CFG.bossTime});
}
function startDungeon(){
  if((S.mat.przepustka||0)<1){hook('toast','Potrzebujesz Przepustki do dungeonu.');return;}
  S.mat.przepustka--;
  enterDungeonStage(0,CFG.dungeonTime);save();
}
function enterDungeonStage(i,tl){
  const st=MAP1.dungeon.stages[i];
  if(st.kind==='horde'){
    const d=MAP1.mobs[2];
    setEnc({type:'dung',def:d,hp:d.hp,max:d.hp,stage:i,left:st.count,timeLeft:tl,isBoss:false});
  }else{
    setEnc({type:'dung',def:st,hp:st.hp,max:st.hp,stage:i,left:1,timeLeft:tl,isBoss:st.kind==='boss'});
  }
}
function dealDamage(d,info){
  if(!E)return;
  if(E.spawnAt&&Date.now()<E.spawnAt)return;
  d=Math.max(1,Math.round(d));
  E.hp-=d;
  hook('hit',d,info||{});
  if(E.hp<=0)kill();
}
function doHit(kind){
  const s=calcStats();
  let d=(kind==='click'?clickDmg():autoDmg())*vsMul();
  let crit=Math.random()*100<s.krytyk;
  if(crit)d*=critMul();
  const e=E;
  dealDamage(d,{crit,kind});
  if(E===e&&E&&E.hp>0&&Math.random()*100<s.podwojny){
    let d2=(kind==='click'?clickDmg():autoDmg())*vsMul();
    const c2=Math.random()*100<s.krytyk;if(c2)d2*=critMul();
    dealDamage(d2,{crit:c2,kind,second:true});
  }
}
function click(){lastClick=performance.now();autoAcc=0;if(E)doHit('click');}

function gainXp(x){
  const sh=S.comp.share/100;
  let hx=x*(1-sh),cx=x*sh;
  if(S.level<levelCap()){S.xp+=hx;}
  while(S.level<levelCap()&&S.xp>=xpNeed(S.level)){
    S.xp-=xpNeed(S.level);S.level++;S.pts++;dirty();hook('levelUp',S.level);
  }
  if(S.level>=levelCap())S.xp=Math.min(S.xp,xpNeed(S.level)-1);
  if(S.comp.lvl<CFG.comp.max){
    S.comp.xp+=cx;
    while(S.comp.lvl<CFG.comp.max&&S.comp.xp>=Math.round(CFG.comp.xpBase*Math.pow(CFG.comp.xpGrow,S.comp.lvl-1))){
      S.comp.xp-=Math.round(CFG.comp.xpBase*Math.pow(CFG.comp.xpGrow,S.comp.lvl-1));S.comp.lvl++;dirty();hook('toast','Towarzysz awansował na poziom '+S.comp.lvl+'.');
    }
  }
}
function addMat(k,n){S.mat[k]=(S.mat[k]||0)+n;}
function dropRoll(table,luck){
  // table: {mat:[min,max]} ; zwraca listę {k,n}
  const out=[];
  for(const k in table){const r=table[k];out.push({k,n:rnd(r[0],r[1])});}
  return out;
}
function kill(){
  const e=E,d=e.def,s=calcStats();
  const luck=1+s.szczescie/100;
  const drops=[];
  let sz=d.sz*(1+s.A.chciwosc/100),xp=d.xp*(1+s.A.madrosc/100);
  const chance=(p)=>Math.random()<p*luck;
  const give=(k,n)=>{if(n>0){addMat(k,n);drops.push({k,n});}};
  let next='mob';
  if(e.type==='mob'){
    for(const k in CFG.mobDrops)if(chance(CFG.mobDrops[k]))give(k,1);
    S.kills++;
    if(S.kills%CFG.minibossEvery===0)next='mini';
  }else if(e.type==='mini'){
    for(const k in d.drops)give(k,rnd(d.drops[k][0],d.drops[k][1]));
    if(chance(d.perla))give('perla',1);
  }else if(e.type==='mono'){
    for(const k in d.drops)give(k,rnd(d.drops[k][0],d.drops[k][1]));
    if(chance(d.przepustka))give('przepustka',1);
    if(chance(d.perla))give('perla',1);
  }else if(e.type==='boss'){
    for(const k in d.drops)give(k,rnd(d.drops[k][0],d.drops[k][1]));
    if(chance(d.perla))give('perla',1);
    if(d.przepustka&&chance(d.przepustka))give('przepustka',1);
    S.bossReady[d.id]=Date.now()+CFG.bossRespawn*1000;
  }else if(e.type==='dung'){
    sz=d.sz?sz:sz;
    const st=MAP1.dungeon.stages[e.stage];
    e.left--;
    if(e.left>0){
      // kolejny szkielet w hordzie
      S.szardy+=Math.floor(sz);gainXp(xp);hook('kill',d,Math.floor(sz),[]);
      e.hp=e.max;hook('spawn');return;
    }
    if(e.stage<MAP1.dungeon.stages.length-1){
      S.szardy+=Math.floor(sz);gainXp(xp);hook('kill',d,Math.floor(sz),[]);
      enterDungeonStage(e.stage+1,e.timeLeft);return;
    }
    // koniec dungeonu
    const dr=MAP1.dungeon.drops;
    for(const k in dr)give(k,rnd(dr[k][0],dr[k][1]));
    sz+=800;
  }
  const szi=Math.floor(sz);
  S.szardy+=szi;gainXp(xp);
  hook('kill',d,szi,drops);
  if(e.type==='boss'||e.type==='dung')hook('toast','Pokonano: '+d.n+'!');
  if(next==='mini')spawnMini();else spawnMob();
  save();
}
function abandon(){ // wróć do polowania
  if(E&&E.type!=='mob'&&E.type!=='mini'){spawnMob();}
}
function tickEnc(dt){
  if(!E)return;
  if(E.timeLeft!=null){
    E.timeLeft-=dt;
    if(E.timeLeft<=0){
      hook('toast',E.type==='dung'?'Czas minął. Wyprawa nieudana.':'Czas minął. '+E.def.n+' ucieka.');
      spawnMob();
    }
  }
}
function autoPrice(i){return CFG.autoSkillPrice[i]||CFG.autoSkillPrice[CFG.autoSkillPrice.length-1];}
function buyAuto(id){
  const list=skillList(),i=list.findIndex(s=>s.id===id);if(i<0||S.auto[id])return false;
  const p=autoPrice(i);if(S.szardy<p){hook('toast','Za mało Szardów.');return false;}
  S.szardy-=p;S.auto[id]=1;save();return true;
}
function toggleAuto(id){if(S.auto[id])S.auto[id]=S.auto[id]===1?2:1;save();}
function tickAuto(){
  if(!E||(E.spawnAt&&Date.now()<E.spawnAt))return;
  const list=skillList();
  for(let i=0;i<list.length;i++){const sk=list[i];if(S.auto[sk.id]===1&&skUnlocked(sk)&&skReadyIn(sk)<=0)useSkill(i);}
}
function tick(dt){
  tickEnc(dt);
  tickAuto();
  if(!E)return;
  const idle=performance.now()-lastClick>CFG.autoIdleMs;
  if(idle){
    autoAcc+=dt;
    const iv=autoInterval();
    let guard=0;
    while(autoAcc>=iv&&E&&guard++<8){autoAcc-=iv;doHit('auto');}
  }else autoAcc=0;
  // wygaśnięcie wzmocnienia
  if(ST){const sk=skillList()[1];if(sk&&ST.buffMoc>0&&(S.buffEnd[sk.id]||0)<=Date.now())dirty();}
}

/* ---------- ekwipunek ---------- */
function canEquip(it){
  if(S.level<CFG.tierMinLevel[it.tier-1])return 'Wymaga poziomu '+CFG.tierMinLevel[it.tier-1]+'.';
  if(it.slot==='weapon'&&!classWeapons().includes(it.wtype))return 'Ta broń nie jest dla klasy '+CLASSES[S.cls].n+'.';
  return null;
}
function equip(id){
  const it=S.items[id];if(!it)return;
  const err=canEquip(it);if(err){hook('toast',err);return;}
  const cur=S.eq[it.slot];
  if(cur)S.inv.push(cur);
  S.inv=S.inv.filter(x=>x!==id);S.eq[it.slot]=id;dirty();save();
}
function unequip(slot){const id=S.eq[slot];if(!id)return;S.inv.push(id);delete S.eq[slot];dirty();save();}
function sellValue(it){return Math.round(shopPrice(it.slot,it.tier)*CFG.sellRate*(1+it.up*0.3));}
function sell(id){
  const it=S.items[id];if(!it)return;
  if(Object.values(S.eq).includes(id)){hook('toast','Najpierw zdejmij przedmiot.');return;}
  S.szardy+=sellValue(it);S.inv=S.inv.filter(x=>x!==id);delete S.items[id];save();
}
const unitPrice=(min,tier)=>Math.round(min*CFG.ipm*CFG.tierIncome[(tier||1)-1]);
function shopPrice(slot,tier){
  const m=BSLOTS.includes(slot)?CFG.price.bonusSlot:CFG.price.set*(slot==='weapon'?1.5:1);
  return unitPrice(m,tier);
}
function buyItem(slot,wtype){
  const p=shopPrice(slot,1);
  if(S.szardy<p){hook('toast','Za mało Szardów.');return null;}
  S.szardy-=p;const it=mkItem(slot,1,wtype);S.inv.push(it.id);save();return it;
}
function matPrice(k){return unitPrice(CFG.price[k],1);}
function buyMat(k){
  const p=matPrice(k);if(S.szardy<p){hook('toast','Za mało Szardów.');return;}
  S.szardy-=p;addMat(k,1);save();
}
function upgradeFee(it){return Math.round((1+0.3*it.up)*CFG.ipm*CFG.tierIncome[it.tier-1]);}
function upgrade(id,prot){
  const it=S.items[id];if(!it||it.up>=9)return null;
  const stone=prot?'ochronny':'kamien';
  if((S.mat[stone]||0)<1){hook('toast','Brak: '+MATS[stone].n+'.');return null;}
  const fee=upgradeFee(it);if(S.szardy<fee){hook('toast','Za mało Szardów na opłatę.');return null;}
  S.szardy-=fee;S.mat[stone]--;
  const ch=CFG.upChance[it.up];
  const ok=Math.random()<ch;
  const from=it.up;
  if(ok)it.up++;else if(!prot)it.up=Math.max(0,it.up-1);
  dirty();save();
  return {ok,from,to:it.up,prot};
}
function reroll(id,master){
  const it=S.items[id];if(!it)return null;
  const mk=master?'zmieniaczM':'zmieniacz',arr=master?it.mbon:it.bon;
  if(!arr.length){hook('toast','Przedmiot nie ma jeszcze bonusów tej grupy.');return null;}
  if((S.mat[mk]||0)<1){hook('toast','Brak: '+MATS[mk].n+'.');return null;}
  S.mat[mk]--;
  const nb=rollBons(it.slot,arr.length,master);
  if(master)it.mbon=nb;else it.bon=nb;
  dirty();save();return nb;
}
function addBon(id,master){
  const it=S.items[id];if(!it)return null;
  const mk=master?'dodatekM':'dodatek',arr=master?it.mbon:it.bon,max=master?CFG.maxMaster:CFG.maxBon;
  if(arr.length>=max){hook('toast','Maksymalna liczba bonusów w tej grupie.');return null;}
  if((S.mat[mk]||0)<1){hook('toast','Brak: '+MATS[mk].n+'.');return null;}
  const nb=rollBons(it.slot,1,master,arr);
  if(!nb.length){hook('toast','Brak wolnych bonusów w puli.');return null;}
  S.mat[mk]--;arr.push(nb[0]);dirty();save();return nb[0];
}
function convFee(it){return Math.round(CFG.convFeeMin*CFG.ipm*CFG.tierIncome[it.tier-1]);}
function convert(id){
  const it=S.items[id];if(!it||it.tier>=6)return null;
  if((S.mat.przemiany||0)<1){hook('toast','Potrzebujesz Kamienia przemiany.');return null;}
  const fee=convFee(it);if(S.szardy<fee){hook('toast','Za mało Szardów na opłatę.');return null;}
  S.szardy-=fee;S.mat.przemiany--;
  const ok=Math.random()<CFG.convChance[it.tier-1];
  if(ok){it.tier++;it.up=1;}
  dirty();save();return {ok,tier:it.tier};
}
const CRAFT={
  ochronny:{need:{odlamek:5},fee:4,out:'ochronny',n:1},
  przemiany:{need:{perla:3,odlamek:10,znak:5},fee:20,out:'przemiany',n:1},
  dodatekM:{need:{rdzen:3},fee:0,out:'dodatekM',n:1},
  zmieniaczM:{need:{rdzen:2},fee:0,out:'zmieniaczM',n:1}
};
function canCraft(id){
  const c=CRAFT[id];
  for(const k in c.need)if((S.mat[k]||0)<c.need[k])return false;
  return S.szardy>=craftFee(id);
}
const craftFee=id=>unitPrice(CRAFT[id].fee,1);
function craft(id){
  if(!canCraft(id)){hook('toast','Brakuje materiałów lub Szardów.');return false;}
  const c=CRAFT[id];
  for(const k in c.need)S.mat[k]-=c.need[k];
  S.szardy-=craftFee(id);addMat(c.out,c.n);save();return true;
}

/* ---------- umiejętności: punkty, ścieżka ---------- */
function choosePath(p){
  if(S.level<5||S.path)return;S.path=p;S.skills={};dirty();save();
}
function rankUp(id){
  const r=skRank(id);
  if(r>=5){hook('toast','Rangi 6–10 wymagają Księgi umiejętności (wkrótce).');return;}
  if(S.pts<1){hook('toast','Brak punktów umiejętności.');return;}
  S.pts--;S.skills[id]=r+1;save();
}

/* ---------- towarzysz ---------- */
function setShare(v){S.comp.share=clamp(Math.round(v),0,50);save();}

/* ---------- zapis ---------- */
function save(){try{localStorage.setItem(LSKEY,JSON.stringify(S));}catch(e){}}
function load(){
  try{
    const r=localStorage.getItem(LSKEY);
    if(r){const p=JSON.parse(r);const b=newState();S=Object.assign(b,p);S.mat=Object.assign(b.mat,p.mat||{});S.comp=Object.assign(b.comp,p.comp||{});S.bossReady=Object.assign(b.bossReady,p.bossReady||{});}
  }catch(e){}
  dirty();
}
function resetAll(){S=newState();dirty();E=null;save();spawnMob();}
