# language: no
Egenskap: Bruke stillingssøket som innlogget bruker

  @favoritter
  Scenario: Se favoritter
    Gitt at jeg er logget inn som "01065500791"
    Og jeg lagrer første annonse som favoritt
    Når jeg går til favoritter i menyen
    Så skal annonsen vises i favorittlisten
    Når jeg sletter favoritten
    Så skal ikke annonsen vises i favorittlisten



  @lagredeSok
  Scenario: Se lagret søk
    Gitt at jeg er logget inn som "01065500791"
    Når jeg filtrerer på "OSLO"
    Og jeg filtrerer på "IT"
    Når jeg lagrer søket som "nightwatch testsøk"
    Og jeg går til lagrede søk i menyen
    Så skal "nightwatch testsøk" vises i listen
    Når jeg sletter søket
    Så skal "nightwatch testsøk" ikke vises i listen


