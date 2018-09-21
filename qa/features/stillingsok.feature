# language: no
Egenskap: Søke og filtrere på stillingsannonser

  Bakgrunn: Naviger til forsiden for søk
    Gitt at jeg er på forsiden for søk

  @søk
  Scenario: Verifiser at søk på annonser gir et fornuftig resultat
    Når jeg søker på "Java"
    Så skal det forekomme minst ett treff der "Java" finnes i resultatvisningen

  @ingentreff
  Scenario: Verifiser ingen treff
    Når jeg søker på "asdsgrwgvdfhegsd"
    Så skal ingen treff vises

  @annonse
  Scenario: Verifisere at annonsevisning viser data
    Når jeg åpner en stillingsannonse
    Så skal annonsen ha innhold

  @fylke
  Scenario: Verifisere at filtrering på fylke fungerer
    Når jeg filtrerer på "OSLO"
    Så skal "Oslo" vises som sted i annonsetreffene
    Og antall treff skal stemme overens med antall i fasett "OSLO"
    Når jeg åpner en stillingsannonse
    Så skal "Oslo" vises under "Om stillingen"

  @heltid
  Scenario: Verifisere at filtrering på HeltidDeltid fungerer
    Når jeg filtrerer på "Heltid"
    Og jeg åpner en stillingsannonse
    Så skal "Heltid" vises under "Om stillingen"
