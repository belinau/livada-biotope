Navodila za urejanje vsebine za livada.bio
Dobrodošli pri urejanju vsebine za spletno stran livada.bio! Ta dokument vam bo pomagal pri ustvarjanju in upravljanju vseh vrst vsebin, ki so prikazane na spletni strani.

Vsebine so organizirane v Markdown datotekah z delom, imenovanim frontmatter, ki je na začetku vsake datoteke. Ta frontmatter omogoča dodajanje pomembnih informacij (metapodatkov), kot so naslov, datum, oznake in poti do slik.

1. Splošna pravila in nasveti
1.1. Dvojezična vsebina (slovenski in angleški jezik):
Spletišče livada.bio podpira dva jezika: slovenščino (SL) in angleščino (EN). Za skoraj vsak kos vsebine boste morali ustvariti dve ločeni datoteki:

Eno za slovenski jezik, ki se konča z .sl.md (npr. moj-clanek.sl.md).

Eno za angleški jezik, ki se konča z .en.md (npr. my-article.en.md).

Pomembno: Ime datoteke (pred jezikovno pripono) mora biti enako za oba jezika (npr. moj-clanek in my-article).

Izjema: Stran "Prepletanja" (Intertwinings) uporablja samo eno datoteko (intertwinings.md), ki vsebuje dvojezične naslove in opise v svojem frontmatter-ju.

1.2. Kje so shranjene vsebine (struktura map):
Vsebina vaše spletne strani je shranjena v naslednjih mapah:

content/posts/: Za Objave (sekcija "Zapisi" - Writings).

content/practices/: Za Prakse (sekcija "Utelešenja" - Embodiments), vključno z navodili ("Instructables").

content/galleries/: Za Galerije slik (sekcija "Galerija" - Gallery).

content/pages/: Za Statične strani (npr. "Domov" - Home, "Prepletanja" - Intertwinings).

1.3. Uporaba frontmatter-ja (glave datoteke):
Vsaka Markdown datoteka z vsebino se mora začeti in končati s tremi pomišljaji (---). Med njima boste v YAML formatu definirali metapodatke za to vsebino.

Primer:

---
title: Moj naslov
date: 2025-06-26T10:00:00.000Z # Obvezen format datuma in časa
tags:
  - primer
  - vsebina
---

1.4. Dvojezični naslovi in opisi v frontmatter-ju:
Za polja, kot so title (naslov) in description (opis), ki se lahko razlikujejo glede na jezik, uporabite gnezdeni format:

title:
  sl: Slovenski naslov
  en: English Title
description:
  sl: Slovenski opis vsebine.
  en: English description of content.

Priporočljivo je, da vedno uporabite dvojezični format, tudi če je vsebina sprva enaka, da se izognete manjkajočim prevodom in zagotovite polno podporo za oba jezika.

1.5. Slike in njihove poti:

Slike za galerije (sekcija "Galerija"): Te slike morajo biti shranjene v mapi /public/galleries/. Ko se nanjo sklicujete v frontmatter-ju galerije, uporabite pot, ki se začne z /galleries/.

Primer poti v frontmatter-ju: /galleries/moja-slika-1.jpg

Slike, ki jih vstavite v samo Markdown vsebino (za objave in prakse/navodila): Te slike shranite v podmape znotraj /public/images/. Sami se odločite, ali jih boste organizirali po tipu vsebine (npr. /public/images/posts/, /public/images/practices/, /public/images/instructables/) ali v eno samo mapo.

Primer poti v Markdown vsebini: ![Opis slike](/images/posts/primer-slike.jpg)

Vedno poskrbite, da so slike optimizirane za splet (manjša velikost datoteke) in da imajo smiselna imena.

1.6. Markdown oblikovanje besedila:
Znotraj glavnega dela Markdown datoteke lahko uporabite standardno Markdown sintakso za oblikovanje besedila:

Naslovi:

# Glavni naslov
## Podnaslov prve ravni
### Podnaslov druge ravni

Krepko besedilo: **to je krepko**

Poševno besedilo: *to je poševno*

Seznami (neurejeni):

* Prvi element seznama
* Drugi element seznama
  * Vgnezdni element

Oštevilčeni seznami:

1. Prvi oštevilčeni element
2. Drugi oštevilčeni element

Povezave: [Besedilo, ki se prikaže](https://url-povezave.com)

Slike v vsebini: ![Opis slike](/pot/do/slike.jpg)

Opis slike je pomemben za dostopnost (za osebe, ki uporabljajo bralnike zaslona, in če se slika ne naloži).

Bloki kode: Če dodajate programsko kodo ali podobno besedilo, uporabite tri narekovaje:

// To je primer JavaScript kode
console.log("Pozdravljen svet!");

2. Vrste vsebin in navodila
2.1. Objave (sekcija "Zapisi" - Writings)
Objave so splošni zapisi, članki, novice ali blog objave. Prikazujejo se pod zavihkom "Zapisi".

Mapa: content/posts/

Potrebni datoteki: ime-objave.sl.md in ime-objave.en.md

Struktura datoteke:

---
title:
  sl: Naslov vaše objave v slovenščini
  en: Title of your post in English
date: 2025-06-26T10:00:00.000Z # Obvezen format: Leto-Mesec-DanTura:Minuta:Sekunda.MilisekundaZ
tags:
  - narava # Seznam oznak, ločenih s pomišljaji
  - umetnost
  - dogodki
cover_image: /images/posts/moja-objava-naslovnica.jpg # Opcijsko: Pot do naslovne slike v /public/images/posts/
---

Tu se začne **glavna vsebina** vaše objave v Markdown formatu.

**Primer uporabe oblikovanja:**
V tej objavi bomo raziskovali **pomembnost** [biotske raznovrstnosti](https://www.google.com/search?q=biotska+raznovrstnost).
* Pomembno dejstvo 1
* Pomembno dejstvo 2

Lahko dodate tudi slike v vsebino (shranjene v `/public/images/posts/` ali drugi ustrezni podmapi znotraj `/public/images/`):
![Cvet v livadi](https://placehold.co/600x400/2d3748/a0aec0?text=Cvet+v+livadi)


2.2. Prakse (sekcija "Utelešenja" - Embodiments)
Ta kategorija vključuje dva podtipa: Konceptualne prakse in Navodila (Instructables). Oboje se nahaja v isti mapi, razlikujeta pa se po oznakah (tags). Prikazujejo se pod zavihkom "Utelešenja".

Mapa: content/practices/

a) Konceptualne prakse
To so opisi določenih praks, ki vključujejo uvod, navodila za izvedbo, pomen in povezave do zunanjih virov (video, blogi, podcasti).

Potrebni datoteki: ime-prakse.sl.md in ime-prakse.en.md

Struktura datoteke:

---
title:
  sl: Ime prakse (npr. Praksa poslušanja zemlje)
  en: Practice Title (e.g., The Practice of Listening to the Earth)
date: 2025-06-26T10:00:00.000Z
tags:
  - praksa # Priporočena oznaka za to vrsto vsebine
  - ekofeminizem
  - meditacija
cover_image: /images/practices/moja-praksa-naslovnica.jpg # Opcijsko: Pot do naslovne slike v /public/images/practices/
---

## Uvod v prakso (sl)
## Introduction to the Practice (en)
Kratek opis prakse, njen namen in splošen kontekst.

## Kako izvajati (sl)
## How to Perform (en)
Podrobna navodila o tem, kako prakso izvajati.
* **Korak 1:** Priprava na prakso.
* **Korak 2:** Izvedba glavnega dela.
* **Korak 3:** Zaključek in refleksija.

## Zakaj je to pomembno? (sl)
## Why is this important? (en)
Razlaga o koristih prakse in njenem vplivu.

## Dodatni viri (sl)
## Additional Resources (en)

### Video posnetki (sl)
### Videos (en)
* [Naslov prvega videa o tej praksi](https://www.youtube.com/watch?v=primer-videa-1)
* [Naslov drugega videa](https://vimeo.com/primer-videa-2)

### Blog objave (sl)
### Blog Posts (en)
* [Zanimiva blog objava o praksi](https://blog.com/objava-o-praksi)
* [Še en članek](https://blog.org/drugi-clanek)

### Podcasti (sl)
### Podcasts (en)
* [Epizoda podcasta na to temo](https://podcast.com/epizoda-1)
* [Drugi podcast o praksi](https://podcast.fm/epizoda-2)

## Refleksija in skupnost (sl)
## Reflection and Community (en)
Spodbuda za lastno refleksijo in morebitno vključevanje v skupnost.

b) Navodila (Instructables)
To so podrobni, korak-za-korakom vodiči za izdelavo ali izvedbo nečesa (npr. "Kako zgraditi senzor"). Ključno je, da v tags dodate oznako instructable, da se pravilno kategorizira.

Potrebni datoteki: ime-navodila.sl.md in ime-navodila.en.md

Struktura datoteke:

---
title:
  sl: Ime Instructable navodila (npr. Zgradimo lasten senzor vlage)
  en: Instructable Title (e.g., Build Your Own Soil Moisture Sensor)
date: 2025-06-26T10:00:00.000Z
tags:
  - instructable # OBVEZNO: Uporabite to oznako!
  - DIY
  - senzorji
difficulty: # Ocena težavnosti: Enostavno / Srednje / Težko (sl); Easy / Medium / Hard (en)
  sl: Enostavno
  en: Easy
time_required: # Predviden čas za izvedbo (npr. 2-4 ure, 1 dan)
  sl: 2-4 ure
  en: 2-4 hours
cost_estimate: # Predvideni stroški (npr. 20-50€, Nizko)
  sl: 20-50€
  en: 20-50€
cover_image: /images/instructables/vasa-navodila-naslovnica.jpg # Opcijsko: Pot do naslovne slike v /public/images/instructables/
---

## Uvod (sl)
## Introduction (en)
Kratek uvod in pregled, kaj boste zgradili/izdelali in čemu služi.

## Potrebščine (sl)
## Materials (en)
Seznam vseh materialov, ki jih boste potrebovali:
* Arduino Nano
* Senzor vlage (tip YL-69)
* Žice in prototipna plošča

## Orodja (sl)
## Tools (en)
Seznam orodij, ki jih boste potrebovali:
* Spajkalnik
* Klešče za žice
* Multimeter

## Koraki (sl)
## Steps (en)

### Korak 1: Priprava komponent (sl)
### Step 1: Prepare Components (en)
Opis prvega koraka. Lahko vključuje slike in bloke kode.
![Priprava komponent](https://placehold.co/600x400/2d3748/a0aec0?text=Priprava+komponent)

```cpp
// Primer Arduino kode za branje senzorja
void setup() {
  Serial.begin(9600);
}

void loop() {
  int sensorValue = analogRead(A0);
  Serial.println(sensorValue);
  delay(1000);
}

Korak 2: Sestavljanje vezja (sl)
Step 2: Assemble the Circuit (en)
Podrobnosti o sestavljanju elektronskega vezja.

Korak 3: Nalaganje kode (sl)
Step 3: Upload the Code (en)
Navodila za nalaganje programske kode na mikrokontroler.

Rezultati in nadaljnji koraki (sl)
Results and Next Steps (en)
Kaj pričakovati kot rezultat vašega projekta in morebitni predlogi za nadgradnjo.

Reševanje težav (sl)
Troubleshooting (en)
Pogoste težave in njihove rešitve.

Težava: Senzor ne daje odčitkov.

Rešitev: Preverite vse žične povezave in napajanje.


---

### 2.3. Galerije (sekcija "Galerija" - Gallery)
Galerije so zbirke slik z naslovom, opisom in avtorjem. Prikazujejo se pod zavihkom "Galerija".

**Pomembno:** Datoteke galerij vsebujejo **samo `frontmatter`**. V Markdown delu datoteke ni glavne vsebine, saj se vse informacije (vključno z napisi slik) definirajo v `frontmatter`-ju.

**Mapa:** `content/galleries/`

**Potrebni datoteki:** `ime-galerije.sl.md` in `ime-galerije.en.md`

**Struktura datoteke:**
```yaml
---
title:
  sl: Naslov galerije v slovenščini (npr. Livada jeseni 2024)
  en: Gallery Title in English (e.g., Meadow in Autumn 2024)
date: 2025-06-26T10:00:00.000Z # Obvezen format
description:
  sl: Kratek opis te galerije slik, kaj prikazuje.
  en: A brief description of this image gallery, what it shows.
author: Janez Novak # Ime avtorja fotografij (ni dvojezično)
images: # To je seznam posameznih slik v galeriji
  - image: /galleries/moja-slika-1.jpg # PRAVILNA POT: Slike za galerije shranite v /public/galleries/
    caption_sl: Sončni zahod nad livado v jeseni.
    caption_en: Sunset over the meadow in autumn.
  - image: /galleries/moja-slika-2.jpg # Vsaka slika ima svojo pot in dvojezična napisa
    caption_sl: Cvetlice v jesenskem cvetenju.
    caption_en: Flowers in autumn bloom.
  - image: /galleries/moja-slika-3.jpg
    caption_sl: Detajl jesenskega lista z roso.
    caption_en: Detail of an autumn leaf with dew.
---

Navodila za galerije:

Vse slike za galerije morate naložiti v mapo /public/galleries/.

V frontmatter-ju v polju images dodate seznam (-) posameznih slik.

Vsaka slika v seznamu mora imeti:

image: pot do datoteke slike (vedno se začne z /galleries/).

caption_sl: napis (kratek opis) slike v slovenščini.

caption_en: napis (kratek opis) slike v angleščini.

Polje author je enojno (ni dvojezično), saj avtor običajno ostane enak ne glede na jezik.

2.4. Statične strani (sekcija "Strani")
Te strani so fiksne vsebine, kot sta domača stran ali stran "Prepletanja".

Mapa: content/pages/

a) Domača stran (Home)
Potrebni datoteki: home.sl.md in home.en.md

Struktura datoteke:

---
title:
  sl: Domov
  en: Home
hero_title:
  sl: livada.bio
  en: livada.bio
hero_subtitle:
  sl: Živi laboratorij za prepletanje umetnosti, znanosti in tehnologije
  en: A living laboratory for intertwining art, science, and technology
---

## Dobrodošli na livada.bio! (sl)
## Welcome to livada.bio! (en)

To je **glavna vsebina vaše domače strani**. Vsebina, ki jo pišete tukaj pod `frontmatter`-jem, se bo prikazala pod naslovom in podnaslovom iz `frontmatter`-ja. Uporabite lahko vse standardne Markdown možnosti oblikovanja.

**Pomembno:** Besedili `hero_title` in `hero_subtitle` (v `frontmatter`-ju) sta ključni, saj se prikažeta v veliki pasici na vrhu domače strani. Ostala vsebina se prikaže pod tem delom.

Na domačo stran lahko vstavite tudi slike iz `/public/images/pages/` (ali druge ustrezne podmape znotaj `/public/images/`):
![Slika livade](https://placehold.co/800x500/2d3748/a0aec0?text=Slika+livade)

---

### Več o nas (sl)
### More About Us (en)
Tukaj lahko dodate različne sekcije z informacijami, ki jih želite prikazati na domači strani.

b) Stran "Prepletanja" (Intertwinings)
Ta stran je posebna, saj uporablja samo eno datoteko (intertwinings.md), ki pa vključuje dvojezične naslove (title) in opise (description) direktno v frontmatter-ju. Vsa vsebina za to stran se generira iz polja description. Zato pod frontmatter-jem ne pišete dodatne Markdown vsebine.

Mapa: content/pages/

Potrebna datoteka: intertwinings.md (SAMO ENA DATOTEKA)

Struktura datoteke:

---
title:
  sl: Prepletanja
  en: Intertwinings
description:
  sl: V tem prepletanju ne merimo, temveč poslušamo šepet prsti, ki nam pripoveduje o vlagi, temperaturi in življenju pod površjem. Podatki se osvežujejo vsako uro.
  en: In this intertwining, we don't just measure; we listen to the whisper of the soil, which tells us stories of moisture, temperature, and life beneath the surface. Data is updated hourly.
---
# Pomembno: Tukaj pod frontmatter-jem NI dodatne Markdown vsebine.
# Vsa vsebina za stran "Prepletanja" se generira iz 'description' polja v frontmatterju.

3. Zaključek
Sledite tem podrobnim navodilom, da boste lahko učinkovito upravljali vsebine na spletni strani livada.bio. Ključno je dosledno imenovanje datotek (z .sl.md in .en.md priponami) in pravilno izpolnjevanje frontmatter-ja, še posebej pri dvojezičnih poljih in poteh do slik.