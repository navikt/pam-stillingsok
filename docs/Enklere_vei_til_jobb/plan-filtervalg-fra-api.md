# Plan: filtervalg og filtrering fra Shared Content-API-et

Status: utkast til gjennomgang, 5. oktober 2026.

## Mål

Svarvalgene i onboarding og filteret skal komme fra taxonomy-endepunktene i API-et. Drupal skal filtrere artiklene for oss. Koden skal ikke inneholde term-UUID-er.

Når redaktørene retter språk, tagging og manglende termer, skal resultatet bli riktig uten kodeendring.

## Det vi vet nå

- Taxonomy-endepunktene er åpne og trenger ikke API-nøkkel:
  - `/jsonapi/taxonomy_term/shared_content_age` (alder)
  - `/jsonapi/taxonomy_term/shared_content_experience` (erfaring)
  - `/jsonapi/taxonomy_term/situations` (mål, felles vokabular med andre moduler)
- Målene våre er barna av termen «Jobbsøk for unge» i `situations`.
- UUID-ene er ulike i staging og prod. API-teamet vil ikke legge til nøkkelfelt.
- Hver term har `name` og `weight`. Rekkefølgen styres med `weight`.
- Samlingen kan filtreres med `IN` på `field_sc_age.id`, `field_sc_experience.id` og `field_sc_audiences.id`. Flere filtre kombineres med OG. Vi har testet dette mot staging.
- Samlingen gir maks 50 artikler per side, og `meta.count` gir antall treff.
- Cache følger headerne fra API-et:
  - taxonomy: `max-age=3600, public`
  - samlingen: `no-cache, private`

## Det vi venter på

Dette påvirker ikke koden vi lager nå. Det kommer på plass hos API-teamet og redaktørene.

| Hva                                                | Hvem                         | Hva det betyr for oss                   |
|----------------------------------------------------|------------------------------|-----------------------------------------|
| Egen vokabular for mål                             | API-teamet vurderer i morgen | Bytter ut ankeret i én funksjon         |
| Norske termnavn                                    | Redaktørene                  | Ingen endring. Vi viser `name`          |
| `/nb/`-prefiks eller `translated_labels`           | API-teamet                   | Bytter sti eller felt i én funksjon     |
| Manglende termer («søker noe nytt», «rettigheter») | Redaktørene                  | Ingen endring. Nye termer blir nye valg |
| Riktig tagging av artikler                         | Redaktørene                  | Ingen endring                           |
| Anbefalt sortering                                 | API-teamet                   | Legger til `sort` i samlingskallet      |

## Slik henger det sammen

Vi snur retningen. I dag har koden en fast liste med valg og en mapping til UUID-er. Etter endringen henter vi termene, og hver term blir et valg med UUID-en som verdi.

```text
Spørsmål (lokal tekst)            Valg (fra API)                       Filter i samlingskallet
"Hvor gammel er du?"         ←    shared_content_age                →  field_sc_age.id IN (...)
"Hva er din situasjon nå?"   ←    shared_content_experience         →  field_sc_experience.id IN (...)
"Hva er viktigst for deg nå?"←    situations, barn av ankeret       →  field_sc_audiences.id IN (...)
```

Koden kjenner bare vokabularnavnene og hvilket felt hvert spørsmål filtrerer på. Disse navnene er like i alle miljøer.

Unntaket er ankeret for mål. UUID-en til «Jobbsøk for unge» er ulik per miljø og legges i Nais-konfigurasjonen, ikke i koden:

```yaml
# .nais/dev.yml
SHARED_CONTENT_GOALS_PARENT_ID: "813d0e38-b09b-4362-bd0c-6b978cc16ecb"
```

Når målene får egen vokabular, fjerner vi variabelen og henter hele vokabularen, som for alder og erfaring.

### Hvor endringen skjer

`getOnboardingModule()` er sømmen. Veiviseren, `ResultFilters`, `decodeSelectionParams()` og artikkellenkene bruker allerede modulen derfra og bryr seg ikke om hva svar-ID-ene er. En UUID passerer valideringen i `selectionParams.ts` slik den er i dag.

| Del                                 | Endres  | Merknad                                            |
|-------------------------------------|---------|----------------------------------------------------|
| Spørsmålstekster, tittel og ingress | Nei     | Ligger lokalt i `server/local/onboardingModule.ts` |
| Svarvalg i live-modus               | Ja      | Hentes fra taxonomy                                |
| Svarvalg i mock-modus               | Nei     | Lokale ID-er, som i dag                            |
| Veiviser og filter-UI               | Nei     | Får valgene fra modulen                            |
| URL (`svar=`)                       | Ja      | Inneholder term-UUID-er i live-modus               |
| Matching                            | Ja      | Flyttes fra `matchArticles()` til Drupal           |
| `termMapping.server.ts`             | Slettes | Erstattes av taxonomy-oppslag                      |

## Beslutninger til gjennomgang

1. **Anker for mål i Nais-env.** Alternativet er å filtrere på `parent.name`, men redaktørene kan endre navnet. Env-variabelen må oppdateres manuelt hvis termen opprettes på nytt.
2. **Spørsmål uten valg skjules.** Hvis en vokabular er tom, viser vi ikke spørsmålet og logger en advarsel. Hvis alle tre er tomme, viser vi feilsiden. Alternativet er å vise feilsiden med en gang, men da stopper hele siden fordi én term er avpublisert.
3. **`v=2` i URL-en.** `svar` får nytt innhold, så vi øker versjonen. Lenker med `v=1` gir meldingen «Lenken inneholder ugyldige valg», som i dag. Featuren er ikke lansert, så ingen eksterne lenker brytes.
4. **Termnavn vises som de er.** Engelske navn som «Never had a job» vises til redaktørene har oversatt dem. Vi legger ikke inn lokale reserve-tekster, fordi det krever en mapping igjen.
5. **Ingen reserve ved feil.** Feiler taxonomy-kallet, viser vi feilsiden. Live-modus faller aldri tilbake til mock.
6. **Debug-panelet beholdes.** `ArticleMetadataDebugPanel` viser taggingen på artikkelsida. Redaktørene kan bruke det til å kontrollere arbeidet sitt etter opplæringen.

## Steg

Hvert steg er én commit og holder testene grønne.

### 1. Taxonomy i klienten

- Legg til `getTaxonomyTerms(vocabulary, { parentId? })` i `drupalClient.server.ts`.
  - `vocabulary` er en union av de tre maskinnavnene, ikke en fri streng.
  - `parentId` valideres som UUID før kallet.
  - `fields` begrenses til `name` og `weight`. `sort=weight`.
  - Følg `links.next` med de samme grensene som samlingen.
  - Cache etter headerne: `next: { revalidate: 3600 }` for taxonomy. Samlingen beholder `no-store`.
- Zod-schema for term-svaret med `safeParse()`.
- Ny operasjon `taxonomy` i metrikker og logger.
- Tester: URL-bygging, ugyldig `parentId`, tom liste, ugyldig svar, paginering.

🔴 Rød sone: URL-bygging og UUID-validering. Gå gjennom denne nøye.

### 2. Anker for mål i konfigurasjon

- Les `SHARED_CONTENT_GOALS_PARENT_ID` sammen med resten av klientkonfigurasjonen og valider den som UUID.
- Mangler den i live-modus, gir konfigurasjonen feil, slik manglende API-URL gjør i dag.
- Legg variabelen i `.nais/dev.yml`. Prod endres ikke.

### 3. Bygg onboarding-modulen fra taxonomy

- Ny funksjon i `server/drupal/`, for eksempel `buildOnboardingModule.server.ts`:
  - henter de tre vokabularene parallelt
  - setter valgene inn i de lokale spørsmålene, med `id` = term-UUID og `label` = `name`, sortert etter `weight`
  - skjuler spørsmål uten valg og logger en advarsel
  - returnerer også hvilket filterfelt hvert spørsmål hører til, kun på serversiden
- `getOnboardingModule()` i live-kilden bruker den nye funksjonen.
- Mock-kilden endres ikke.
- Tester: rekkefølge etter `weight`, tomt spørsmål, alle tomme, feil fra ett av kallene.

### 4. Filtrer samlingen i API-et

- `getCollection(filter)` tar inn `{ age, experience, audiences }` med UUID-er og bygger `IN`-filtre med `URLSearchParams`.
- Bare UUID-er som finnes i modulen fra steg 3, sendes videre. `decodeSelectionParams()` har allerede avvist ukjente svar.
- `fields[node--shared_content]` reduseres til `title,field_sc_intro`. Metadata trengs ikke lenger i lista.
- `getResults()` grupperer valgte svar etter spørsmål og sender filteret videre.
- Ingen valg betyr ingen filter, og alle artiklene vises.
- Les `meta.count` i schemaet og logg avvik mot antall mottatte artikler. Vi viser den ikke i UI-et ennå.
- Tester: ett filter, flere mål, alle tre dimensjoner, ingen valg, verdier i URL-en kodes riktig.

🔴 Rød sone: filterbyggingen sender brukerstyrte verdier til API-et. Gå gjennom denne nøye.

### 5. Rydd bort lokal matching

- Slett `termMapping.server.ts`, testen og `matchArticles()`.
- `ArticleSummary` og `ArticleMetadata` fjernes hvis ingenting bruker dem lenger. Samlingen mapper rett til `ArticleResultContent`.
- `ArticleMetadataNames` beholdes for debug-panelet.

### 6. Versjon i URL-en

- `CURRENT_SELECTION_VERSION = 2`.
- Oppdater testene i `selectionParams.test.ts`.

### 7. Dokumentasjon og verifisering

- Oppdater `implementeringsplan.md` og `drupal-json-api-guide.md`: taxonomy-oppslag, filter, anker og cache.
- Oppdater `scripts/probe-shared-content.ts` så den henter valgene fra taxonomy i stedet for hardkodede UUID-er.
- Kjør `pnpm compileTS`, `pnpm lint`, `pnpm test` og `pnpm build`.
- Smoke-test i dev:
  1. Filteret viser valgene fra API-et i riktig rekkefølge.
  2. Hvert valg gir samme treff som probe-skriptet.
  3. Ingen valg gir alle artiklene.
  4. En `v=1`-lenke gir meldingen om ugyldige valg.
  5. Nettleseren sender ingen kall direkte til CMS-et.

## Rollback

- `SHARED_CONTENT_SOURCE=mock` gir lokale valg og lokal filtrering.
- `ENKLERE_VEI_TIL_JOBB_ENABLED=false` skjuler hele featuren.

Ingen data lagres, så rollback krever ingen migrering.

## Ikke med nå

- Egen vokabular for mål. Byttes inn når API-teamet har bestemt seg.
- Norske etiketter via `/nb/` eller `translated_labels`.
- Spørsmålstekster og hele onboarding-modulen fra API-et.
- Sortering av samlingen.
- Visning av `meta.count` i UI-et.
- Endringer i prod.

## Rød og grønn sone

🔴 Rød sone, skriv eller gå gjennom selv:

- Filterbyggingen i steg 4. Brukerstyrte verdier går til et eksternt API.
- UUID-validering av `parentId` og svar-ID-er.
- Konfigurasjon og validering av ankeret.

🟢 Grønn sone:

- Zod-schema for taxonomy.
- Mapping fra termer til valg.
- Metrikker, logger og tester.
- Dokumentasjon og probe-skript.
