## RELEASE - 0.30.213-cead01b
#### New in this release: 
+ 2018-06-24 [Feature] Husker scroll position når siden lastes på nytt.
+ 2018-06-24 [Feature] Legger til spinner når søkesiden lastes første gang
## RELEASE - 0.29.202-e892909
#### New in this release: 
+ 2018-06-22 [Feature] Optimalisering av design for mobil - tweak ios
+ 2018-06-22 [Feature] Optimalisering av design for mobil - tweak ios
+ 2018-06-22 [Feature] Optimalisering av design for mobil - tweak ios
## RELEASE - 0.28.196-cd890e4
#### New in this release: 
+ 2018-06-22 [Feature] Optimalisering av design for mobil - tweak
## RELEASE - 0.27.193-9c19c24
#### New in this release: 
+ 2018-06-22 [Feature] Optimalisering av design for mobil
+ 2018-06-22 [Feature] Forbedret design på søkeboks
+ 2018-06-22 [Feature] Forbedret design på søkeboks
+ 2018-06-22 [Bugfix] Nå forsvinner søketreffene når man går ut av annonsesiden, feks inn på Send søknad. Når man trykker tilbake, så må man da krysse av og søke på nytt. Legger derfor til url query (?q=java&sector=Offentlig) også på selve annonse siden, slik at søket kan gjenskapes når bruker kommer tilbake.
+ 2018-06-22 [Feature] Utskriftsvennlig versjon av annonse og treffliste. Lager egen css for print.
+ 2018-06-22 [Feature]Legger til anonymisering av ip-adresser i GA
## RELEASE - 0.26.184-a81fc81
#### New in this release: 
+ 2018-06-21 [Bugfix] Tweak på sticky Tilbake-knapp
## RELEASE - 0.24.177-7453fa7
#### New in this release: 
+ 2018-06-21 [Feature] Gjør slik at Tilbakekanpp fester seg til toppen når man scroller ned på siden.
+ 2018-06-21 [Feature] Legger inn utskriftsvennlig formatering av stillingsannonse.
## RELEASE - 0.23.174-8a31229
#### New in this release: 
+ 2018-06-21 [Bugfix] Fikser issue med at det ble gjort to likedans søk om man trykket enter i søkeboksen
+ 2018-06-21 [Bugfix] Legger til aria-label på "765 treff + pil ned" slik at skjermleser sier "Vis 765 treff"
+ 2018-06-21 [Feature] Flere tilbakemeldinger på at det er vanskleig å scanne trefflisten. Gjør derfor om til slik det var opprinnelig med arbeidsgivernavn i en egen kolonne på venstre side i treff listen.
+ 2018-06-21 [Bugfix] Tilbakeknappen fikk url /?[Object Object]. Har fikset dette nå slik at tilbakeknappen bruker stringverdien av søke-queryen.
+ 2018-06-15 [PAM-996] Use published as date field for "nye i dag"
+ 2018-06-21 [Bugfix] Det har vært et issue at det dukker opp treff fra feks Oslo, når man deretter velger feks Bamle. Dette skyldes at man har trykket "Se flere" på Oslo, og det har blitt lastet inn duplikate annonser. Man kan få duplkate annonser når man pager, siden backend returnerer treff fra flere søkeindexer. Duplikate annonser skaper trøbbel for react, og duplikater fjernes ikke fra DOM. Fixen er derfor å droppe eventuelle duplikater i frontenden.
## RELEASE - 0.22.168-d03bc99
#### New in this release: 
+ 2018-06-20 [Bugfix] Fikser noen issues etter Legger på søkknapp. Fikser fonttyper som mangler noen steder.
+ 2018-06-20 [Bugfix] Bruker riktig font-type på selectboxen for sortering
+ 2018-06-20 [Bugfix] Fjerner chevron/nedpil ned fra "Se flere", da designteamet sa at dette ikonet ikke passer.
+ 2018-06-20 [Bugfix] Hvis man trykker "Se flere" og dermed får ?from=20 i urlen, og deretter laster siden inn på nytt, så vil trefflisten bare vise treffene fra index 20 til 40. Bruker i stedet ?size=40, slik at alle treffene fra 0 til 40 vises.
+ 2018-06-18 [PAM-1027]: bruker react router history til å gå tilbake til søk, slik at url-parameterne blir med
## RELEASE - 0.21.162-061a653
#### New in this release: 
+ 2018-06-19 [Feature] Legger til "Viser 20 av 540 treff" over Se flere knapp
+ 2018-06-19 [Feature] Legger til "Ingen flere treff" når man er kommet til slutten av søketreffene
+ 2018-06-19 [Feature] På tregt nettverk mangler det indikasjon på at annonsen lastes. Man vil bare se en Tilbakeknapp inntil annonsen her hentet fra backend. Jeg har derfor  lagt til en annonse-placeholder og spinner på annonsesiden.
+ 2018-06-19 [PAM-1040]: Endret tekst på tilbakemeldingslenke
+ 2018-06-19 [Bugfix] Frontenden mottar forsatt lenker uten http/https. Legger derfor inn igjen koden for å fikse lenker som mangler dette.
+ 2018-06-19 [PAM-924] Fylke og kommune i fasettlisten er i store bokstaver. Det mest optimale fixen ville vært å endre kildedataene, men har ikke gjort det i denne løsningen, da det er uklart om dette kan gjøres. Derfor transformerer vi heller til små bokstaver i front-endkoden.
+ 2018-06-19 [Bugfix] Flere brukere har gitt feedback på at kontrasten på stillingstittel i trefflisten er dårlig. Gjør derfor om og bruker standard formatering på undertitler slik det er definert i designsystemet.
+ 2018-06-18 [Feature] Har fått tilbakemelding fra bruker om at alle sider har samme sidetittel (i browserfanen). Det er et problem at alle stillinger får tittelen "Ledige stillinger" når man feks bookmarker en side. Har derfor gjort det slik at det er bare søkesiden som har "Ledige stillinger", mens stillingssiden får stillingsoverskrift som side tittel.
## RELEASE - 0.20.148-7900474
#### New in this release: 
+ 2018-06-18 [Feature] Legger til invitasjon til å teste ut nytt stillingssøk for de som bruker mobil.
+ 2018-06-15 [PAM-975]: fjerner  tilpassing av lenker, etter at dette er fikset i Stillingsregistrering
## RELEASE - 0.19.144-94e41d3
#### New in this release: 
+ 2018-06-15 [Bugfix] Fikser noen mindre UU-issues etter test med aXe 2
+ 2018-06-15 [Bugfix] Fikser noen mindre UU-issues etter test med aXe
+ 2018-06-15 [Bugfix] Fikser noen mindre UU-issues etter tilbakemelding fra UU-team
## RELEASE - 0.18.137-dd68039
#### New in this release: 
+ 2018-06-15 [Bugfix] Sørger for å rydde opp timeout i componentWillUnmount, for å unngå at det kjøres setState når typeheaden er unmounted
+ 2018-06-15 [Bug]Søknadslenke går nå til finn hvis det er en finn-annonse
+ 2018-06-15 [Hotfix] Gjør slik at lange tekster bryter riktig på mobil
+ 2018-06-14 [feature]La til tilbakemeldingslenke
## RELEASE - 0.16.123-776dce5
#### New in this release: 
+ 2018-06-14 [Bugfix] Fikser noen mindre feil med typeheaden, slik at den virker bedre på mobil.
## RELEASE - 0.15.115-8da3132
#### New in this release: 
+ 2018-06-13 [PAM-1014] Fikser issue med selectboks på chrome ios - tweak
## RELEASE - 0.14.113-9b6c47a
#### New in this release: 
+ 2018-06-13 [PAM-1014] Fikser issue med selectboks på chrome ios
+ 2018-06-13 [PAM-990]: Justering av "tilbake til søk" knapp. Vises kun som tekst med pil.
## RELEASE - 0.13.109-7166633
#### New in this release: 
+ 2018-06-13 [Feature] Knappene "Vis flere" og "Endre søk" var vansklige å klikke på i mobil. Dessuten lå de ofte på toppen av der de fleste leser på skjermen. Har derfor flyttet knappene ned i høyre hjørne, gjort dem runde og blå.
+ 2018-06-13 [Bugfix] Unngår at "Endre søk" og "Vis treff" knappene forblir blå etter at de er trykket på.
+ 2018-06-13 [PAM-975]: La til quick-fix av ugyldig søknadslenke i annonsevisning. Skal gjøre validering strengere i stillingsregistrering, så dette bør bli unødvendig.
+ 2018-06-12 [Bugfix] Fjerner litt rom under "Nye i dag", slik at den kommer midt i vertikalt
## RELEASE - 0.12.103-7b0009d
#### New in this release: 
+ 2018-06-12 [Bugfix] Legger til litt mer rom under "Se flere" knapp, slik at det blir mere plass til de nye stillingene som lastes inn.
+ 2018-06-12 [Bugfix] Små justeringer etter test med skjermleser og tips fra David
+ 2018-06-12 [PAM-992] Justerer "Til toppen" knapp
+ 2018-06-12 [PAM-991] Fjerner teksten "Her finner du offentlig utlyste stillinger i Norge." under sidetittel
+ 2018-06-12 [Fix] Oppgraderer dependencies. Oppdaterer til siste versjon av Designsystemet
+ 2018-06-11 [Bugfix] Gir nytt navn på id på treffliste og søkeskjema slik at url blir stillingsok.nav.no#sok eller stillingsok.nav.no#treff når man bruker interne skip-linker på siden.
+ 2018-06-11 [Bugfix] Sørger for at det kommer en blå "Søk" knapp på mobil-tastaturet når man skriver inn søkeord.
## RELEASE - 0.11.95-23f3040
#### New in this release: 
+ 2018-06-08 [Feature] På mobil er det vanskelig å vite hvor mange treff man har når man huker av søkekriterier. Lager en "Vis 237 treff" knapp som både viser antall treff, men også tar deg raskt ned til trefflisten.
+ 2018-06-08 [Bugfix] Viser feilmelding hvis bruker mister nettverksforbindelse når stillingsannonse lastes fra backend.
+ 2018-06-08 [Feature] Teksten om testversjon i headeren tar stor plass, særlig på mobil. Legger derfor til "Skjul"-knapp, slik at bruker har mulighet til å skjule informasjonen.
+ 2018-06-08 [Feature] Viser banner med "Annonsen er utløpt" hvis annonsen brukeren har lenke til er inaktiv.
+ 2018-06-08 [PAM-969] Adjust relevance tuning
## RELEASE - 0.10.83-538b232
#### New in this release: 
+ 2018-06-07 [PAM-977] Node express: do not use helmet noCache feature
+ 2018-06-07 [PAM-925] flyttet util-funksjon
+ 2018-06-07 [PAM-925]: fikser review-kommentarer: lager felles metode, og bruker clone på array istedet for å modifisere
+ 2018-06-06 [PAM-925] Flyttet kategorialternativene Ikke oppgitt og Annet nederst i hhv Sektor og Ansettelsesform
## RELEASE - 0.7.68-155954b
#### New in this release: 
+ 2018-05-31 [PAM-888] Use GET-requests to fetch individual ads for display
## RELEASE - 0.5.44-a2936e9
#### New in this release: 
+ 2018-05-28 [PAM-637] removed div tag
+ 2018-05-28 [PAM-637] Renamed from sektor to sector
+ 2018-05-28 [PAM-639] Renamed from nyeIDag to created
+ 2018-05-25 [PAM-637] Added search filter for sector
+ 2018-05-24 [PAM-639] Added search filter "Nye i dag"
## RELEASE - 0.4.37-b097b88
#### New in this release: 
+ 2018-05-23 [PAM-595] Set default sorting to updated when query is missing og blank (full search). This will ensure a consistent set of results, across multiple shards in elasticsearch, see https://www.elastic.co/guide/en/elasticsearch/guide/current/relevance-is-broken.html
