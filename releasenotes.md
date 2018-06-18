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
