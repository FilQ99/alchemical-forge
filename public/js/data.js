/* =====================================================================
   DANE GRY (wszystko, co się zmienia, jest tutaj, nie w logice)
   Wartości są robocze (do strojenia po testach w grze).
   ===================================================================== */
const CFG={
  mobDrops:{kamien:.03,zmieniacz:.06,dodatek:.04}, // szansa z każdego zwykłego potwora (mnożona przez Szczęście)
  ipm:60,                    // dochód na minutę (Szardy) na tierze 1, podstawa cen
  tierIncome:[1,3,9,27,81,243],
  levelCap:8,                // limit poziomu w MVP (treść mapy 1); docelowo 50
  designCap:50,
  minibossEvery:50,          // co ile zabitych potworów pojawia się mini-boss
  monolithCd:60,             // s, odnowienie Monolitu
  bossRespawn:300,           // s, odnowienie bossa
  bossTime:60,               // s, limit czasu walki z bossem
  dungeonTime:300,
  upChance:[1,1,.95,.9,.8,.7,.6,.5,.4],   // z +N na +N+1 (indeks N)
  convChance:[1,1,1,.9,.9],                // przejście z tieru t na t+1 (indeks t-1)
  tierMul:1.25,              // mnożnik wartości bonusów na tier
  masterMul:2.5,
  maxBon:5,maxMaster:2,
  caps:{krytyk:60,skupienie:40,szybkosc:60,podwojny:40,szczescie:50},
  critBase:5,critMulBase:2,
  atkPerTier:[10,24,55,120,260,560],
  atkUp:0.1,                 // +10% ataku broni na każdy +N
  lvBase:4,lvStep:1.5,       // podstawa obrażeń z poziomu
  xpBase:400,xpGrow:1.8, // wolniejszy EXP (do testów)
  spawnDelay:.35, // krótka przerwa po pojawieniu się wroga, sek.
  
  autoIdleMs:900,            // po tylu ms bez kliknięcia broń atakuje sama
  tierMinLevel:[1,9,17,26,35,43],
  // ceny w "minutach farmienia" (x ipm x tierIncome)
  price:{zmieniacz:3,dodatek:10,ochronny:8,zmieniaczM:30,dodatekM:60,set:2.4,bonusSlot:4},
  convFeeMin:60,
  sellRate:0.3,
  comp:{xpBase:150,xpGrow:1.6,max:10,base:5,perLvl:2}
};

const KINGDOMS={
  marchia:{name:'Karmazynowa Marchia',motto:'Uderz pierwszy.',style:'Aktywny: klik, krytyki, szybkie zabijanie',
    c1:'#b3263e',c2:'#e8b25a',bonus:{klik:10,krytyk:3},bonusTxt:'+10% obrażeń z kliku, +3% szansy na krytyk',symbol:'wilk'},
  dwor:{name:'Szafirowy Dwór',motto:'Przetrwaj dłużej.',style:'Cierpliwy: pomocnik, automat, umiejętności',
    c1:'#2f4fa0',c2:'#cfd8e8',bonus:{auto:10,skupienie:5},bonusTxt:'+10% obrażeń samoczynnych, +5% krótsze odnowienia',symbol:'kruk'}
};

const WEAPONS={ // tempo, mnożnik obrażeń na cios, bonus-podpis (wbudowany)
  miecz1h:{n:'Miecz jednoręczny',tempo:1.0,dmg:1.0,sig:{k:'moc',v:4},ico:'⚔'},
  miecz2h:{n:'Miecz dwuręczny',tempo:0.6,dmg:1.9,sig:{k:'moc',v:8},ico:'🗡'},
  sztylet:{n:'Sztylet',tempo:1.4,dmg:0.7,sig:{k:'krytyk',v:3},ico:'🗡'},
  luk:{n:'Łuk',tempo:1.0,dmg:1.0,sig:{k:'szybkosc',v:4},ico:'🏹'},
  dzwon:{n:'Dzwon',tempo:0.8,dmg:1.2,sig:{k:'umi',v:8},ico:'🔔'},
  wachlarz:{n:'Wachlarz',tempo:1.2,dmg:0.85,sig:{k:'skupienie',v:4},ico:'🪭'}
};

const CLASSES={
  wojownik:{n:'Wojownik',ico:'⚔',weapons:['miecz1h','miecz2h'],paths:{sila:'Siła',wola:'Wola'}},
  lucznik:{n:'Łucznik',ico:'🏹',weapons:['luk','sztylet'],paths:{luk:'Łuk',sztylet:'Sztylet'}},
  mag:{n:'Mag',ico:'✦',weapons:['dzwon','wachlarz'],paths:{ogien:'Ogień',lod:'Lód'}}
};

// Umiejętności: 3 na ścieżkę, stałe role: uderzenie / wzmocnienie / finisher
const SKROLE={
  uderzenie:{lvl:5,cd:8,mult:3,desc:'Jednorazowy mocny cios'},
  wzmocnienie:{lvl:10,cd:30,dur:10,buff:50,desc:'Czasowy bonus do obrażeń'},
  finisher:{lvl:20,cd:60,mult:12,desc:'Potężny cios, wyjątkowo skuteczny na bossach'}
};
const PATHSK={
  'wojownik.sila':[['Cios Przełamujący','⚔'],['Furia','🔥'],['Trzęsienie Ziemi','🌋']],
  'wojownik.wola':[['Tarczowy Cios','🛡'],['Niezłomność','✊'],['Fala Woli','🌊']],
  'lucznik.luk':[['Strzał Przebijający','🏹'],['Skupienie Łowcy','👁'],['Deszcz Strzał','☄']],
  'lucznik.sztylet':[['Szybkie Cięcie','🗡'],['Cienisty Krok','🌑'],['Śmiertelny Taniec','💫']],
  'mag.ogien':[['Kula Ognia','🔥'],['Żar Skupienia','✨'],['Deszcz Meteorów','☄']],
  'mag.lod':[['Lodowy Grot','❄'],['Mroźna Aura','🧊'],['Zamieć','🌨']]
};

const SLOTS=['weapon','armor','helmet','shield','boots','neck','earrings','bracelet'];
const BSLOTS=['amulet','belt','talisman'];
const ALLSLOTS=SLOTS.concat(BSLOTS);
const SLOTN={weapon:'Broń',armor:'Zbroja',helmet:'Hełm',shield:'Tarcza',boots:'Buty',neck:'Naszyjnik',earrings:'Kolczyki',bracelet:'Bransoleta',amulet:'Amulet',belt:'Pas',talisman:'Talizman'};

const SETS=[
 {n:'Wędrowca',col:'var(--t1)'},{n:'Żelazny',col:'var(--t2)'},{n:'Stalowy',col:'var(--t3)'},
 {n:'Szmaragdowy',col:'var(--t4)'},{n:'Obsydianowy',col:'var(--t5)'},{n:'Smoczy',col:'var(--t6)'}
];
const ROM=['I','II','III','IV','V','VI'];
const NAMES={ // tier -> slot
 1:{armor:'Kaftan wędrowca',helmet:'Skórzany kaptur',shield:'Drewniana tarcza',boots:'Buty z łyka',neck:'Wisior z kory',earrings:'Kolczyki z kości',bracelet:'Opaska skórzana'},
 2:{armor:'Kolczuga rudego żelaza',helmet:'Żelazny hełm',shield:'Okrągła tarcza żelazna',boots:'Okute buty',neck:'Łańcuch żelazny',earrings:'Kółka żelazne',bracelet:'Bransoleta okuta'},
 3:{armor:'Pancerz hartowany',helmet:'Hełm z przyłbicą',shield:'Tarcza rycerska',boots:'Buty stalowe',neck:'Medalion stalowy',earrings:'Kolce srebrne',bracelet:'Naramiennik stalowy'},
 4:{armor:'Zbroja szmaragdowa',helmet:'Diadem szmaragdowy',shield:'Tarcza zielonego szkła',boots:'Buty leśnego strażnika',neck:'Naszyjnik szmaragdowy',earrings:'Kolczyki zielone',bracelet:'Bransoleta złota'},
 5:{armor:'Pancerz obsydianowy',helmet:'Hełm z czarnego szkła',shield:'Tarcza obsydianowa',boots:'Buty nocne',neck:'Wisior obsydianowy',earrings:'Kolce obsydianowe',bracelet:'Opaska cienia'},
 6:{armor:'Zbroja smocza',helmet:'Hełm smoczy',shield:'Tarcza łuskowa',boots:'Buty smocze',neck:'Naszyjnik z kła',earrings:'Kolczyki rubinowe',bracelet:'Bransoleta smocza'}
};
const WNAMES={ // tier -> typ broni
 1:{miecz1h:'Miecz drewniany',miecz2h:'Maczuga wędrowca',sztylet:'Nóż kościany',luk:'Łuk z gałęzi',dzwon:'Dzwonek miedziany',wachlarz:'Wachlarz z liści'},
 2:{miecz1h:'Miecz żelazny',miecz2h:'Dwuręczny żelazny',sztylet:'Sztylet żelazny',luk:'Łuk żelazny',dzwon:'Dzwon żelazny',wachlarz:'Wachlarz pierzasty'},
 3:{miecz1h:'Miecz stalowy',miecz2h:'Dwuręczny stalowy',sztylet:'Sztylet stalowy',luk:'Łuk stalowy',dzwon:'Dzwon srebrny',wachlarz:'Wachlarz srebrny'},
 4:{miecz1h:'Miecz szmaragdowy',miecz2h:'Dwuręczny szmaragdowy',sztylet:'Sztylet szmaragdowy',luk:'Łuk szmaragdowy',dzwon:'Dzwon szmaragdowy',wachlarz:'Wachlarz zielony'},
 5:{miecz1h:'Miecz obsydianowy',miecz2h:'Dwuręczny obsydianowy',sztylet:'Sztylet obsydianowy',luk:'Łuk obsydianowy',dzwon:'Dzwon obsydianowy',wachlarz:'Wachlarz cienia'},
 6:{miecz1h:'Miecz smoczy',miecz2h:'Dwuręczny smoczy',sztylet:'Sztylet smoczy',luk:'Łuk smoczy',dzwon:'Dzwon smoczy',wachlarz:'Wachlarz ognisty'}
};
const BADJ=['Wędrowca','Żelazny','Stalowy','Szmaragdowy','Obsydianowy','Smoczy'];

// Katalog bonusów (13), 5 przedziałów wartości dla tieru 1; 5. przedział = perfekt
const BON={
 moc:{n:'Moc',d:'Więcej obrażeń',b:[3,5,7,9,12]},
 umi:{n:'Obrażenia umiejętności',d:'Mocniejsze umiejętności',b:[4,7,10,13,18]},
 krytyk:{n:'Szansa na krytyk',d:'Szansa na cios krytyczny',b:[2,4,6,8,10]},
 skrytyka:{n:'Siła krytyka',d:'Większe obrażenia krytyczne',b:[5,10,15,20,28]},
 lpot:{n:'Łowca potworów',d:'Obrażenia na zwykłych potworach',b:[3,6,9,12,15]},
 lboss:{n:'Łowca bossów',d:'Obrażenia na bossach',b:[3,6,9,12,15]},
 skupienie:{n:'Skupienie',d:'Krótsze odnowienie umiejętności',b:[2,4,6,8,10]},
 madrosc:{n:'Mądrość',d:'Więcej doświadczenia',b:[3,5,8,11,15]},
 szczescie:{n:'Szczęście',d:'Większa szansa na ulepszacze',b:[3,5,8,11,15]},
 chciwosc:{n:'Chciwość',d:'Więcej Szardów',b:[4,8,12,16,20]},
 szybkosc:{n:'Szybkość',d:'Szybsze ciosy samoczynne',b:[3,6,9,12,15]},
 podwojny:{n:'Podwójny cios',d:'Szansa na dodatkowy cios',b:[2,3,5,7,9]},
 wzmtow:{n:'Wzmocnienie towarzysza',d:'Silniejsze bonusy towarzysza',b:[3,5,8,11,15]}
};
const POOL={
 weapon:['moc','umi','krytyk','skrytyka','lpot','lboss'],
 armor:['moc','lpot','lboss','madrosc','wzmtow'],
 helmet:['krytyk','madrosc','skupienie','podwojny','szczescie'],
 shield:['skupienie','lboss','lpot','wzmtow','szybkosc'],
 boots:['szybkosc','madrosc','szczescie','chciwosc','podwojny'],
 neck:['moc','chciwosc','szczescie','madrosc','skupienie'],
 earrings:['krytyk','skrytyka','skupienie','szczescie','podwojny'],
 bracelet:['skrytyka','moc','umi','szybkosc','chciwosc'],
 amulet:['madrosc','szczescie','chciwosc','skupienie','wzmtow'],
 belt:['madrosc','szczescie','chciwosc','skupienie','wzmtow'],
 talisman:['madrosc','szczescie','chciwosc','skupienie','wzmtow']
};
const MPOOL=['lpot','lboss','moc','madrosc']; // bonusy 6-7 (mistrzowskie)

// Bonusy wbudowane: rosną z +N, nowe odblokowują się na +0/+3/+6/+9
const BUILTIN={
 weapon:[null,{k:'krytyk',v:2,at:3},{k:'lpot',v:5,at:6},{k:'umi',v:8,at:9}], // [0] = podpis typu broni
 armor:[{k:'lpot',v:4,at:0},{k:'moc',v:3,at:3},{k:'madrosc',v:4,at:6},{k:'lboss',v:5,at:9}],
 helmet:[{k:'madrosc',v:4,at:0},{k:'krytyk',v:2,at:3},{k:'skupienie',v:3,at:6},{k:'moc',v:4,at:9}],
 shield:[{k:'skupienie',v:3,at:0},{k:'lboss',v:4,at:3},{k:'wzmtow',v:4,at:6},{k:'moc',v:4,at:9}],
 boots:[{k:'szybkosc',v:4,at:0},{k:'szczescie',v:3,at:3},{k:'madrosc',v:3,at:6},{k:'podwojny',v:3,at:9}],
 neck:[{k:'szczescie',v:4,at:0},{k:'moc',v:3,at:3},{k:'chciwosc',v:5,at:6},{k:'krytyk',v:3,at:9}],
 earrings:[{k:'krytyk',v:2,at:0},{k:'skrytyka',v:6,at:3},{k:'szczescie',v:3,at:6},{k:'podwojny',v:3,at:9}],
 bracelet:[{k:'skrytyka',v:6,at:0},{k:'szybkosc',v:3,at:3},{k:'moc',v:3,at:6},{k:'umi',v:6,at:9}],
 amulet:[{k:'chciwosc',v:5,at:0},{k:'madrosc',v:3,at:3},{k:'szczescie',v:3,at:6},{k:'wzmtow',v:5,at:9}],
 belt:[{k:'moc',v:3,at:0},{k:'skupienie',v:3,at:3},{k:'lpot',v:4,at:6},{k:'lboss',v:4,at:9}],
 talisman:[{k:'wzmtow',v:5,at:0},{k:'szczescie',v:3,at:3},{k:'madrosc',v:3,at:6},{k:'chciwosc',v:4,at:9}]
};

// Bonusy setowe 2/4/6/8
const SETB=[
 [{n:2,b:{moc:5}},{n:4,b:{madrosc:8}},{n:6,b:{szczescie:8}},{n:8,b:{moc:10,madrosc:10}}],
 [{n:2,b:{lpot:6}},{n:4,b:{krytyk:4}},{n:6,b:{moc:8}},{n:8,b:{lpot:12,krytyk:6}}],
 [{n:2,b:{lboss:6}},{n:4,b:{skupienie:5}},{n:6,b:{skrytyka:12}},{n:8,b:{lboss:12,moc:8}}],
 [{n:2,b:{szczescie:8}},{n:4,b:{chciwosc:10}},{n:6,b:{wzmtow:8}},{n:8,b:{szczescie:14,chciwosc:14}}],
 [{n:2,b:{umi:8}},{n:4,b:{krytyk:6}},{n:6,b:{szybkosc:8}},{n:8,b:{umi:16,skrytyka:18}}],
 [{n:2,b:{moc:10}},{n:4,b:{lpot:10,lboss:10}},{n:6,b:{podwojny:6}},{n:8,b:{moc:20,skupienie:10,podwojny:8}}]
];

// Materiały i ulepszacze (mapa 1)
const MATS={
 kamien:{n:'Kamień ulepszenia',d:'Ulepszanie +N. Przy porażce poziom spada o 1.',c:'#c9c2a6',g:'◆'},
 ochronny:{n:'Kamień ochronny',d:'Ulepszanie bez spadku poziomu przy porażce.',c:'#79c7e0',g:'◈'},
 odlamek:{n:'Odłamek monolitu',d:'Materiał: Kamień ochronny, Kamień przemiany.',c:'#a07ad8',g:'✦'},
 znak:{n:'Znak mini-bossa',d:'Materiał: Kamień przemiany.',c:'#e8b25a',g:'✪'},
 perla:{n:'Perła',d:'Materiał: Kamień przemiany.',c:'#f2ece0',g:'●'},
 rdzen:{n:'Rdzeń kopca',d:'Materiał: bonusy 6–7 (mistrzowskie).',c:'#e0654f',g:'❖'},
 przepustka:{n:'Przepustka do dungeonu',d:'Wejście do Kopca Zapomnianych (zużywana).',c:'#7fd0a0',g:'▣'},
 przemiany:{n:'Kamień przemiany',d:'Przerabianie elementu na kolejny set.',c:'#ee9a3c',g:'⬢'},
 zmieniacz:{n:'Zmieniacz bonusów',d:'Przelosowuje bonusy 1–5 przedmiotu.',c:'#6fb2ff',g:'⟳'},
 dodatek:{n:'Dodatek bonusu',d:'Dodaje kolejny bonus 1–5 (maks. 5).',c:'#79c76a',g:'+'},
 zmieniaczM:{n:'Zmieniacz mistrzowski',d:'Przelosowuje bonusy 6–7.',c:'#4a9bff',g:'⟲'},
 dodatekM:{n:'Dodatek mistrzowski',d:'Dodaje bonus 6–7 (maks. 2).',c:'#3aa0ff',g:'⊕'}
};
const MATORDER=['kamien','ochronny','odlamek','znak','perla','rdzen','przepustka','przemiany','zmieniacz','dodatek','zmieniaczM','dodatekM'];

// Mapa 1: Wrzosowe Pogranicze
const MAP1={
  name:'Wrzosowe Pogranicze',tier:1,levels:'1–8',
  mobs:[
    {id:'dzik',n:'Dzik wrzosowiskowy',lv:[1,3],hp:30,xp:6,sz:3,h:28,w:1.674,svg:'boar'},
    {id:'wilk',n:'Wilk szary',lv:[3,5],hp:110,xp:14,sz:6,h:28,w:2.123,svg:'wolf'},
    {id:'szkielet',n:'Szkielet pogranicza',lv:[5,8],hp:300,xp:30,sz:11,h:50,w:.583,svg:'skel'}
  ],
  mini:{id:'alfa',n:'Przywódca stada',hp:2200,xp:90,sz:80,h:34,w:1.784,svg:'wolfBig',drops:{kamien:[1,2],znak:[1,1],zmieniacz:[1,2],dodatek:[0,1]},perla:.1},
  bosses:[
    {id:'b1',n:'Król Dzików',hp:15000,xp:200,sz:600,h:44,w:1.614,svg:'boarKing',lvRec:6,drops:{znak:[2,3],zmieniacz:[1,2],dodatek:[1,1]},perla:.15,desc:'Ogromny dzik z kłami jak miecze'},
    {id:'b2',n:'Strażnik Granicy',hp:26000,xp:300,sz:900,h:60,w:1.355,svg:'skelGuard',lvRec:7,drops:{znak:[1,2],zmieniacz:[1,2],dodatek:[1,1]},perla:.25,desc:'Pancerny szkielet z tarczą'},
    {id:'b3',n:'Wiedźma Wrzosowisk',hp:38000,xp:420,sz:1300,h:58,w:.979,svg:'witch',lvRec:8,drops:{znak:[1,1],zmieniacz:[1,3],dodatek:[1,2]},perla:.4,przepustka:.1,desc:'Starucha z kosturem i wronami'}
  ],
  monolith:{id:'mono',n:'Monolit Pogranicza',hpMul:15,sz:150,xp:50,h:62,w:.566,svg:'monolith',drops:{kamien:[2,4],odlamek:[2,4],zmieniacz:[1,2],dodatek:[0,1]},przepustka:.25,perla:.03,lvRec:3},
  dungeon:{
    n:'Kopiec Zapomnianych',lvRec:7,
    stages:[
      {kind:'horde',n:'Hordy szkieletów',count:8},
      {id:'ds1',kind:'mini',n:'Strażnik kopca',hp:5000,xp:120,sz:300,h:56,w:1.355,svg:'skelGuard'},
      {id:'ds2',kind:'boss',n:'Kościany Władca',hp:30000,xp:600,sz:2500,h:66,w:1.15,svg:'skelKing'}
    ],
    drops:{kamien:[3,5],rdzen:[1,1],perla:[1,2],znak:[1,2],zmieniacz:[2,4],dodatek:[2,3]}
  }
};

// Cele ekwipunku: co jest „super” zależnie od tego, jak chcesz grać
const GOALS={
  exp:{n:'Szybki EXP',desc:'Najszybszy awans i więcej łupów. Obrażenia tylko tyle, by szybko bić zwykłe potwory.',top:['madrosc','szczescie','chciwosc','szybkosc','lpot','moc'],m:['madrosc','lpot']},
  boss:{n:'Bossy i metiny',desc:'Maksymalne obrażenia na twardych celach: bossach, metinach i w dungeonie.',top:['lboss','moc','skrytyka','krytyk','umi','skupienie'],m:['lboss','moc']},
  farm:{n:'Ulepszacze',desc:'Więcej kamieni i zmieniaczy: wyższe Szczęście i szybsze zabijanie potworów.',top:['szczescie','lpot','szybkosc','podwojny','chciwosc','madrosc'],m:['lpot','madrosc']}
};
