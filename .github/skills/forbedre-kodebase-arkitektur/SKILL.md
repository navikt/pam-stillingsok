---
name: forbedre-kodebase-arkitektur
description: Utforsk en kodebase for å finne muligheter for arkitektoniske forbedringer, med fokus på å gjøre kodebasen mer testbar ved å gjøre grunne moduler dypere. Bruk dette når brukeren vil forbedre arkitekturen, finne refaktoreringsmuligheter, konsolidere tett koblede moduler, eller gjøre en kodebase lettere å navigere i for AI.
---

# Forbedre kodebase-arkitektur

Utforsk en kodebase slik en AI ville gjort det, avdekk arkitektonisk friksjon, finn muligheter for å forbedre testbarhet, og foreslå refaktoreringer som gjør moduler dypere som GitHub issue-RFC-er.

En **dyp modul** (John Ousterhout, «A Philosophy of Software Design») har et lite grensesnitt som skjuler en stor implementasjon. Dype moduler er mer testbare, lettere å navigere i for AI, og lar deg teste ved grensen i stedet for inni modulen.

## Prosess

### 1. Utforsk kodebasen

Naviger naturlig i kodebasen ved hjelp av tilgjengelige verktøy. Start bredt med `semantic_search` for å forstå overordnet struktur, bruk `list_dir` for mappeoversikt, `file_search` for å finne relevante filer, `grep_search` for å spore kall og avhengigheter, og `read_file` for å lese implementasjoner i detalj. Bruk `run_subagent` med `Plan`-agenten dersom du trenger å bryte ned kompleks utforskning i mindre steg.

**Ikke** følg rigide heuristikker — utforsk organisk og noter hvor du opplever friksjon:

- Hvor må du hoppe mellom mange små filer for å forstå ett konsept?
- Hvor er moduler så grunne at grensesnittet er nesten like komplekst som implementasjonen?
- Hvor er rene funksjoner trukket ut kun for testbarhet, mens de egentlige feilene skjuler seg i hvordan de blir kalt?
- Hvor skaper tett koblede moduler integrasjonsrisiko i skjøtene mellom dem?
- Hvilke deler av kodebasen er utestet, eller vanskelige å teste?

Friksjonen du møter, **er** signalet.

### 2. Sjekk eksisterende GitHub issues

Før du presenterer kandidater, søk i eksisterende issues for å unngå duplisering:

```bash
gh issue list --state open --limit 100 --json number,title,labels,body
```

Bruk også `gh search issues` med relevante søkeord (modulnavn, filnavn, konsepter) for å fange issues med annen ordlyd. Bygg opp en oversikt over hva som allerede er dekket.

### 3. Presenter kandidater

Presenter en nummerert liste med muligheter for fordypning. For hver kandidat, vis:

- **Klynge**: hvilke moduler/konsepter som er involvert
- **Hvorfor de er koblet**: delte typer, kallmønstre, felles eierskap til et konsept
- **Avhengighetskategori**: se [REFERENCE.md](REFERENCE.md) for de fire kategoriene
- **Testeffekt**: hvilke eksisterende tester som vil bli erstattet av grensetester
- **Eksisterende issue**: Hvis en åpen issue allerede dekker dette området, vis `#<nummer> — <tittel>` og marker kandidaten som **⏭️ Allerede dekket**. Ikke tilby denne for videre utforskning.

Filtrer bort kandidater som allerede er dekket. **Ikke** foreslå grensesnitt ennå. Spør brukeren: «Hvilken av de gjenværende vil du utforske?»

### 4. Brukeren velger en kandidat

### 5. Ram inn problemområdet

Skriv en brukerrettet forklaring av problemområdet for den valgte kandidaten:

- Begrensningene et nytt grensesnitt må oppfylle
- Avhengighetene det må støtte seg på
- En grov, illustrerende kodeskisse som gjør begrensningene konkrete — dette er ikke et forslag, bare en måte å forankre begrensningene på

Vis dette til brukeren, og gå deretter umiddelbart videre til steg 6.

### 6. Design flere grensesnitt

Generer 3–4 **radikalt forskjellige** grensesnittdesign for den fordypede modulen. Hvert design skal ha en tydelig designbegrensning:

- **Design A – Minimalt grensesnitt**: Sikt mot maks 1–3 inngangspunkter. Skjul alt som kan skjules.
- **Design B – Fleksibelt grensesnitt**: Støtt mange brukstilfeller og utvidelser. Prioriter konfigurerbarhet.
- **Design C – Optimalisert for vanligste kaller**: Gjør standardtilfellet trivielt. Optimaliser for den mest brukte call-siten.
- **Design D (hvis relevant) – Ports & adapters**: Design rundt ports & adapters-mønsteret for avhengigheter på tvers av grenser.

Les relevante filer med `read_file` og spor avhengigheter med `grep_search` for å sikre at hvert design er forankret i den faktiske koden. Bruk `semantic_search` for å finne alle kallere av eksisterende grensesnitt.

For hvert design, lever:

1. Grensesnittsignatur (typer, metoder, parametere)
2. Brukseksempel som viser hvordan kallere bruker det
3. Hvilken kompleksitet det skjuler internt
4. Avhengighetsstrategi (hvordan avhengigheter håndteres — se [REFERENCE.md](REFERENCE.md))
5. Avveiinger

Presenter designene sekvensielt, og sammenlign dem deretter i løpende tekst.

Etter sammenligningen skal du gi din egen anbefaling: hvilket design du mener er sterkest, og hvorfor. Hvis elementer fra ulike design passer godt sammen, foreslå en hybrid. Vær tydelig og meningssterk — brukeren ønsker en tydelig vurdering, ikke bare en meny.

### 7. Brukeren velger et grensesnitt (eller godtar anbefalingen)

### 8. Opprett GitHub issue

Opprett en refaktorerings-RFC som en GitHub issue med `gh issue create` via terminalen. Bruk malen i [REFERENCE.md](REFERENCE.md). **Ikke** be brukeren om å gå gjennom før du oppretter den — bare opprett den og del URL-en.

### 9. Tilby neste kandidat

Etter at issueen er opprettet, vis den opprinnelige kandidatlisten på nytt (fra steg 2) og marker hvilke kandidater som allerede er behandlet. Spør brukeren:

> «Issue opprettet ✅ Vil du utforske en av de gjenværende kandidatene, eller er vi ferdige?»

- Hvis brukeren velger en ny kandidat: gå til **steg 5** med den nye kandidaten.
- Hvis brukeren sier de er ferdige: avslutt med en kort oppsummering av alle opprettede issues (tittel + URL).

