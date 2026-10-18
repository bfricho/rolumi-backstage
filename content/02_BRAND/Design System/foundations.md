# Foundations

## Farby

### Hlavné brandové farby

| Token | HEX | RGB | CMYK | Použitie | Status |
|---|---|---|---|---|---|
| `color.brand.ink` | `#1D1E1F` | `29, 30, 31` | `6, 3, 0, 88` | Primárny text, tmavé plochy, logo | Brand source |
| `color.brand.yellow` | `#F9B62B` | `249, 182, 43` | `0, 27, 83, 2` | Akcent, CTA, zvýraznenie, symbol | Brand source |
| `color.brand.white` | `#FFFFFF` | `255, 255, 255` | podľa tlačového média | Svetlé plochy a inverzný text | System rule |

### Implementačné neutrálne farby

Neutrálne odtiene sú funkčným rozšírením. Slúžia na oddelenie povrchov, okraje a sekundárny text; nemajú nahrádzať hlavné brandové farby.

| Token | HEX | Použitie |
|---|---|---|
| `neutral.800` | `#2A2B2D` | Vyvýšený povrch na tmavom pozadí |
| `neutral.700` | `#444649` | Sekundárny tmavý povrch |
| `neutral.600` | `#606367` | Sekundárny text na svetlom pozadí |
| `neutral.300` | `#C7C9CB` | Výraznejší okraj |
| `neutral.200` | `#DFE1E2` | Štandardný okraj |
| `neutral.100` | `#F1F2F2` | Jemne odlíšená sekcia |
| `neutral.50` | `#F8F8F7` | Veľmi jemný povrch |

### Kontrast

- Grafitová na žltej: približne `9.35 : 1` - vhodná aj pre bežný text.
- Biela na grafitovej: približne `16.70 : 1` - vhodná aj pre bežný text.
- Biela na žltej: približne `1.79 : 1` - nepoužívať na text ani dôležité UI.
- Žltá na bielej: približne `1.79 : 1` - používať iba ako veľkú dekoratívnu plochu, nie ako text.

Žltá preto na svetlom pozadí funguje ako výplň, linka alebo značka doplnená grafitovým textom. Na grafitovom pozadí môže byť použitá aj na text a ikony.

## Typografia

### Rodiny a rezy

| Úloha | Písmo | Rez | Status |
|---|---|---|---|
| Nadpisy a dominantné čísla | Inter | ExtraBold 800 | Brand source |
| Bežný text | Inter | Regular 400 | Brand source |
| Kancelársky fallback | Arial | Bold 700 / Regular 400 | Brand source |
| Digitálny fallback stack | Inter, Arial, Helvetica, sans-serif | podľa úlohy | System rule |

Nepoužívaj Aktiv Grotesk zo súčasnej Squarespace stránky ako brandový font.

### Typografická škála

| Token | Veľkosť | Riadkovanie | Použitie |
|---|---:|---:|---|
| `display` | `clamp(44px, 6vw, 72px)` | `1.00` | Hlavné posolstvo stránky alebo kampane |
| `heading-1` | `clamp(36px, 4vw, 56px)` | `1.05` | Hlavný nadpis |
| `heading-2` | `clamp(28px, 3vw, 40px)` | `1.10` | Sekcia |
| `heading-3` | `24px` | `1.20` | Karta alebo podsekcia |
| `body-large` | `20px` | `1.50` | Úvodný text |
| `body` | `16px` | `1.60` | Základný text |
| `small` | `14px` | `1.45` | Doplnková informácia |
| `label` | `12px` | `1.20` | Eyebrow, štítok, metadata |

Nadpisy používajú ExtraBold. Text používa Regular. Veľké písmená používaj najmä na krátke labely; dlhé vety verzálkami znižujú čitateľnosť.

## Spacing

Systém používa štvorbodovú mriežku.

| Token | Hodnota |
|---|---:|
| `space.1` | `4px` |
| `space.2` | `8px` |
| `space.3` | `12px` |
| `space.4` | `16px` |
| `space.6` | `24px` |
| `space.8` | `32px` |
| `space.12` | `48px` |
| `space.16` | `64px` |
| `space.24` | `96px` |

Nepoužívaj náhodné medzery mimo škály, ak to nevyžaduje optické vyrovnanie loga alebo média.

## Layout

- Maximálna šírka hlavného obsahu: `1200px`.
- Desktop: 12 stĺpcov, medzera `24px`.
- Tablet: 8 stĺpcov, medzera `20px`.
- Mobil: 4 stĺpce, medzera `16px`.
- Minimálny bočný okraj: `20px` mobil, `32px` tablet, `48px` desktop.
- Sekcie majú dýchať; typická vertikálna medzera je `64-96px`.

## Tvary a hrany

Základ značky je hranatý a konštrukčný. Komponenty majú predvolene nulové zaoblenie. Jemné `2px` zaoblenie je prípustné iba tam, kde pomáha vykresleniu ovládacieho prvku.

Fotografia má dve schválené výnimky:

- veľký obraz vložený do layoutu používa jemný radius `24px` na desktope a `16px` na mobile,
- ovál alebo kapsula sa používa ako zámerný fotografický motív podľa `photography.md`.

Skutočný full-bleed obraz siaha až po okraj viewportu alebo formátu a používa radius `0`. Fotografický radius neprenášaj na tlačidlá, karty, formuláre ani ostatné UI komponenty.

## Grafický motív

Povolený je diagonálny geometrický motív odvodený od symbolu loga:

- tenké obrysové línie,
- opakovanie rovnobežných diagonál,
- nízky kontrast na pozadí,
- nikdy nesmie súperiť s logom alebo textom,
- nepoužívať ako náhodný dekor bez väzby na mriežku.

## Fotografia

Kompletné pravidlá a schválené vizuálne referencie sú v `photography.md`.

Uprednostni:

- skutočné priestory ROLUMI,
- ľudí pri práci alebo v kontakte so zákazníkom,
- materiály, textúry a remeselný detail,
- hotové realizácie aj priebeh práce,
- prirodzené svetlo a realistické farby.

Podľa účelu vyber jeden zo štyroch režimov: oválna kompozícia, veľkoformátový obraz s obsahom, čistý veľkoformátový obraz alebo štandardný obdĺžnik.

Vyhni sa:

- generickým stockovým fotografiám s naaranžovanými modelmi,
- silným farebným filtrom,
- neprirodzenému HDR,
- kolážam s množstvom nesúrodých tvarov,
- textu položenému priamo na rušnú fotografiu bez kontrastnej vrstvy.
