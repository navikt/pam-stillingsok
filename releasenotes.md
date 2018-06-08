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
