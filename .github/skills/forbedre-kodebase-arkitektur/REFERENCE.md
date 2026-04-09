# Referanse

## Avhengighetskategorier

Når du vurderer en kandidat for fordypning, klassifiser avhengighetene dens:

### 1. I prosess

Ren beregning, tilstand i minnet, ingen I/O. Kan alltid fordypes — bare slå sammen modulene og test direkte.

### 2. Lokalt erstattbar

Avhengigheter som har lokale test-erstatninger (for eksempel PGLite for Postgres, filsystem i minnet). Kan fordypes hvis test-erstatningen finnes. Den fordypede modulen testes med den lokale erstatningen kjørende i test-suiten.

### 3. Fjern, men eid (Ports & Adapters)

Dine egne tjenester på tvers av en nettverksgrense (mikrotjenester, interne API-er). Definer en port (et grensesnitt) ved modulgrensen. Den dype modulen eier logikken; transporten injiseres. Tester bruker en adapter i minnet. Produksjon bruker den ekte HTTP-/gRPC-/kø-adapteren.

Anbefalt formulering: «Definer et delt grensesnitt (port), implementer en HTTP-adapter for produksjon og en adapter i minnet for testing, slik at logikken kan testes som én dyp modul selv om den distribueres over en nettverksgrense.»

### 4. Reelt ekstern (Mock)

Tredjepartstjenester (Stripe, Twilio osv.) som du ikke kontrollerer. Mock ved grensen. Den fordypede modulen tar den eksterne avhengigheten som en injisert port, og tester gir en mock-implementasjon.

## Teststrategi

Kjerneprinsippet: **erstatt, ikke legg lag på lag.**

- Gamle enhetstester på grunne moduler er bortkastet når grensetester finnes — slett dem
- Skriv nye tester ved grensesnittet til den fordypede modulen
- Tester skal asserte på observerbare utfall gjennom det offentlige grensesnittet, ikke intern tilstand
- Tester skal tåle interne refaktoreringer — de beskriver atferd, ikke implementasjon

## Problem-mal

Bruk denne malen når du oppretter GitHub issue via `gh issue create` i terminalen.

<issue-template>

## Problem

Beskriv den arkitektoniske friksjonen:

- Hvilke moduler som er grunne og tett koblet
- Hvilken integrasjonsrisiko som finnes i skjøtene mellom dem
- Hvorfor dette gjør kodebasen vanskeligere å navigere i og vedlikeholde

## Foreslått grensesnitt

Det valgte grensesnittdesignet:

- Grensesnittsignatur (typer, metoder, parametere)
- Brukseksempel som viser hvordan kallere bruker det
- Hvilken kompleksitet det skjuler internt

## Avhengighetsstrategi

Hvilken kategori som gjelder, og hvordan avhengigheter håndteres:

- **I prosess**: slås direkte sammen
- **Lokalt erstattbar**: testes med [spesifikk erstatning]
- **Ports & adapters**: portdefinisjon, produksjonsadapter, testadapter
- **Mock**: mock av grensen for eksterne tjenester

## Teststrategi

- **Nye grensetester som skal skrives**: beskriv atferden som skal verifiseres ved grensesnittet
- **Gamle tester som skal slettes**: list opp testene for grunne moduler som blir overflødige
- **Behov i testmiljøet**: eventuelle lokale erstatninger eller adaptere som kreves

## Anbefalinger for implementasjon

Holdbar arkitekturveiledning som **ikke** er knyttet til dagens filstier:

- Hva modulen bør eie (ansvar)
- Hva den bør skjule (implementasjonsdetaljer)
- Hva den bør eksponere (grensesnittkontrakten)
- Hvordan kallere bør migrere til det nye grensesnittet

</issue-template>
