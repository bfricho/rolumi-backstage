# Pravidlá práce so značkou ROLUMI

Tento priečinok je zdroj pravdy pre vizuálnu identitu ROLUMI. Agent, ktorý vytvára vizuálny alebo komunikačný výstup, musí pred začatím práce prečítať tento dokument a relevantnú časť priečinka `Design System`.

## Poradie autority

Pri rozpore medzi podkladmi platí toto poradie:

1. schválené SVG logá uložené v tomto priečinku,
2. pravidlá v `Design System`,
3. pôvodný PDF brand manuál,
4. súčasný web ROLUMI iba ako referencia reálneho použitia.

Web bol vytvorený zo Squarespace šablóny. Jeho font Aktiv Grotesk, sivé CTA tlačidlá a konkrétne rozloženia nie sú automaticky súčasťou značky. Oválny fotografický princíp bol následne spracovaný a schválený iba v rozsahu pravidiel `Design System/photography.md`.

## Povinné pravidlá

- Používaj iba schválené varianty loga. Logo neprekresľuj ani neskladaj z textu a symbolu. Samostatný znak je výnimkou iba pre sociálne formáty podľa `Design System/socials.md`.
- Nemeň proporcie, orientáciu, farby ani vzájomnú polohu častí loga.
- Na svetlom pozadí používaj primárne `Rolumi_logo.svg`.
- Na tmavom pozadí používaj primárne `Rolumi_logo_white_yellowSymbol.svg`.
- Na žltom pozadí používaj prednostne jednofarebné brandovo čierne logo. `Rolumi_logo_white_blackSymbol.svg` je prípustné vo veľkom formáte, ak biela časť ostáva jasne čitateľná.
- Čisté čierne logo `Rolumi_logo_black.svg` používaj iba tam, kde technológia neumožňuje brandovú farbu `#1D1E1F`.
- Zachovaj okolo loga minimálne ochrannú zónu definovanú v `Design System/logo.md`.
- Primárne písmo je Inter. Arial je náhradné písmo pre prostredia, kde Inter nie je dostupný.
- Používaj iba základné farby `#1D1E1F`, `#F9B62B` a bielu. Neutrálne farby z design systému sú povolené na povrchy, okraje a sekundárny text.
- Žltý text nepoužívaj na bielom alebo inom svetlom pozadí. Biely text nepoužívaj na žltom pozadí.
- Uprednostni ostré hrany, jasnú hierarchiu, veľkorysý priestor a funkčný geometrický layout.
- Fotografie majú pôsobiť autenticky: reálni ľudia, materiály, predajňa, stavby, remeslo a výsledky práce. Vyhýbaj sa generickým stockovým scénam.
- Pred použitím fotografie vyber schválený režim z `Design System/photography.md`: oválna kompozícia, veľkoformátový obraz s obsahom, čistý veľkoformátový obraz alebo štandardný obdĺžnik.
- Skutočný full-bleed obraz má radius `0`; veľký obraz vložený do layoutu má radius `24px` na desktope a `16px` na mobile. UI komponenty ostávajú hranaté.
- Oválny obraz nesmie prechádzať do susedného modulu alebo inej fotografie.
- Nepoužívaj efekty na logo: tieň, obrys, priehľadnosť, masku, farebný prechod ani deformáciu.

## Ako začať nový výstup

1. Urči médium, formát a účel výstupu.
2. Otvor `Design System/README.md` a príslušné pravidlá.
3. Použi tokeny z `Design System/tokens.css` alebo `Design System/tokens.json`.
4. Vyber logo podľa pozadia, nie podľa osobnej preferencie.
5. Skontroluj kontrast, ochrannú zónu, čitateľnosť a slovenskú diakritiku.
6. Ak systém daný prípad nepokrýva, nevymýšľaj nové pravidlo potichu. Zaznamenaj návrh do `TODO.md` a označ ho na schválenie.

## Práca so súbormi

- Pôvodné PDF a SVG sú zdrojové podklady. Neprepisuj ich.
- Nové systémové pravidlá a ukážky patria do `Design System`.
- Nové exporty pre konkrétny projekt ukladaj do priečinka daného projektu, nie medzi zdrojové logá.
- Nevytváraj ďalšie kópie loga s nejasnými názvami typu `final`, `new` alebo `v2`.
- Ak sa schváli zmena značky, aktualizuj `DECISIONS.md`, dokumentáciu, tokeny aj vizuálny katalóg v jednom kroku.

## Čo tento priečinok zatiaľ neurčuje

Brand systém zatiaľ neobsahuje samostatný symbol na všeobecné použitie, malú digitálnu značku, favicon ani tone of voice. Samostatný znak je schválený iba pre sociálne siete v presne definovanom použití podľa `Design System/socials.md`; agent ho nesmie bez nového rozhodnutia preniesť do iného média.
