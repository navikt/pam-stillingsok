
# language: no
Egenskap: Bruke stillingssøket som innlogget bruker

  Bakgrunn: Logg inn og naviger til forsiden for søk
    Gitt at jeg er logget inn

  @lagredeSok
  Scenario: Se lagret søk
    Når jeg filtrerer på "OSLO"
    Og jeg filtrerer på "IT"
    Når jeg lagrer søket som "nightwatch testsøk"
    Og jeg går til lagrede søk i menyen
    Så skal "nightwatch testsøk" vises i listen
    Når jeg sletter søket
    Så skal "nightwatch testsøk" ikke vises i listen


