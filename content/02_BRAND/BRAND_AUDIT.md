# Audit značky a design systému ROLUMI

**Dátum validácie:** 18. 10. 2026  
**Rozsah:** zdrojové logá, pravidlá značky, design tokeny, typografia, fotografia, digitálne komponenty, sociálne formáty a živé HTML katalógy  
**Výsledok:** základný brand systém je funkčný, konzistentný a pripravený na bežnú digitálnu tvorbu. Etapa Brand má dokončené jadro, ale zostáva niekoľko rozhodnutí potrebných pred novým webom a širšou transformáciou spoločnosti.

## 1. Záver auditu

ROLUMI má zdokumentovaný a prakticky použiteľný základ značky:

- schválené varianty loga a pravidlá ich výberu podľa pozadia,
- definované hlavné a neutrálne farby vrátane pravidiel kontrastu,
- lokálne dostupné písmo Inter a náhradný typografický systém,
- layout, spacing, tvary, grafický motív a základné digitálne komponenty,
- štyri schválené režimy fotografie,
- samostatne spracovaný systém pre Facebook a Instagram,
- CSS a JSON tokeny pre implementáciu,
- pravidlá správy značky, register rozhodnutí a zoznam otvorených úloh,
- živý HTML katalóg design systému a sociálnych formátov.

Design systém preto nie je iba návrh. Je použiteľný ako zdroj pravdy pre ďalšie dokumenty, webové návrhy a komunikačné výstupy.

Etapu Brand však zatiaľ nemožno považovať za definitívne uzavretú. Transformácia ROLUMI môže zmeniť význam označenia `STAVEBNINY`, slovník značky a požiadavky na malú digitálnu identitu. Tieto rozhodnutia musia nadviazať na stratégiu a positioning.

## 2. Čo bolo validované

| Oblasť | Stav | Zistenie |
|---|---|---|
| Zdroj pravdy a pravidlá | Hotové | `AGENTS.md`, `DECISIONS.md`, README a odborné pravidlá majú jasnú hierarchiu autority. |
| Logá | Hotové pre štandardné použitie | Sedem hlavných SVG variantov je dostupných a technicky čitateľných. Výber podľa pozadia je zdokumentovaný. |
| Farby a kontrast | Hotové | Deklarované pomery boli nezávisle prepočítané: grafitová/žltá `9,35 : 1`, biela/grafitová `16,70 : 1`, biela/žltá iba `1,79 : 1`. Pravidlá použitia sú správne nastavené. |
| Typografia | Hotové | Inter Variable je lokálne dostupný ako platný WOFF2 súbor; Arial je definovaný ako fallback. |
| Design tokeny | Hotové | CSS a JSON pokrývajú farby, typografiu, spacing, tvary, layout a motion. Verzia tokenov bola pri audite zosúladená s katalógom na `1.2.0`. |
| Layout a geometria | Hotové | Mriežka, spacing, ostré UI hrany a diagonálny motív majú jednoznačné pravidlá. |
| Fotografia | Pravidlá hotové | Režimy fotografie, výrezy, radius a práca s textom sú definované a podporené referenčnými ukážkami. Knižnica fotografií sa má ďalej rozširovať. |
| Digitálne komponenty | Základ hotový | Pokryté sú tlačidlá, odkazy, karty, navigačný princíp, formuláre, sekčné hlavičky, oznamy a základ ikon. Nejde ešte o kompletnú produkčnú UI knižnicu. |
| Sociálne siete | Hotové pre organický obsah | Definované sú feedy, carousel cover, Stories, Reels, bezpečné zóny a obmedzené použitie samostatného znaku. |
| Živé katalógy | Hotové | Hlavný katalóg aj social media katalóg sa načítali bez chýb konzoly; všetky lokálne odkazy na assety sa resolvujú. |
| Governance | Dobrý základ | Existuje register rozhodnutí, otvorených úloh a pravidlá pre nové výstupy. Chýba evidencia práv a schválenia fotografií. |

## 3. Čo ešte chýba

### Priorita A — rozhodnúť pred novým webom

1. **Descriptor `STAVEBNINY`.** Rozhodnúť, či zostane univerzálnou súčasťou loga aj po zmene obchodného modelu a komunikácie spoločnosti.
2. **Tone of voice.** Po uzavretí stratégie a positioningu definovať slovník, štýl textov, hlavné posolstvá, zakázané formulácie a ukážky použitia.
3. **Malá digitálna značka a favicon.** Schváliť riešenie pre rozmery, v ktorých je horizontálne logo s descriptorom nečitateľné. Sociálna výnimka pre samostatný znak sa na web automaticky nevzťahuje.

### Priorita B — doplniť počas tvorby webu

4. **Produkčné stavy komponentov.** Doplniť mobilnú navigáciu a stavy `disabled`, `loading`, `success`, validačnú chybu a prázdny stav podľa reálnych potrieb webu.
5. **Ikonografia.** Vybrať konkrétnu základnú sadu ikon a určiť veľkosti, hrúbku ťahu a pravidlá použitia.
6. **Prístupnostná kontrola implementácie.** Pri hotovom webe overiť klávesnicu, focus, kontrast reálnych kombinácií, alternatívne texty a správanie pri zväčšení textu. Aktuálne tokeny vytvárajú dobrý základ, ale nenahrádzajú kontrolu hotového rozhrania.

### Priorita C — prevádzková a produkčná kvalita

7. **Minimálna veľkosť loga.** Praktické minimum `180 px / 40 mm` je operatívne; treba ho otestovať a definitívne schváliť.
8. **Tlačový workflow.** Overiť dostupnosť produkčných PDF/EPS podkladov a dohodnúť CMYK, nátlač a prípadné priame farby s dodávateľom tlače.
9. **Fotobanka a práva.** Rozšíriť knižnicu o ľudí pri práci, dopravu a realizácie a pri každom assete evidovať autora, licenciu alebo súhlas, dátum a povolené použitie.
10. **Šablóny podľa potreby.** Postupne pripraviť len reálne potrebné šablóny — napríklad ponuku, prezentáciu, hlavičkový dokument, e-mailový podpis alebo označenie prevádzky. Nemajú vznikať predčasne bez konkrétneho použitia.

## 4. Stav etapy Brand v roadmape

**Stav: jadro dokončené a validované; rozvoj pokračuje podľa stratégie.**

Za splnený možno považovať pôvodný cieľ zdokumentovať aktuálny vizuálny systém tak, aby sa dal konzistentne používať. Otvorené body nie sú dôvodom prestať design systém používať. Sú to konkrétne nadväzujúce rozhodnutia a produkčné doplnenia.

Najbližšie tri rozhodnutia sú:

1. uzavrieť positioning a význam značky po transformácii,
2. rozhodnúť o descriptor-e `STAVEBNINY`,
3. následne doplniť tone of voice a malú digitálnu značku pre web.

## 5. Zdroje

- [Prehľad brand priečinka](./README.md)
- [Design System](./Design%20System/README.md)
- [Otvorené úlohy](./TODO.md)
- [Rozhodnutia](./DECISIONS.md)
- [Živý katalóg](./Design%20System/index.html)
- [Sociálne formáty](./Design%20System/socials/index.html)
