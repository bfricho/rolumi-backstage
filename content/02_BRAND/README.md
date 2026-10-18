# Brand ROLUMI

Tento priečinok obsahuje aktuálne zdrojové podklady značky a ich praktické spracovanie do design systému.

## Zdroj pravdy

Značka stojí na jednoduchom, kontrastnom vizuálnom jazyku:

- grafitová čierna `#1D1E1F`,
- signálna žltá `#F9B62B`,
- biela,
- písmo Inter ExtraBold a Inter Regular,
- horizontálne logo so symbolom a označením `STAVEBNINY`,
- geometria odvodená od diagonálnych častí symbolu,
- autentická fotografia predajne, stavieb, materiálov a ľudí.

## Mapa podkladov

| Súbor | Obsah | Odporúčané použitie |
|---|---|---|
| `Rolumi_brandmanual_new.pdf` | Pôvodný 19-stranový brand manuál z roku 2020 | Historický a vizuálny zdroj pravidiel |
| `Rolumi_logo.svg` | Žltý symbol, grafitový názov a descriptor | Predvolená verzia na biele a svetlé pozadia |
| `Rolumi_logo_black(Brand).svg` | Celé logo v brandovej grafitovej `#1D1E1F` | Jednofarebná aplikácia na svetlom pozadí |
| `Rolumi_logo_black.svg` | Celé logo v čistej čiernej | Iba technická jednofarebná tlač |
| `Rolumi_logo_white.svg` | Celé logo v bielej | Fotografie a tmavé farebné pozadia s dostatočným kontrastom |
| `Rolumi_logo_white_blackSymbol.svg` | Biely názov, grafitový symbol | Žlté pozadie |
| `Rolumi_logo_white_yellowSymbol.svg` | Biely názov, žltý symbol | Predvolená verzia na grafitovom a tmavom pozadí |
| `Rolumi_logo_yellow.svg` | Celé logo v žltej | Akcentová jednofarebná aplikácia na grafitovom pozadí |
| `Design System/` | Aktuálne pravidlá, tokeny a vizuálne ukážky | Praktický zdroj pre nové výstupy |
| `Design System/photography.md` | Schválený obrazový smer | Oválne kompozície, veľkoformátové a čisté fotografie |
| `BRAND_AUDIT.md` | Validácia aktuálneho systému a prioritizované medzery | Stav etapy Brand a podklad pre roadmapu |

## Čo bolo potvrdené auditom

- SVG sú vektorové a majú horizontálny pomer približne `220 : 58`.
- Logo obsahuje descriptor `STAVEBNINY`; samostatný symbol ani logo bez descriptoru neboli dodané.
- Brand manuál definuje dve hlavné farby, typografiu, varianty loga, ochrannú zónu a základné aplikácie.
- Brand manuál ukazuje vizitky, oblečenie, hlavičkový papier, zakladač, označenie budovy a sociálne siete.
- Aktuálny web správne používa tmavý základ, žltý akcent, výraznú typografiu a autentické fotografie.
- Aktiv Grotesk, sivá `#949189` a konkrétne komponenty webu pochádzajú zo Squarespace riešenia a nie sú zdrojovými prvkami brand manuálu.
- Oválny princíp zo súčasného webu bol samostatne posúdený, rozvinutý a schválený ako fotografický motív podľa `Design System/photography.md`.

## Ako priečinok používať

- Pre rýchly prehľad otvor `Design System/index.html`.
- Pre aktuálny stav a chýbajúce časti otvor `BRAND_AUDIT.md`.
- Pre implementáciu používaj `Design System/tokens.css` alebo `Design System/tokens.json`.
- Pre logo otvor `Design System/logo.md`.
- Pre farby, typografiu a layout otvor `Design System/foundations.md`.
- Pre fotografiu a obrazové kompozície otvor `Design System/photography.md`.
- Pre digitálne komponenty otvor `Design System/components.md`.
- Pravidlá pre agentov sú v `AGENTS.md`.
- Platné rozhodnutia a odchýlky sú v `DECISIONS.md`.
- Otvorené medzery sú v `TODO.md`.

## Stav

Toto je spracovanie existujúcej značky, nie rebranding. Brand zostáva aktuálny. Jadro design systému bolo validované 18. 10. 2026 a je pripravené na bežnú digitálnu tvorbu. Strategicky závislé a produkčné medzery sú pomenované v `BRAND_AUDIT.md` a `TODO.md`.
