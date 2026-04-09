---
name: request-refactor-plan
description: Lag en detaljert plan for refaktorering med svært små commits gjennom intervju med brukeren, og gjør den om til en GitHub issue eller et klart issue-utkast. Bruk når brukeren vil planlegge en refaktorering, lage en refaktorerings-RFC, eller bryte opp en refaktorering i trygge, inkrementelle steg.
---

Denne skillen skal brukes når brukeren vil opprette en forespørsel om refaktorering. Følg stegene under. Du kan hoppe over steg dersom de ikke er nødvendige i den aktuelle situasjonen.

Viktig for Copilot:
- Bruk arbeidsområdet, kodebasen og tilgjengelig GitHub-kontekst aktivt for å verifisere antakelser.
- Når du kan, utforsk relevant kode, tester, typer, avhengigheter og historikk før du konkluderer.
- Dersom du ikke kan opprette en GitHub issue direkte i konteksten du jobber i, skal du lage et ferdig issue-utkast i Markdown som brukeren kan lime rett inn i GitHub.
- Ikke gjett om kodebasen. Bekreft påstander ved å lese kode når det er praktisk mulig.

1. Be brukeren beskrive problemet grundig, inkludert hva de forsøker å forbedre, hvorfor dagens løsning er problematisk, og eventuelle løsningsidéer de allerede har.

2. Utforsk kodebasen for å verifisere brukerens beskrivelse og forstå nåværende løsning, avhengigheter, begrensninger og risiko.

3. Spør om de har vurdert andre alternativer, og presenter relevante alternativer dersom det finnes enklere, tryggere eller mer inkrementelle veier.

4. Intervju brukeren om implementasjonen. Vær svært detaljert og grundig. Avklar mål, begrensninger, avhengigheter, migreringsbehov, bakoverkompatibilitet, risiko, eierskap, utrulling og påvirkning på andre deler av løsningen.

5. Avklar eksakt scope for arbeidet. Beskriv tydelig hva som skal endres, og hva som uttrykkelig ikke skal endres.

6. Undersøk kodebasen for testdekning i dette området. Dersom testdekningen er svak eller mangelfull, spør brukeren hvordan de vil håndtere testing, og foreslå en trygg teststrategi.

7. Del implementasjonen opp i en plan med svært små commits. Husk Martin Fowlers råd om å gjøre hvert refaktoreringssteg så lite som mulig, slik at programmet hele tiden kan holdes i fungerende tilstand.

8. Lag en GitHub issue med refaktorplanen. Hvis direkte opprettelse ikke er tilgjengelig, lag et ferdig issue-utkast ved å bruke malen under:

<refactor-plan-template>

## Problembeskrivelse

Beskriv problemet utvikleren står overfor, sett fra utviklerens perspektiv.

## Løsning

Beskriv den valgte løsningen, sett fra utviklerens perspektiv.

## Commits

En LANG og detaljert implementasjonsplan. Skriv planen i vanlig språk, og bryt implementasjonen ned i de minste commitene som er praktiske. Hver commit skal etterlate kodebasen i en fungerende tilstand.

## Beslutningsdokument

En liste over implementasjonsbeslutninger som er tatt. Dette kan inkludere:

- Moduler som skal bygges eller endres
- Grensesnitt i disse modulene som skal endres
- Tekniske avklaringer fra utvikleren
- Arkitektoniske beslutninger
- Skjemaendringer
- API-kontrakter
- Konkrete interaksjoner

Ikke ta med spesifikke filstier eller kodesnutter. Slike detaljer kan bli utdaterte raskt.

## Testbeslutninger

En liste over testbeslutninger som er tatt. Inkluder:

- En beskrivelse av hva som kjennetegner en god test (test ytre adferd, ikke implementasjonsdetaljer)
- Hvilke moduler som skal testes
- Eksisterende eksempler i kodebasen som kan brukes som mønster for testene

## Utenfor scope

Beskriv hva som ikke inngår i denne refaktoreringen.

## Videre merknader (valgfritt)

Eventuelle andre relevante notater om refaktoreringen.

</refactor-plan-template>
