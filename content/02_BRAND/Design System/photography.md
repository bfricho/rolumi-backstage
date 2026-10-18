# Fotografia

Fotografia ROLUMI je autentická, pevná a prirodzená. Má ukazovať skutočné miesto, priebeh práce, materiály, sortiment a výsledky bez dojmu generickej fotobanky.

Tieto pravidlá sú schválenou súčasťou design systému. Vizuálne referencie sú uložené v `examples/` ako rýchle PNG náhľady aj samostatné SVG zdroje.

## Obsah fotografie

Uprednostni štyri základné roly:

1. **Miesto** – predajňa, sklad, zázemie a jasne rozpoznateľné prostredie ROLUMI.
2. **Proces** – stavba, doprava, manipulácia s materiálom a práca v reálnom stave.
3. **Materiál** – textúra, detail, rytmus a remeselná kvalita.
4. **Sortiment** – produkty v skutočnom priestore predajne, nie izolované katalógové packshoty bez kontextu.

Preferuj prirodzené svetlo, realistické farby, jednoznačný hlavný objekt a dostatok pokojného priestoru v kompozícii. Fotografia môže byť dokumentárna, ale nesmie pôsobiť náhodne alebo zanedbane.

## Schválené obrazové režimy

### 1. Oválna kompozícia

Ovál alebo kapsula je schválený výrazový prvok pre vybrané fotografie. Má robiť kompozíciu osobitejšou, nie byť automatickou maskou každého obrazu.

Povolené použitia:

- jeden široký horizontálny ovál ako hlavný obraz,
- dvojica vertikálnych kapsúl pre dve súvisiace perspektívy,
- veľký kruh alebo ovál orezaný hranou vlastnej plochy,
- jeden menší oválny detail ako jasný bod pozornosti.

Pravidlá:

- v jednej kompozícii používaj spravidla jeden dominantný oválny princíp,
- obraz môže siahať po hranu vlastného modulu, nesmie však prechádzať do susedného modulu alebo fotografie,
- ovál nekombinuj s ďalšími náhodnými organickými maskami,
- výrez musí zachovať hlavný objekt a prirodzenú perspektívu,
- kruhový žltý akcent môže sprevádzať fotografiu, nesmie prekrývať logo ani dôležitý obsah.

Referenčná tabuľa: `examples/photography-oval-compositions.png`.

### 2. Veľkoformátová fotografia s obsahom

Fotografia môže niesť hlavné posolstvo a siahať od okraja po okraj. Text a logo sa ukladajú priamo do obrazu iba vtedy, keď má záber dostatočne pokojné miesto.

- používaj krátke posolstvo, ideálne jeden nadpis,
- kontrast vytvor výberom záberu alebo lokálnym tmavým prechodom,
- nestmavuj celý obraz bez dôvodu,
- žltá slúži ako krátka linka, detail alebo akcent,
- logo musí mať ochrannú zónu a kontrast podľa `logo.md`.

Referenčná tabuľa: `examples/photography-large-format.png`.

### 3. Čistá veľkoformátová fotografia

Čistá verzia neobsahuje text, logo, farebný filter ani grafický overlay. Použi ju, keď obraz tvorí atmosféru, oddeľuje sekcie alebo má hovoriť sám za seba.

- **skutočný full-bleed:** fotografia siaha po okraj viewportu alebo výsledného formátu; radius je `0`,
- **veľký obraz vložený do layoutu:** radius je `24px` na desktope a `16px` na mobile,
- zaoblenie má zostať jemné; nesmie sa približovať kapsulovému alebo oválnemu tvaru.

Referenčná tabuľa: `examples/photography-large-format-clean.png`.

### 4. Štandardný obdĺžnik

Pravouhlý výrez ostáva základným funkčným riešením pre karty, zoznamy, galérie a hustejšie informačné rozhrania. Karty a UI komponenty majú radius `0`; fotografický radius `16–24px` patrí iba samostatnému veľkému obrazu vloženému do layoutu.

## Výber režimu

| Situácia | Odporúčaný režim |
|---|---|
| Hlavný webový hero | Veľkoformátová fotografia s obsahom alebo čistý full-bleed |
| Predstavenie miesta alebo služby | Široký ovál alebo dvojica kapsúl |
| Atmosférické oddelenie sekcií | Čistá veľkoformátová fotografia |
| Detail materiálu | Menší oválny detail alebo čistý veľký obraz |
| Karta, zoznam, katalóg | Štandardný obdĺžnik |
| Viac samostatných príbehov vedľa seba | Každý obraz musí zostať v hraniciach vlastného modulu |

## Text na fotografii

- Text ukladaj do pokojnej časti záberu.
- Pre svetlý text používaj tmavú časť fotografie alebo lokálny grafitový prechod.
- Nepoužívaj polopriehľadný žltý overlay cez fotografiu.
- Do jednej fotografie nevkladaj dlhý odsek. Dlhší obsah patrí mimo obrazu.
- Ak fotografia neposkytuje dostatočný kontrast, použi čistú verziu a text umiestni vedľa nej.

## Úprava obrazu

Povolené sú korekcie expozície, vyváženia bielej, kontrastu a jemné lokálne stmavenie pre čitateľnosť. Zachovaj realistické materiály a farby.

Nepoužívaj:

- agresívne HDR,
- silné brandové prefarbenie celej fotografie,
- generické stockové scény s naaranžovanými modelmi,
- viac nesúrodých masiek v jednej kompozícii,
- dekoratívny tieň okolo fotografie,
- prechod fotografie cez hranicu susedného modulu.
