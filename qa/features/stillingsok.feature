# language: no
Egenskap: Søke og filtrere på stillingsannonser

  Bakgrunn: Naviger til forsiden for søk
    Gitt at jeg er på forsiden for søk

  @søk
  Scenario: Verifiser at søk på annonser gir et fornuftig resultat
    Når jeg søker på "oslo"
    Så skal det forekomme minst ett treff der "oslo" finnes i resultatvisningen

  @ingentreff
  Scenario: Verifiser ingen treff
    Når jeg søker på "asdsgrwgvdfhegsd"
    Så skal ingen treff vises

  @annonse
  Scenario: Verifisere at annonsevisning viser data
    Når jeg åpner en stillingsannonse
    Så skal annonsen ha innhold

  @heltid
  Scenario: Verifisere at filtrering på HeltidDeltid fungerer
    Når jeg filtrerer på "Heltid"
    Og jeg åpner en stillingsannonse
    Så skal "Heltid" vises under "Om stillingen"
