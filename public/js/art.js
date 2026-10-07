/* =====================================================================
   GRAFIKI: assety właściwe (ASSETS) + placeholdery SVG do podmiany.
   Aby podmienić placeholder, wpisz ścieżkę/adres obrazu w ASSETS.
   ===================================================================== */
const ASSETS={
  bg:'assets/bg.webp',
  hero:'assets/hero.webp',
  sword:'assets/sword.webp',
  bgDung:'assets/bg_dung.webp',
  enemies:{
 "wilk": "assets/e_wilk.webp",
 "mono": "assets/e_mono.webp",
 "alfa": "assets/e_alfa.webp",
 "szkielet": "assets/e_szkielet.webp",
 "b1": "assets/e_b1.webp",
 "kw": "assets/e_kw.webp",
 "b3": "assets/e_b3.webp",
 "b2": "assets/e_b2.webp",
 "dzik": "assets/e_dzik.webp",
 "ds1": "assets/e_b2.webp",
 "ds2": "assets/e_kw.webp"
},   // {id wroga: obraz} (patrzy w LEWO) – brak = placeholder SVG
  icons:{
 "boots_1": "assets/i_boots_1.webp",
 "weapon_wachlarz_1": "assets/i_weapon_wachlarz_1.webp",
 "talisman_1": "assets/i_talisman_1.webp",
 "belt_1": "assets/i_belt_1.webp",
 "weapon_dzwon_1": "assets/i_weapon_dzwon_1.webp",
 "helmet_1": "assets/i_helmet_1.webp",
 "neck_1": "assets/i_neck_1.webp",
 "armor_1": "assets/i_armor_1.webp",
 "shield_1": "assets/i_shield_1.webp",
 "weapon_miecz2h_1": "assets/i_weapon_miecz2h_1.webp",
 "amulet_1": "assets/i_amulet_1.webp",
 "weapon_sztylet_1": "assets/i_weapon_sztylet_1.webp",
 "earrings_1": "assets/i_earrings_1.webp",
 "bracelet_1": "assets/i_bracelet_1.webp",
 "weapon_miecz1h_1": "assets/i_weapon_miecz1h_1.webp",
 "weapon_luk_1": "assets/i_weapon_luk_1.webp"
},       // {'armor_1':..., 'weapon_miecz1h_1':...} – brak = placeholder SVG
  mats:{
 "ochronny": "assets/m_ochronny.webp",
 "zmieniacz": "assets/m_zmieniacz.webp",
 "odlamek": "assets/m_odlamek.webp",
 "perla": "assets/m_perla.webp",
 "zmieniaczM": "assets/m_zmieniaczM.webp",
 "dodatekM": "assets/m_dodatekM.webp",
 "znak": "assets/m_znak.webp",
 "rdzen": "assets/m_rdzen.webp",
 "przemiany": "assets/m_przemiany.webp",
 "przepustka": "assets/m_przepustka.webp",
 "kamien": "assets/m_kamien.webp",
 "dodatek": "assets/m_dodatek.webp"
},         // {klucz materiału: obraz}
  skills:{
 "Cios Przełamujący": "assets/s_0.webp",
 "Furia": "assets/s_4.webp",
 "Trzęsienie Ziemi": "assets/s_1.webp",
 "Tarczowy Cios": "assets/s_2.webp",
 "Niezłomność": "assets/s_5.webp",
 "Fala Woli": "assets/s_3.webp"
}      // {nazwa umiejętności: obraz}
};

const OL='#140d08';
function svgWrap(vb,inner,extra){return '<svg viewBox="'+vb+'" xmlns="http://www.w3.org/2000/svg" '+(extra||'')+'>'+inner+'</svg>';}

function boarSvg(o){o=o||{};
  const body=o.king?'#6a3a24':'#5a3a26',head=o.king?'#58301e':'#4b2f1f',eye=o.king?'#ff5a4a':'#e8b25a';
  let s='<g stroke="'+OL+'" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">';
  s+='<path d="M192 66 q20 -6 15 -24" fill="none" stroke="#33200f" stroke-width="6"/>';
  [[72,104],[94,106],[150,106],[172,104]].forEach(function(p){s+='<path d="M'+p[0]+' '+p[1]+' h13 l2 30 h-17z" fill="#33200f"/>';});
  s+='<path d="M52 78 C60 40 120 30 170 48 C198 58 206 90 190 108 L70 108 C58 102 52 92 52 78Z" fill="'+body+'"/>';
  s+='<path d="M80 44 l5 -16 6 15 6 -18 6 17 6 -18 6 17 6 -17 6 18 6 -14 6 15 6 -10" fill="#2e1a10"/>';
  [[96,34],[124,30],[150,36],[110,40]].forEach(function(p){s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="2.6" fill="#7a5c8e" stroke="none"/>';});
  s+='<path d="M54 70 C40 58 20 72 14 92 C12 100 22 110 40 108 C56 106 66 92 64 78Z" fill="'+head+'"/>';
  s+='<ellipse cx="18" cy="96" rx="12" ry="10" fill="#6b4a38"/><circle cx="14" cy="94" r="2" fill="#1a0f08" stroke="none"/>';
  s+='<path d="M52 66 l10 -22 9 22z" fill="#3b2517"/>';
  s+='<path d="M28 104 q-'+(o.king?18:12)+' -2 -'+(o.king?16:11)+' -'+(o.king?26:20)+'" fill="none" stroke="#d9cfb4" stroke-width="6"/>';
  s+='<circle cx="44" cy="78" r="3.6" fill="'+eye+'" stroke="none"/>';
  if(o.king)s+='<path d="M30 62 l4 -16 8 9 6 -13 7 13 8 -9 3 16z" fill="#e8b25a"/>';
  return svgWrap('0 0 220 140',s+'</g>');
}
function wolfSvg(o){o=o||{};
  const fur=o.big?'#6c6c74':'#7d7d82',eye=o.big?'#ff5a4a':'#e8b25a';
  let s='<g stroke="'+OL+'" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">';
  s+='<path d="M200 66 C232 54 240 84 214 100 C222 86 210 78 200 80Z" fill="#6a6a70"/>';
  [[78,98],[96,100],[160,100],[180,98]].forEach(function(p){s+='<path d="M'+p[0]+' '+p[1]+' h10 l2 36 h-14z" fill="#5a5a60"/>';});
  s+='<path d="M70 70 C90 40 170 40 200 62 L208 100 L68 100Z" fill="'+fur+'"/>';
  s+='<path d="M96 46 l6 -12 5 12 6 -14 6 14 6 -12 6 12" fill="#5d5d63"/>';
  s+='<path d="M72 62 C52 50 32 62 18 80 L10 94 C20 100 42 98 54 92 C68 86 76 76 72 62Z" fill="#8e8e94"/>';
  s+='<path d="M14 92 l6 8 4 -7 5 8 4 -8" fill="#f2ece0" stroke="none"/>';
  s+='<path d="M62 54 l4 -22 14 18z" fill="#6b6b72"/><path d="M76 56 l10 -18 6 20z" fill="#5d5d63"/>';
  s+='<circle cx="48" cy="72" r="3.4" fill="'+eye+'" stroke="none"/>';
  if(o.big)s+='<path d="M40 64 l12 14" stroke="#c8453a" stroke-width="3" fill="none"/>';
  return svgWrap('0 0 240 140',s+'</g>');
}
function skelSvg(o){o=o||{};
  const bone='#d9cfb4',bone2='#b8ad90';
  let s='<g stroke="'+OL+'" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">';
  if(o.king)s+='<ellipse cx="60" cy="90" rx="52" ry="86" fill="#7a5c8e" opacity=".28" stroke="none"/>';
  s+='<path d="M20 8 V196" stroke="#6b5237" stroke-width="5" fill="none"/><path d="M20 4 l-8 20 h16z" fill="#b8c0c8"/>';
  s+='<path d="M50 118 L42 190 M70 118 L80 190" stroke="'+bone2+'" stroke-width="8" fill="none"/><path d="M36 190 h14 M74 190 h14" stroke="'+bone2+'" stroke-width="7"/>';
  s+='<path d="M44 106 h32 l-4 16 h-24z" fill="'+bone2+'"/>';
  s+='<path d="M60 64 V110" stroke="'+bone2+'" stroke-width="7" fill="none"/>';
  for(let i=0;i<4;i++){const y=70+i*9;s+='<path d="M60 '+y+' q-26 -2 -26 8 M60 '+y+' q26 -2 26 8" stroke="'+bone+'" stroke-width="4.5" fill="none"/>';}
  s+='<path d="M44 66 L22 96 L20 104" stroke="'+bone2+'" stroke-width="7" fill="none"/>';
  s+='<path d="M76 66 L92 94 L84 112" stroke="'+bone2+'" stroke-width="7" fill="none"/>';
  s+='<circle cx="60" cy="36" r="21" fill="'+bone+'"/><path d="M46 52 h28 v8 h-28z" fill="'+bone2+'"/>';
  s+='<circle cx="52" cy="35" r="5.5" fill="#120a08"/><circle cx="68" cy="35" r="5.5" fill="#120a08"/>';
  s+='<circle cx="52" cy="35" r="2" fill="'+(o.king?'#c58cff':'#e8b25a')+'" stroke="none"/><circle cx="68" cy="35" r="2" fill="'+(o.king?'#c58cff':'#e8b25a')+'" stroke="none"/>';
  if(o.guard||o.king)s+='<path d="M38 28 C40 8 80 8 82 28 L76 26 C72 16 48 16 44 26z" fill="#6c7078"/>';
  if(o.guard)s+='<circle cx="88" cy="100" r="22" fill="#5a4630"/><circle cx="88" cy="100" r="7" fill="#9aa0a8"/><circle cx="88" cy="100" r="22" fill="none" stroke="#9aa0a8" stroke-width="3"/>';
  if(o.king)s+='<path d="M40 22 l4 -16 8 9 8 -13 8 13 8 -9 4 16z" fill="#c58cff"/>';
  return svgWrap('0 0 120 200',s+'</g>');
}
function witchSvg(){
  let s='<g stroke="'+OL+'" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">';
  s+='<path d="M24 14 V196" stroke="#5a4630" stroke-width="5" fill="none"/><circle cx="24" cy="12" r="9" fill="#7a5c8e"/><circle cx="24" cy="12" r="4" fill="#d6b8ff" stroke="none"/>';
  s+='<path d="M60 40 C34 70 24 130 22 192 L106 192 C100 130 90 70 60 40Z" fill="#3a2a4a"/>';
  s+='<path d="M60 40 C46 44 38 58 40 74 C50 84 70 84 80 74 C82 58 74 44 60 40Z" fill="#241830"/>';
  s+='<path d="M46 70 C56 80 66 80 76 70" stroke="#d9cfb4" stroke-width="2" fill="none"/>';
  s+='<circle cx="52" cy="62" r="3" fill="#e8b25a" stroke="none"/><circle cx="68" cy="62" r="3" fill="#e8b25a" stroke="none"/>';
  s+='<path d="M40 84 L20 130" stroke="#3a2a4a" stroke-width="9" fill="none"/>';
  s+='<path d="M96 40 q14 -8 22 0 q-8 2 -10 8z M10 56 q-8 -12 -2 -22 q4 8 10 10z" fill="#0f0a0c"/>';
  s+='<path d="M44 150 q16 8 32 0 M40 170 q20 10 40 0" stroke="#7a5c8e" stroke-width="2.5" fill="none"/>';
  return svgWrap('0 0 120 200',s+'</g>');
}
function monolithSvg(){
  let s='<defs><radialGradient id="mg" cx="50%" cy="55%" r="55%"><stop offset="0" stop-color="#c58cff" stop-opacity=".55"/><stop offset="1" stop-color="#c58cff" stop-opacity="0"/></radialGradient></defs>';
  s+='<ellipse cx="60" cy="110" rx="58" ry="92" fill="url(#mg)"/>';
  s+='<g stroke="'+OL+'" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">';
  s+='<path d="M30 192 L18 64 L46 12 L90 16 L104 72 L96 192Z" fill="#4a4350"/>';
  s+='<path d="M46 12 L58 72 L50 192 L30 192 L18 64Z" fill="#3a3441"/>';
  s+='<path d="M68 50 v26 m-8 -12 h16 M64 98 l8 12 l-8 12 M60 140 h16 M68 140 v22" stroke="#d6b8ff" stroke-width="3.5" fill="none"/>';
  s+='<path d="M90 16 L74 60 L84 90" stroke="#150f1a" stroke-width="2.5" fill="none"/></g>';
  return svgWrap('0 0 120 200',s);
}
function enemySvg(k){
  switch(k){
    case 'boar':return boarSvg();case 'boarKing':return boarSvg({king:1});
    case 'wolf':return wolfSvg();case 'wolfBig':return wolfSvg({big:1});
    case 'skel':return skelSvg();case 'skelGuard':return skelSvg({guard:1});case 'skelKing':return skelSvg({king:1,guard:0});
    case 'witch':return witchSvg();case 'monolith':return monolithSvg();
  }return '';
}

/* Ikony przedmiotów (placeholdery): kolor = kolor tieru */
function slotGlyph(slot,wtype){
  const g={
   armor:'<path d="M14 10 L20 8 Q24 13 28 8 L34 10 L41 19 L35 23 L35 40 L13 40 L13 23 L7 19Z"/><path d="M20 8 Q24 13 28 8" fill="none"/>',
   helmet:'<path d="M9 31 Q9 11 24 11 Q39 11 39 31 L39 36 L9 36Z"/><path d="M15 27 h18 v5 h-18z" fill="#000" fill-opacity=".5"/>',
   shield:'<circle cx="24" cy="24" r="16"/><circle cx="24" cy="24" r="5"/><path d="M24 9 V15 M24 33 V39 M9 24 H15 M33 24 H39" fill="none"/>',
   boots:'<path d="M16 9 H27 V27 L39 33 V40 H11 V30Z"/><path d="M16 17 H27" fill="none"/>',
   neck:'<path d="M10 10 Q24 38 38 10" fill="none"/><path d="M24 30 l6 6 -6 8 -6 -8z"/>',
   earrings:'<circle cx="17" cy="16" r="5" fill="none"/><circle cx="31" cy="16" r="5" fill="none"/><path d="M17 21 l-3 12 h6z M31 21 l-3 12 h6z"/>',
   bracelet:'<ellipse cx="24" cy="26" rx="15" ry="9"/><ellipse cx="24" cy="26" rx="9" ry="4.5" fill="#000" fill-opacity=".5"/>',
   amulet:'<path d="M14 6 Q24 20 34 6" fill="none"/><circle cx="24" cy="30" r="10"/><circle cx="24" cy="30" r="4" fill="#000" fill-opacity=".45"/>',
   belt:'<rect x="5" y="17" width="38" height="14" rx="3"/><rect x="19" y="14" width="10" height="20" rx="2" fill="none"/>',
   talisman:'<path d="M24 5 L40 24 L24 43 L8 24Z"/><path d="M24 15 v18 M17 24 h14" fill="none"/>'
  };
  const w={
   miecz1h:'<path d="M24 4 L28 10 L28 30 L20 30 L20 10Z"/><path d="M13 30 H35 M24 30 V42" fill="none"/><circle cx="24" cy="44" r="2.5"/>',
   miecz2h:'<path d="M24 2 L30 9 L30 30 L18 30 L18 9Z"/><path d="M10 30 H38 M24 30 V43" fill="none"/>',
   sztylet:'<path d="M24 7 L28 12 L26 28 H22 L20 12Z"/><path d="M15 28 H33 M24 28 V40" fill="none"/>',
   luk:'<path d="M14 6 Q40 24 14 42" fill="none"/><path d="M14 6 V42" fill="none"/><path d="M8 24 H30 M30 24 l-5 -4 M30 24 l-5 4" fill="none"/>',
   dzwon:'<path d="M12 34 Q12 12 24 10 Q36 12 36 34Z"/><circle cx="24" cy="38" r="3"/><path d="M24 4 V10" fill="none"/>',
   wachlarz:'<path d="M24 40 L6 16 Q24 4 42 16Z"/><path d="M24 40 L14 12 M24 40 L24 8 M24 40 L34 12" fill="none"/>'
  };
  return slot==='weapon'?(w[wtype]||w.miecz1h):g[slot]||'';
}
function itemIcon(slot,tier,wtype,cls){
  const key=slot==='weapon'?('weapon_'+wtype+'_'+tier):(slot+'_'+tier);
  if(ASSETS.icons[key])return '<img class="ico '+(cls||'')+'" src="'+ASSETS.icons[key]+'" alt="">';
  const col='var(--t'+tier+')';
  return '<svg class="ico '+(cls||'')+'" viewBox="0 0 48 48" style="color:'+col+'" fill="currentColor" fill-opacity=".28" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">'+slotGlyph(slot,wtype)+'</svg>';
}
function ghostIcon(slot){
  return '<svg class="ghost" viewBox="0 0 48 48" style="color:#a89c82" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">'+slotGlyph(slot,'miecz1h')+'</svg>';
}
function matIcon(k,cls){
  const m=MATS[k];
  if(ASSETS.mats[k])return '<img class="ico '+(cls||'')+'" src="'+ASSETS.mats[k]+'" alt="">';
  return '<svg class="ico '+(cls||'')+'" viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" fill="#1a130d" stroke="'+m.c+'" stroke-width="2"/><text x="14" y="19.5" text-anchor="middle" font-size="15" font-weight="700" fill="'+m.c+'" font-family="Georgia,serif">'+m.g+'</text></svg>';
}
const COIN='<svg viewBox="0 0 24 24"><defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f5d58c"/><stop offset="1" stop-color="#b3711b"/></linearGradient></defs><path d="M12 2 L20 8 L17 21 L7 21 L4 8Z" fill="url(#cg)" stroke="#5e3d10" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 5 L16 9 L12 18 L8 9Z" fill="#fff" fill-opacity=".35"/></svg>';
const SYMBOLS={
  wilk:'<svg viewBox="0 0 24 24" fill="#f3d9a6"><path d="M4 4 L9 8 H15 L20 4 L19 12 L16 20 H8 L5 12Z"/><circle cx="9" cy="12" r="1.4" fill="#2a0d14"/><circle cx="15" cy="12" r="1.4" fill="#2a0d14"/></svg>',
  kruk:'<svg viewBox="0 0 24 24" fill="#e6ecf7"><path d="M3 15 C8 8 14 6 21 9 L17 12 L19 16 L14 14 C10 17 6 18 3 15Z"/><circle cx="16" cy="10" r="1.2" fill="#14203f"/></svg>'
};

function skGlyph(sk,un){if(!un)return '🔒';return ASSETS.skills[sk.name]?'<img class="skimg" src="'+ASSETS.skills[sk.name]+'" alt="">':sk.glyph;}
