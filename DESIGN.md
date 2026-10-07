# Projekt gry: clicker inspirowany Metin2 (nazwa robocza)

Dokument projektowy, dopisywany krok po kroku. Status każdej sekcji: ✅ zatwierdzone, 🟡 do ustalenia.

## Zasada nadrzędna: system oparty o dane

Wszystko, co da się rozszerzać (królestwa, klasy, bonusy, regiony, przedmioty), jest **definicją w danych**, a nie kodem wpisanym na sztywno.
- Dodanie trzeciego królestwa = dopisanie jednego wpisu w liście definicji, bez zmian w logice gry.
- Zmiana nazwy, barw lub bonusu = edycja jednego miejsca.
- Logika gry czyta definicję i stosuje jej bonusy. Nie zna konkretnych królestw po nazwie.
- Dotyczy to też późniejszych sekcji (postacie, klasy itd.).

## 1. Królestwa ✅

Na start: **dwa królestwa**.

### Konflikt
Dwa królestwa w jednym świecie kłócą się o to, jak walczyć z zagrożeniem. Jedno stawia na siłę i szybkie uderzenie, drugie na cierpliwość i przygotowanie. Żadne nie jest „dobre" ani „złe", to dwa style gry.

### Królestwo A: Karmazynowa Marchia
- Hasło: „Uderz pierwszy."
- Barwy: karmazyn i złoto
- Symbol: wilk
- Styl: **aktywny** (klik, krytyki, szybkie zabijanie)
- Bonus: więcej obrażeń z kliku, większa szansa na krytyk
- Miasto startowe: twierdza na czerwonych skałach, kuźnie i pochodnie

### Królestwo B: Szafirowy Dwór
- Hasło: „Przetrwaj dłużej."
- Barwy: granat i srebro
- Symbol: kruk
- Styl: **cierpliwy** (pomocnik, automat, umiejętności)
- Bonus: więcej obrażeń na sekundę, krótsze odnowienie umiejętności
- Miasto startowe: miasto nad jeziorem, wieże i latarnie

### Relacja między królestwami
Otwarta rywalizacja. Każde królestwo ma licznik łącznego wyniku graczy. W przyszłości wspólne wydarzenia (wymaga serwera).

### Zmiana królestwa
Możliwa, ale płatnie i z długim czasem odnowienia, żeby wybór coś znaczył, a pomyłkę dało się naprawić.

### Definicja królestwa (dane)
Każde królestwo opisują pola: `id`, `nazwa`, `hasło`, `barwy` (główna, dodatkowa), `symbol`, `styl`, `bonusy` (lista: statystyka + wartość), `miasto` (nazwa, opis), `koszt_zmiany`.

## 2. Postać ✅

### Klasy i ścieżki
3 klasy, każda z 2 ścieżkami (razem 6 buildów). Nazwy są zwykłymi, uniwersalnymi słowami, bez nazw własnych z Metina2.

| Klasa | Ścieżka 1 | Ścieżka 2 |
|---|---|---|
| Wojownik | Siła | Wola |
| Łucznik | Łuk | Sztylet |
| Mag | Ogień | Lód |

- Każda klasa dostępna w obu królestwach (2 × 3 = 6 kombinacji królestwo/klasa).
- Królestwo daje bonus stylu, klasa daje główny sposób zadawania obrażeń.
- **Wybór ścieżki: w mieście, u trenera, na poziomie 5.** Po wyborze ścieżka jest na stałe (możliwość zmiany do ustalenia później).
- Przy tworzeniu postaci gracz wybiera: królestwo, klasę, wygląd (kilka gotowych na klasę) i imię. Płeć pomijamy.

### Nazwy i języki
- Omijamy nazwy własne z Metina2 (klasy, frakcje, waluta, nazwy umiejętności i kamieni).
- Każda nazwa w danych jest kluczem tłumaczenia (np. `class.warrior`), a teksty są w osobnej liście per język. Nowy język = nowy plik tekstów.

## 3. Levelowanie ✅

- Zabijanie daje XP, po awansie wyraźny moment „Awans!".
- **Limit poziomu na start: 50.** Limit jest parametrem w danych, więc można go później podnieść.
- Poziomy 1–4: tylko podstawowy atak.
- Poziom 5: wybór ścieżki u trenera + pierwsza umiejętność.
- Poziomy 15 i 30: kolejne umiejętności (3 na ścieżkę).
- Każdy poziom daje punkty umiejętności.

## 4. Umiejętności ✅

- Umiejętności są **stałe i znane**: każda ścieżka ma ten sam zestaw dla wszystkich graczy (żadnego losowania).
- 3 umiejętności na ścieżkę, o tych samych rolach: **Uderzenie** (jednorazowy mocny cios, krótkie odnowienie), **Wzmocnienie** (czasowy bonus, średnie odnowienie), **Finisher** (potężna, długie odnowienie, np. na bossa).
- **Rangi 1–10** dla każdej umiejętności, każda ranga daje wyraźny przyrost.
- Rangi 1–5: tylko punkty umiejętności. Rangi 6–10: dodatkowo **ulepszacz** (np. Księga umiejętności) z bossów albo kupiony u NPC.
- Ranga 10 daje efekt dodatkowy (np. krótsze odnowienie).
- Liczba rang i wymagania są w danych i da się je rozszerzać.

## 5. Ulepszacze i rynek (przyszłość) 🟡

- Przedmioty (np. `skill_book`, `upgrade_stone`) są od początku bytami w danych z unikalnym id.
- Na starcie kupowane u NPC za walutę. Rynek między graczami jako osobna faza (wymaga serwera) i użyje tych samych przedmiotów.

## 6. Towarzysz (postać wspierająca, autobuff) ✅

### Zasady
- **Tylko wzmacnia bohatera**, nie walczy. Działa jak posiadanie buffa w Metinie.
- **Jeden towarzysz na gracza**, za darmo od początku gry, niedostępny za prawdziwe pieniądze.
- W danych jest miejsce na dodatkowych towarzyszy w przyszłości (system nie zakłada, że jest tylko jeden).

### Równe szanse
- Towarzysz zawsze daje **bazowy bonus**, taki sam dla wszystkich na tym samym poziomie.
- Rozwój wyłącznie przez grę (punkty, ulepszacze z bossów), bez przewagi za wydane pieniądze.
- Górny limit bonusu od towarzysza jest ograniczony, żeby samo wzmacnianie nie przebiło mocy bohatera.

### Rozwój
- Towarzysz ma własny poziom, własne umiejętności (stałe i znane) i rangi, tak jak bohater.
- **Suwak XP (0–50%):** gracz sam decyduje, jaka część zdobywanego XP idzie do towarzysza. Przy 0% zostaje na bazowym bonusie, bez kary.

### Umiejętności (start, 3 wzmocnienia o stałych rolach)
- **Siła:** więcej obrażeń
- **Szczęście:** więcej łupów
- **Tempo:** szybsze odnawianie umiejętności
- Nazwy robocze. Nie używamy nazw z Metina2. Lista rozszerzalna jako dane.

### Widoczność bonusów
- Aktywne wzmocnienia są zawsze widoczne w interfejsie jako **pasek buffów** (ikona, nazwa, wartość, ewentualny czas).
- Gracz widzi konkretnie, ile daje mu towarzysz (np. „Siła: +5% obrażeń").

## 7. Ekwipunek ✅ (bonusy: patrz sekcja 8)

### Sloty
- **8 głównych:** broń, zbroja, hełm, tarcza, buty, naszyjnik, kolczyki, bransoleta. Tworzą set.
- **3 bonusowe:** amulet, pas, talizman. Nie wchodzą w skład setów, ale można je ulepszać i mają własne bonusy.
- Lista slotów jest w danych, więc dodanie kolejnego slotu to jeden wpis.

### Wygląd
- Sylwetka bohatera na środku, sloty dookoła (jak w Metinie). Założony sprzęt zmienia wygląd postaci.
- Kolor ramki = tier setu, „+N" = poziom ulepszenia.
- Podgląd porównawczy przedmiotów (co zyskasz, co stracisz) po najechaniu.
- Widoczne zebrane elementy setu i aktywne bonusy setowe (2/4/6/8 elementów).

### Zdobywanie sprzętu
- **Sprzęt jest stały i ulepszalny.** Nie wypadają losowe przedmioty. Elementy setu zdobywa się celowo (bossy, wyprawy, craft).
- **Z walki wypadają ulepszacze i materiały**, nie „syf". Każdy drop zasila rozwój.
- Cała gra to droga przez kolejne sety, a w ramach setu rozwija się ten sam egzemplarz.

### Sety (nazwy robocze)
8 elementów w secie, przedział poziomów do 50. Tiery: 1 Wędrowca (drewno, skóra), 2 Żelazny, 3 Stalowy, 4 Szmaragdowy, 5 Obsydianowy, 6 Smoczy. Każdy set ma pole `typ`: **PvM** (bonusy na potwory i bossów) lub **PvP** (bonusy na pojedynki, faza późniejsza, wymaga serwera).

### Ulepszacze (własne nazwy)
- **Kamień ulepszenia:** +0 do +9, szansa spada z poziomem. **Dropi** z walki.
- **Zmieniacz bonusów** i **Dodatek bonusu:** **kupowane w sklepie** (NPC), nie dropią.
- **Kamień ochronny:** wariant Kamienia ulepszenia, przy porażce poziom ulepszenia **nie spada** (szczegóły w sekcji 13). Do kupienia lub zrobienia.
- **Perły:** materiał na craft i ulepszanie wyższych setów.

### Okno zmiany bonusów
- Gracz klika element ekwipunku (np. buty) i wybiera „Zmień bonusy".
- Pojawia się okienko z aktualnymi bonusami tego elementu i **ikoną Zmieniacza**.
- Kliknięcie ikony przelosowuje bonusy (kosztem jednego Zmieniacza). Analogicznie okno „Dodaj bonus".
- Każdy element ma własne bonusy (zależne od slotu) i część wspólnych.

## 8. Bonusy przedmiotów ✅

Wzorowane na sposobie działania z Metina2, ale z własnymi nazwami i dopasowane do naszej gry. Wszystkie wartości, progi i listy są w danych.

### Trzy warstwy bonusów
1. **Wbudowane (stałe):** zależą od slotu i tieru, rosną wraz z ulepszeniem +0 do +9. Przy progach **+3, +6 i +9 dochodzi nowy wbudowany bonus**, żeby opłacało się rozwijać sprzęt wysoko, zanim gracz przejdzie do kolejnego setu.
2. **Bonusy 1–5 (podstawowe):** losowe bonusy z puli dozwolonej dla danego slotu. Dodawane **Dodatkiem bonusu**, zmieniane **Zmieniaczem bonusów** (oba kupowane w sklepie).
3. **Bonusy 6–7 (mistrzowskie):** dwa dodatkowe sloty, dające wyraźnie więcej niż 1–5 (około 2–3 razy wyższe wartości, zależne od tieru).
- Maksimum wrzucanych bonusów: 5 + 2 = 7 (parametr w danych), plus bonusy wbudowane.

### Bonusy 6–7
- Mają **małą, wąską pulę** (cele końcowe). Pula zależy od etapu gry:
  - jedna pula na wszystkie tiery: Łowca potworów, Łowca bossów, Moc, Mądrość (żeby bonusy mogły przechodzić między setami, patrz sekcja 13).
- Dodawane i zmieniane osobnymi ulepszaczami (**Dodatek mistrzowski**, **Zmieniacz mistrzowski**), losowo z tej małej puli.
- Ulepszacze 6–7 są **drogie**: sklep za wysoką cenę i/lub craft z rzadkich materiałów z bossów. Łatwy dostęp psuje równowagę.

### Przedziały i perfekt
- Każdy bonus ma 5 przedziałów wartości. Najwyższy to **perfekt**, wyróżniony kolorem.

### Okno przedmiotu (układ)
1. Nazwa z poziomem ulepszenia (np. „Miecz Wędrowca +6").
2. **Podgląd następnego poziomu:** „Możliwość ulepszenia: [nazwa +7]".
3. Wymagany poziom.
4. Wartość podstawowa: broń = zakres ataku, pozostałe = obrona.
5. Lista bonusów: wbudowane (biały), 1–5 (zielony), 6–7 (niebieski, wyróżnione).
6. Ikony klas, które mogą założyć przedmiot.
7. Podgląd porównawczy z aktualnie założonym przedmiotem.

### Broń
- **Broń jest osobna dla każdej klasy** (z własną nazwą i wyglądem). Pozostałe sloty są wspólne dla wszystkich klas.
- Dla każdego setu: 3 bronie (po jednej na klasę). Przy 6 tierach razem 18 broni.
- **Wariant broni** (`wariant`): na start tylko **PvE**. Pole na wariant PvP zostaje w danych na przyszłość.
- Broń PvE ma **kompromis**: słabsze zwykłe ataki (ujemny bonus „Obrażenia zwykłe") w zamian za mocniejsze umiejętności (minimum +20% obrażeń umiejętności).
- Broń kupowana u kowala (NPC), a jej ulepszanie i bonusy jak w sekcjach powyżej.

### Pula bonusów
Pełny katalog w sekcji 10. Przypisanie do slotów jest w danych.

## 9. Typy broni i tempo ✅

### Typy broni (wybierane przez gracza w ramach klasy)
Typ broni nie zależy od ścieżki. **Ścieżka decyduje o umiejętnościach, typ broni o stylu walki.** Gracz sam wybiera spośród typów dostępnych dla jego klasy.

| Klasa | Dostępne typy broni |
|---|---|
| Wojownik | miecz jednoręczny, miecz dwuręczny |
| Łucznik | łuk, sztylet |
| Mag | dzwon, wachlarz |

- W każdym secie 6 broni (po 2 na klasę), razem 36 przy 6 tierach.
- **Tarcza zostaje dla wszystkich klas** (wygląd dopasowany: tarcza, puklerz, magiczna sfera). Dwuręczny jej nie blokuje.

### Tempo: jak działa w clickerze
- Gdy gracz **klika**, każde kliknięcie zadaje cios, a liczba ciosów zależy od tego, jak szybko gracz klika. Nie ma blokady kliknięć.
- Gdy gracz **nie klika**, broń **atakuje sama dokładnie w swoim tempie** (nie karzemy za bezczynność).
- Aby wolna broń nie była gorsza w kliknięciach: **siła kliknięcia = obrażenia na cios × tempo broni**. Dzięki temu klikanie jest porównywalne między broniami, a różnica „wolna i ciężka kontra szybka i lekka" widać w ciosach samoczynnych i w ich wyglądzie.
- Dwuręczny ma łącznie ok. **+15% obrażeń na sekundę** względem jednoręcznego w zamian za wolniejsze tempo.

### Wartości robocze (do strojenia w testach)
| Broń | Tempo | Obrażenia na cios | Podpis (bonus wbudowany) |
|---|---|---|---|
| Miecz jednoręczny | 1,0 | 1,0 | zrównoważony |
| Miecz dwuręczny | 0,6 | 1,9 | więcej obrażeń na cios (ok. +15% DPS) |
| Sztylet | 1,4 | 0,7 | wyższy krytyk |
| Łuk | 1,0 | 1,0 | stały ostrzał, bonus z dystansu |
| Dzwon | 0,8 | 1,2 | mocniejsze umiejętności |
| Wachlarz | 1,2 | 0,85 | krótsze odnowienia |

### Grafika
Jedna sylwetka na typ broni (6 sylwetek). Tier zmienia materiał, kolor i poświatę.

## 10. Katalog bonusów ✅

### Zasada: gracz nie otrzymuje obrażeń
W clickerze potwory nie atakują gracza, więc **nie ma bonusów obronnych** (życie, odporność, unik). Cała pula to bonusy ofensywne i ekonomiczne. Ewentualne bonusy PvP dojdą razem z PvP.

### Pula: 13 bonusów (nazwy robocze)
Każdy bonus ma jeden jasny efekt i 5 przedziałów wartości (5. = **perfekt**). Wartości dla tieru 1; wyższe tiery mnożą je (robocze +25% na tier). Skala jest do strojenia w testach.

| Bonus | Co robi | Przedziały (tier 1) | Limit łączny |
|---|---|---|---|
| Moc | więcej obrażeń | 3 / 5 / 7 / 9 / 12% | brak |
| Obrażenia umiejętności | mocniejsze umiejętności | 4 / 7 / 10 / 13 / 18% | brak |
| Krytyk | szansa na cios krytyczny | 2 / 4 / 6 / 8 / 10% | 60% |
| Siła krytyka | większe obrażenia krytyczne | 5 / 10 / 15 / 20 / 28% | brak |
| Łowca potworów | obrażenia na zwykłych potworach | 3 / 6 / 9 / 12 / 15% | brak |
| Łowca bossów | obrażenia na bossach | 3 / 6 / 9 / 12 / 15% | brak |
| Skupienie | krótsze odnowienie umiejętności | 2 / 4 / 6 / 8 / 10% | 40% |
| Mądrość | więcej XP | 3 / 5 / 8 / 11 / 15% | brak |
| Szczęście | większa szansa na drop ulepszaczy | 3 / 5 / 8 / 11 / 15% | brak |
| Chciwość | więcej złota | 4 / 8 / 12 / 16 / 20% | brak |
| Szybkość | szybsze ciosy samoczynne (tempo broni) | 3 / 6 / 9 / 12 / 15% | 60% |
| Podwójny cios | szansa na dodatkowy cios | 2 / 3 / 5 / 7 / 9% | 40% |
| Wzmocnienie towarzysza | silniejsze bonusy towarzysza | 3 / 5 / 8 / 11 / 15% | brak |

### Pula bonusów 1–5 per slot
| Slot | Pula |
|---|---|
| Broń | Moc, Obrażenia umiejętności, Krytyk, Siła krytyka, Łowca potworów, Łowca bossów |
| Zbroja | Moc, Łowca potworów, Łowca bossów, Mądrość, Wzmocnienie towarzysza |
| Hełm | Krytyk, Mądrość, Skupienie, Podwójny cios, Szczęście |
| Tarcza | Skupienie, Łowca bossów, Łowca potworów, Wzmocnienie towarzysza, Szybkość |
| Buty | Szybkość, Mądrość, Szczęście, Chciwość, Podwójny cios |
| Naszyjnik | Moc, Chciwość, Szczęście, Mądrość, Skupienie |
| Kolczyki | Krytyk, Siła krytyka, Skupienie, Szczęście, Podwójny cios |
| Bransoleta | Siła krytyka, Moc, Obrażenia umiejętności, Szybkość, Chciwość |
| Amulet / Pas / Talizman | Mądrość, Szczęście, Chciwość, Skupienie, Wzmocnienie towarzysza |

### Trzy cele gracza (idealny ekwipunek)
| Cel | Które bonusy zbierać |
|---|---|
| Exp (levelowanie) | Łowca potworów, Obrażenia umiejętności, Krytyk, Mądrość, Szybkość |
| Bossy | Łowca bossów, Moc, Siła krytyka, Skupienie, Podwójny cios |
| Farma (ulepszacze i złoto) | Szczęście, Chciwość, Moc, Wzmocnienie towarzysza |

Przełączanie między dwoma zestawami ekwipunku to pomysł na później.

### Balans klas i buildów
- Bonusy są wspólne dla wszystkich klas, a różnice klas wynikają z umiejętności i typu broni.
- **Cel:** każdy z 12 buildów (3 klasy × 2 ścieżki × 2 typy broni) osiąga podobny wynik (docelowo różnica do ok. 5%) na tym samym etapie gry.
- Weryfikacja przez symulację botów dla każdego buildu przed wypuszczeniem.
- Skala wartości i limity zawsze w danych, do strojenia w testach. Priorytet: gra ma utrzymywać gracza i być zoptymalizowana.

## 11. Sety ✅ (zdobywanie: patrz sekcja 12)

### Zakresy poziomów (do 50)
| Tier | Set | Poziomy | Motyw |
|---|---|---|---|
| 1 | Wędrowca | 1–8 | drewno, skóra, kość |
| 2 | Żelazny | 9–16 | proste żelazo |
| 3 | Stalowy | 17–25 | hartowana stal, srebrne okucia |
| 4 | Szmaragdowy | 26–34 | zielone kamienie i złote zdobienia |
| 5 | Obsydianowy | 35–42 | czarne szkło, ostre krawędzie |
| 6 | Smoczy | 43–50 | łuski, rubiny, ogień |

### Elementy setów (7 wspólnych slotów)
| Tier | Zbroja | Hełm | Tarcza | Buty | Naszyjnik | Kolczyki | Bransoleta |
|---|---|---|---|---|---|---|---|
| 1 | Kaftan wędrowca | Skórzany kaptur | Drewniana tarcza | Buty z łyka | Wisior z kory | Kolczyki z kości | Opaska skórzana |
| 2 | Kolczuga rudego żelaza | Żelazny hełm | Okrągła tarcza żelazna | Okute buty | Łańcuch żelazny | Kółka żelazne | Bransoleta okuta |
| 3 | Pancerz hartowany | Hełm z przyłbicą | Tarcza rycerska | Buty stalowe | Medalion stalowy | Kolce srebrne | Naramiennik stalowy |
| 4 | Zbroja szmaragdowa | Diadem szmaragdowy | Tarcza zielonego szkła | Buty leśnego strażnika | Naszyjnik szmaragdowy | Kolczyki zielone | Bransoleta złota |
| 5 | Pancerz obsydianowy | Hełm z czarnego szkła | Tarcza obsydianowa | Buty nocne | Wisior obsydianowy | Kolce obsydianowe | Opaska cienia |
| 6 | Zbroja smocza | Hełm smoczy | Tarcza łuskowa | Buty smocze | Naszyjnik z kła | Kolczyki rubinowe | Bransoleta smocza |

### Bronie w setach (6 typów)
| Tier | Miecz 1H | Miecz 2H | Sztylet | Łuk | Dzwon | Wachlarz |
|---|---|---|---|---|---|---|
| 1 | Miecz drewniany | Maczuga wędrowca | Nóż kościany | Łuk z gałęzi | Dzwonek miedziany | Wachlarz z liści |
| 2 | Miecz żelazny | Dwuręczny żelazny | Sztylet żelazny | Łuk żelazny | Dzwon żelazny | Wachlarz pierzasty |
| 3 | Miecz stalowy | Dwuręczny stalowy | Sztylet stalowy | Łuk stalowy | Dzwon srebrny | Wachlarz srebrny |
| 4 | Miecz szmaragdowy | Dwuręczny szmaragdowy | Sztylet szmaragdowy | Łuk szmaragdowy | Dzwon szmaragdowy | Wachlarz zielony |
| 5 | Miecz obsydianowy | Dwuręczny obsydianowy | Sztylet obsydianowy | Łuk obsydianowy | Dzwon obsydianowy | Wachlarz cienia |
| 6 | Miecz smoczy | Dwuręczny smoczy | Sztylet smoczy | Łuk smoczy | Dzwon smoczy | Wachlarz ognisty |

### Bonusy setowe (2 / 4 / 6 / 8 elementów, wartości robocze)
| Set | 2 | 4 | 6 | 8 |
|---|---|---|---|---|
| 1 Wędrowca (zrównoważony) | Moc +5% | Mądrość +8% | Szczęście +8% | Moc +10%, Mądrość +10% |
| 2 Żelazny (potwory) | Łowca potworów +6% | Krytyk +4% | Moc +8% | Łowca potworów +12%, Krytyk +6% |
| 3 Stalowy (bossy) | Łowca bossów +6% | Skupienie +5% | Siła krytyka +12% | Łowca bossów +12%, Moc +8% |
| 4 Szmaragdowy (farma) | Szczęście +8% | Chciwość +10% | Wzmocnienie towarzysza +8% | Szczęście +14%, Chciwość +14% |
| 5 Obsydianowy (umiejętności, krytyki) | Obrażenia umiejętności +8% | Krytyk +6% | Szybkość +8% | Obrażenia umiejętności +16%, Siła krytyka +18% |
| 6 Smoczy (finał) | Moc +10% | Łowca potworów +10%, Łowca bossów +10% | Podwójny cios +6% | Moc +20%, Skupienie +10%, Podwójny cios +8% |

- Pole `typ` setu: na start wszystkie PvM. Sety PvP dojdą z PvP.

### Wiele egzemplarzy i mieszanie setów
- Gracz może mieć **dowolną liczbę egzemplarzy tego samego elementu** (np. wiele par kolczyków), każdy z innymi lub tymi samymi bonusami. Wybiera, który założyć.
- Bonusy setowe liczą się **dla założonych elementów** i **osobno dla każdego setu**. Można mieszać (np. 4 elementy jednego setu i 4 drugiego) i dostać oba bonusy.
- Każdy gracz sam wybiera sposób gry, ale istnieje **najlepsza droga** (perfekt bonusy na wszystkich elementach setu 6).

## 12. Zdobywanie i przerabianie setów ✅ (szczegóły do strojenia)

- **Set 1 (Wędrowca):** kupowany w sklepie za złoto.
- **Ulepszanie** każdego elementu **Kamieniem ulepszenia** od +0 do +9. Kamienie dropią z walki, a ulepszanie ma szansę powodzenia (spada z poziomem).
- **Przerabianie na nowy set:** element sety N zmienia się w element setu N+1 tego samego slotu (np. Kolczyki z kości → Kółka żelazne), przy użyciu osobnych ulepszaczy i **drogiej opłaty**. Nie ma zakupu setów 2–6 w sklepie.
- **Przerabianie jest trudniejsze niż ulepszanie** (niższa szansa, droższe materiały, rzadsze ulepszacze z bossów).
- **Poziom nie wymusza zmiany setu.** Gracz może zostać w secie początkowym aż do poziomu 50, ale będzie zabijał bardzo długo, w porównaniu z graczem, który przerabiał i ulepszał dalej.
- Ulepszacze do przerabiania to osobne przedmioty (np. Kamień przemiany, Perły), dropią z bossów danego regionu.

## 13. Zasady ulepszania i przerabiania ✅ (wartości robocze, do strojenia w testach)

### Bonusy zostają
- **Bonusy przedmiotu (1–5 i 6–7) zostają zarówno przy ulepszaniu +N, jak i przy przerabianiu na kolejny set.** Dzięki temu gracz może raz zrobić perfekt ekwipunek (Zmieniaczami i Dodatkami) i potem tylko go rozwijać, zamiast powtarzać mieszanie przy każdym nowym secie.
- Przy przerabianiu **bonus zachowuje swój przedział** (perfekt zostaje perfektem), a wartość liczy się ponownie według mnożnika nowego tieru.
- Pula bonusów danego slotu jest taka sama na wszystkich tierach, więc każdy bonus pasuje do nowego elementu.
- Bonusy wbudowane (sekcja 8) są własne dla każdego elementu i liczą się od nowa dla nowego tieru.

### Ulepszanie +0 → +9
- Domyślny **Kamień ulepszenia** (dropi z walki): sukces = +1, **porażka = poziom o 1 niższy** (np. z +2 na +1). Na +0 poziom nie spada.
- **Kamień ochronny** (do kupienia lub zrobienia): przy porażce element **zostaje na tym samym poziomie**.
- Każda próba, udana lub nie, **zużywa kamień i złoto**.
- Szanse (robocze): +1: 100%, +2: 100%, +3: 95%, +4: 90%, +5: 80%, +6: 70%, +7: 60%, +8: 50%, +9: 40%. Im wyżej, tym mniejsza szansa, ale bez skrajnej trudności.
- **Szanse są uczciwe i widoczne:** okno ulepszania pokazuje realną szansę i koszt, bez ukrytych modyfikatorów.

### Przerabianie na kolejny set
- Zmiana elementu setu N w element setu N+1 (ten sam slot). Wymaga **drogich ulepszaczy** (Kamień przemiany, Perły z bossów) i dużej opłaty w złocie.
- Szanse (robocze): przejścia 1→2, 2→3, 3→4: **100%**; przejścia 4→5, 5→6: **90%**.
- Przerabianie jest trudniejsze od ulepszania przez **koszt i rzadkość ulepszaczy**, a nie przez niskie szanse.
- Przy porażce (90%) element zostaje, a **ulepszacze i złoto są zużyte**. Poziom ulepszenia nie spada.
- Poziom ulepszenia po przerobieniu: **nowy element zaczyna od +1** (bonusy zostają, jak wyżej).

## 14. Waluta i ekonomia ✅ (wartości robocze, do strojenia po zobaczeniu gry w działaniu)

Zasada: najpierw prosty, działający szkic, potem strojenie na podstawie testów w grze.

### Waluta
- **Jedna waluta: Szard.** Brak waluty premium i brak kupowania za prawdziwe pieniądze (równe szanse).
- Nazwa waluty: **Szard** (wybrane). W starszych sekcjach dokumentu słowo „złoto” oznacza Szardy i zostanie ujednolicone przy przenoszeniu do gry.

### Zapis liczb (jak w Metinie)
- `k` = 1 000, `kk` = 1 000 000, `kkk` = 1 000 000 000, `kkkk` = 1 000 000 000 000.
- Poniżej 1000 pokazujemy pełną liczbę. Powyżej skracamy, z maks. 2 miejscami po przecinku (np. 1 250 000 → 1,25kk).
- Pełna wartość widoczna w podpowiedzi po najechaniu.
- Pola wpisywania (np. ceny, na przyszłość) przyjmują ten sam zapis (np. „1,5kk").
- Format jest w danych per język (w innych językach można podmienić na k/M/B).

### Ulepszacze jako przedmioty
Kamień ulepszenia, Kamień ochronny, Zmieniacz bonusów, Dodatek bonusu, Dodatek mistrzowski, Zmieniacz mistrzowski, Kamień przemiany, Perły. Każdy z unikalnym id i flagą „przenoszalny" (pod przyszły rynek).

### Źródła
| Źródło | Złoto | Ulepszacze |
|---|---|---|
| Zwykłe potwory | główne źródło, rośnie z regionem | Kamień ulepszenia (częsty drop) |
| Bossowie | dużo | Perły, Kamień przemiany (rzadkie) |
| Zadania dzienne | stała nagroda | losowy ulepszacz |
| Skrzynia dzienna | trochę | ulepszacz |
| Sprzedaż zbędnych elementów NPC | tak | nie |
| Bezczynność (offline) | 50% dochodu, limit 8 godzin | tylko złoto |

- Zmieniacze, Dodatki i Kamień ochronny **tylko ze sklepu** (nie dropią). Kamień przemiany i Perły **nie są w sklepie**, tylko z bossów.

### Wydatki
Set 1 w sklepie, Zmieniacze i Dodatki bonusów (w tym mistrzowskie 6–7), Kamień ochronny, opłata za każdą próbę ulepszenia i przerobienia, rangi umiejętności, towarzysz, zmiana królestwa.

### Zasada cen: w „minutach farmienia"
Ceny zapisujemy jako liczbę minut zwykłego farmienia na tierze gracza. Kwotę wylicza się z dochodu na minutę dla tieru, więc system skaluje się sam, a strojenie to zmiana jednej liczby.

| Rzecz | Koszt (minuty farmienia na tierze gracza) |
|---|---|
| Zmieniacz bonusów | 3 |
| Dodatek bonusu | 10 |
| Kamień ochronny | 8 |
| Zmieniacz mistrzowski | 30 |
| Dodatek mistrzowski | 60 |
| Opłata za próbę ulepszenia (+N) | 1 + 0,3 × N |
| Opłata za przerobienie jednego elementu | 60 + ulepszacze (Kamień przemiany + Perły) |
| Pełny set 1 w sklepie | ok. 15–20 (szybki start) |

### Zabezpieczenia
- Koszty rosną z tierem tak jak dochód, a opłaty za próby są stałym ujściem złota.
- Przyszły rynek: podatek ok. 5% od transakcji.
- Cel tempa (do weryfikacji w testach): od startu do pełnego perfekt setu 6 na poziomie 50 ok. 2–4 tygodnie codziennej gry po 1–2 godziny.
- Sprzedaż zbędnych egzemplarzy elementów NPC za złoto.

## 15. Pętla gry ✅ (wszystkie liczby do ustalenia w testach po uruchomieniu prototypu)

### Zasada
Każdy ma równe szanse, a tempo zależy od tego, ile i jak długo gra oraz co wybiera. Nie ma źródła, które da się klikać w nieskończoność z pełną wydajnością, i nie ma przewagi za prawdziwe pieniądze.

### Aktywności na mapie
Każda mapa ma ten sam schemat. Na start jest **jedna mapa** (tier 1, set 1), kolejne dodajemy tym samym szablonem (mapa = wpis w danych).

| Aktywność | Opis | Rola |
|---|---|---|
| **Polowanie** (potwory) | stały strumień zwykłych potworów | bezpieczny, równy zarobek, działa też bezczynnie |
| **Monolit** | pojedynczy duży cel z dużą liczbą życia | szybszy zarobek, główne źródło Kamieni ulepszenia i Odłamków, daje Przepustki do dungeonu |
| **Mini-boss** | silniejszy przeciwnik co ok. 50 zabitych potworów (robocze) | Znaki mini-bossa, Kamienie ulepszenia, szansa na Perłę |
| **Boss mapy** | **3 rodzaje bossów na mapę**, każdy ma własne odnowienie ok. **5 minut** (robocze) i własną tabelę łupów, limit czasu walki | Perły, Znaki, duże ilości Szardów |
| **Dungeon** | osobna sekcja z kilkoma etapami i limitem czasu | najlepsza nagroda za czas: Perły, Rdzenie dungeonu, Kamienie, Szardy |

### Wybór aktywności
- Zakładki na ekranie mapy: Polowanie, Monolit, Boss, Dungeon.
- Przy każdej widać **polecaną moc** i orientacyjną nagrodę na minutę (jak w Metinie, gracz wie, gdzie się opłaca chodzić).
- Słabszy gracz zarabia pewnie na Polowaniu, mocniejszy szybciej na Monolitach, bossach i dungeonach. Nagrody rosną wraz z siłą.

### Monolit
- Gracz **przywołuje Monolit przyciskiem** z krótkim odnowieniem (ok. 60 s, robocze, do potwierdzenia w testach).
- Czas zabicia ok. 30–60 s.
- Z Monolitu wypada **Przepustka do dungeonu**.

### Dungeon
- **Wejście kosztuje 1 Przepustkę dungeonu** (zużywana przy wejściu). Przepustki dropią z Monolitów.
- **Bez limitu wejść:** kto ma przepustki, może wchodzić ile razy chce. Jeden gracz woli polować, drugi bić Monolity, trzeci robić dungeony.
- Przepustki są przenoszalne (pod przyszły rynek). To element progresji i rywalizacji.

### Bezczynność (offline)
Tylko Polowanie daje Szardy offline (np. 50% dochodu, limit 8 godzin). Pozostałe aktywności wymagają aktywnej gry.

### Hamulce przed zalaniem rynku
- Źródła mają własne limity czasu (odnowienie Monolitu, odnowienie bossów, koszt Przepustki dungeonu).
- Ulepszacze się zużywają (nieudane ulepszenia, przerabianie, crafting).
- Bonus Szczęście ma twardy limit łączny (np. +50%).
- **Sklep nie ma limitów dziennych**, hamulcem jest tylko cena.
- Przyszły rynek: podatek ok. 5% od transakcji.

## 16. Katalog ulepszaczy (mapa 1, set 1) ✅

Ten katalog zastępuje wcześniejsze uproszczone opisy (sekcje 7, 12, 14) tam, gdzie się różnią.

| Ulepszacz | Do czego | Skąd | Rzadkość | Przenoszalny |
|---|---|---|---|---|
| **Kamień ulepszenia** | ulepszanie +N | Monolit (często), mini-boss (często), dungeon, Polowanie (rzadko) | częsty | tak |
| **Odłamek monolitu** | materiał (Kamień ochronny, Kamień przemiany) | Monolit | częsty | tak |
| **Znak mini-bossa** | materiał (Kamień przemiany) | mini-boss, bossowie | średni | tak |
| **Perła** | materiał (Kamień przemiany) | boss mapy, dungeon | rzadki | tak |
| **Rdzeń dungeonu** | materiał (Dodatek i Zmieniacz mistrzowski) | tylko dungeon | rzadki | tak |
| **Przepustka do dungeonu** | wejście do dungeonu (zużywana) | Monolit | średni | tak |
| **Kamień ochronny** | ulepszanie bez spadku poziomu przy porażce | craft (Odłamki monolitu + Szardy) lub sklep | średni | tak |
| **Kamień przemiany** | przerabianie na kolejny set | craft (Perły + Odłamki + Znaki + Szardy) | rzadki | tak |
| **Zmieniacz bonusów** | zmiana bonusów 1–5 | sklep (tylko cena jako hamulec) | sklep | tak |
| **Dodatek bonusu** | dodanie bonusu 1–5 | sklep | sklep | tak |
| **Zmieniacz mistrzowski** | zmiana bonusów 6–7 | sklep (drogo) lub craft z Rdzeni dungeonu | bardzo rzadki | tak |
| **Dodatek mistrzowski** | dodanie bonusu 6–7 | sklep (drogo) lub craft z Rdzeni dungeonu | bardzo rzadki | tak |

### Dlaczego tak
- Każda aktywność daje coś innego, więc gracz musi robić wszystko, a nie jedną rzecz w kółko (przemiana wymaga materiałów z Monolitów, mini-bossów i bossów).
- Polowanie to bezpieczna podstawa, Monolit szybkie Kamienie i Przepustki, bossy i dungeon rzadkie materiały.
- Przenoszalność wszystkich ulepszaczy tworzy rynek: jeden woli bić bossów i sprzedawać Perły, inny Monolity i sprzedawać Odłamki, trzeci kupuje gotowy Kamień przemiany.
- Ilości i szanse dropu (ile czego na godzinę) ustalamy w testach po uruchomieniu prototypu i dbamy o zbalansowanie.

## 17. Świat: mapa 1 ✅ (do dopracowania po zobaczeniu w grze)

### Wrzosowe Pogranicze (tier 1, poziomy 1–8, set Wędrowca)
- **Klimat:** wzgórza porośnięte wrzosem, stare kamienne ogrodzenia, ścieżki między lasem a bagnem. Motyw materiałowy: drewno, skóra, kość.
- **Fabuła:** ziemia graniczna między Karmazynową Marchią a Szafirowym Dworem. Obie frakcje startują w swoich miastach, ale na pierwszą mapę wychodzą tą samą drogą. Rywalizacja realizowana osobnymi licznikami wyniku królestw.
- Mapa jest wpisem w danych (nazwa, tier, listy potworów, bossów, monolitu i dungeonu), więc kolejne mapy dodajemy tym samym szablonem.

### Potwory (Polowanie)
| Potwór | Poziomy | Klimat |
|---|---|---|
| Dzik wrzosowiskowy | 1–3 | prosty, powolny |
| Wilk szary | 3–5 | szybszy, w stadach |
| Szkielet pogranicza | 5–8 | kościany strażnik starej granicy |

### Mini-boss
**Przywódca stada** (wielki wilk), pojawia się co ok. 50 zabitych potworów. Daje Znaki mini-bossa i Kamienie ulepszenia.

### Bossy mapy (3, każdy ze swoim odnowieniem ok. 5 minut)
| Boss | Klimat | Łup (nacisk) |
|---|---|---|
| Król Dzików | ogromny dzik z kłami jak miecze | Znaki mini-bossa, trochę Pereł |
| Strażnik Granicy | pancerny szkielet z tarczą | Perły i Znaki po równo |
| Wiedźma Wrzosowisk | starucha z kosturem i wronami | najwięcej Pereł, rzadko Przepustka |

### Monolit
**Monolit Pogranicza**: kamienny słup z runami, który pęka po zabiciu. Daje Odłamki monolitu, Kamienie ulepszenia i Przepustkę do dungeonu.

### Dungeon
**Kopiec Zapomnianych**: pradawny kurhan na granicy, trzy etapy (hordy szkieletów, mini-boss, boss końcowy **Kościany Władca**). Wejście za Przepustkę. Nagrody: Perły, Rdzenie kopca, Kamienie ulepszenia, Szardy.

### Animacje i odczucie gry (wymaganie)
Animacje i efekty są kluczowe dla utrzymania gracza. Obowiązkowe elementy już w pierwszej wersji:
- Wyraźna animacja ataku postaci (zależna od typu broni) i reakcja trafionego potwora (drgnięcie, rozbłysk, liczby obrażeń, wyróżnione krytyki).
- Efektowna śmierć potworów, rozsypujące się Szardy i przedmioty zbierane do plecaka.
- Osobne, mocniejsze animacje dla Monolitu (pękanie), mini-bossa i bossów (wejście, ostrzeżenie, śmierć).
- Animacja awansu na kolejny poziom i animacja ulepszania przedmiotu (sukces, porażka, perfekt bonus).
- Dźwięk i drobne efekty dla kliknięć, krytyków, dropów rzadkich przedmiotów.
- Wszystko z opcją redukcji ruchu i wyciszenia dla komfortu i wydajności.

## 18. Początek gry (pierwsze ok. 7 minut) ✅ (do poprawienia po zobaczeniu w grze)

| Czas | Co się dzieje | Czego gracz się uczy |
|---|---|---|
| 0:00 | Ekran startowy, **wybór królestwa** (Karmazynowa Marchia lub Szafirowy Dwór) z krótkim opisem stylu gry | wybór ma znaczenie |
| 0:30 | **Wybór klasy** (Wojownik, Łucznik, Mag), wyglądu i imienia | tożsamość postaci |
| 1:00 | **Prolog:** 2–3 zdania z obrazem, bez długiej historii | świat |
| 1:30 | **Pierwsza walka:** gracz klika w potwora, widzi liczby i animacje | klikanie |
| 2:30 | **Pierwszy awans** z animacją | postęp |
| 3:00 | Zakup **seta 1** w sklepie za pierwsze Szardy | sklep i ekwipunek |
| 4:00 | **Poziom 5:** wybór ścieżki u trenera w mieście, pierwsza umiejętność | umiejętności |
| 4:30 | Pierwszy **Kamień ulepszenia**, ulepszenie do +1 i +2 | ulepszanie |
| 5:30 | **Pierwszy mini-boss** (Przywódca stada) | walka z mocniejszym celem |
| 6:30 | Odblokowanie **Monolitu** (przycisk „Przywołaj") | wybór aktywności |
| 7:00 | **Towarzysz** i pierwszy **Boss mapy** (Król Dzików) | cel długoterminowy |

### Zasady przepływu
- Każda mechanika odblokowuje się w swoim momencie, żeby gracz nie był przytłoczony.
- Podpowiedzi są krótkie, wskazują konkretny przycisk i można je wyłączyć.
- Na poziomach 1–4 gracz nie może się zablokować: zawsze coś się opłaca zrobić.
- Tempo (czasy odblokowań) jest w danych i łatwo zmienia się po testach.

## 19. Zakres MVP i lista na później ✅

### Cel MVP
Pierwszy działający prototyp, w którym da się przejść cały początek gry i sprawdzić, czy pętla (Polowanie, Monolit, mini-boss, bossy, dungeon, ulepszanie, bonusowanie) jest satysfakcjonująca. Całość oparta na **danych**, żeby każdą mechanikę, wartość, nazwę i mapę dało się łatwo zmienić lub dodać.

### Wchodzi do MVP
- Wybór królestwa (2), klasy (3 klasy, 6 ścieżek, wygląd, imię).
- Levelowanie, limit poziomu 50 (parametr), treść mapy 1 na poziomy 1–8.
- Umiejętności: 3 na ścieżkę, rangi 1–10 (z ulepszaczami od rangi 6).
- Towarzysz: bonusy, suwak XP, pasek buffów.
- Ekwipunek: 8 + 3 slotów, set 1 (kupowany w sklepie), ulepszanie +0 do +9 z dwoma kamieniami, bonusy 1–5 i 6–7, okno przedmiotu z podglądem.
- Typy broni (6) i tempo, tarcza dla wszystkich klas.
- Mapa 1: Polowanie, Monolit, mini-boss, 3 bossy, dungeon z Przepustkami.
- Waluta (Szard), zapis liczb k/kk/kkk, ulepszacze i sklep.
- Animacje, dźwięk i początek gry (sekcja 18).
- Mechanika przerabiania setu (testowo, z definicją setu 2 do sprawdzenia reguł), nawet jeśli pełna mapa 2 jeszcze nie istnieje.

### Później
- Mapy 2–6 i sety 2–6 (tym samym szablonem).
- Kolejne królestwa i klasy (wpis w danych).
- Rynek między graczami (wymaga serwera), podatek 5%.
- Ranking, wojny królestw, wspólne wydarzenia, sety i bonusy PvP (serwer).
- Konta i zapis w chmurze.
- Przenoszenie bonusów, zestawy ekwipunku do przełączania, kosmetyki.
- Dopracowanie liczb (drop, ceny, szanse) w testach, symulacja balansu 12 buildów.

### Zasada nadrzędna (przypomnienie)
Cała gra jest łatwo rozwijalna i zmienialna: królestwa, klasy, ścieżki, bonusy, sety, mapy, bossy, ulepszacze, ceny, szanse i czasy odblokowań to dane, nie kod wpisany na sztywno.
