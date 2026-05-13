# CONTEXT.md — pam-stillingsok

Stillingsøk-frontend på arbeidsplassen.no.
Jobbsøkere søker i stillinger (uautentisert) og lagrer favoritter/søk (autentisert via ID-porten).
Jobbsøkere kan lese artikler om å finne jobber. Arbeidsgivere kan lese artikler om å skrive gode annonser.

## Tech Stack

- Next.js 16 / TypeScript / pnpm
- Nais (Kubernetes on GCP)
- Vitest for testing
- `@navikt/ds-react` (Aksel) for UI-komponenter

## Arkitektur

```
Bruker → Wonderwall (auth-proxy) → Next.js (pam-stillingsok)
                                        ├── arbeidsplassen-search-api  (stillinger via OpenSearch)
                                        ├── pam-aduser                 (favoritter, lagrede søk, brukerdata)
                                        ├── interest-api               (superrask søknad, trekk søknad)
                                        └── Redis/Valkey               (server-side cache)
```

### Sentrale dataflyter

**Stillingsøk (uautentisert)**:
```
URL-params → createQuery() → toApiQuery() → elasticSearchRequestBody() → fetch search-api
    → StillingSoekResponseSchema (Zod) → simplifySearchResponse() → SearchResult
```

**Stillingsdetalj**:
```
[id] → getAdData() → fetch search-api → ElasticHitSchema → transformAdDataLegacy() → AdDTOSchema → AdDTO
```

**Server actions mot pam-aduser (autentisert)**:
```
Server action → getDefaultHeaders() → getAduserRequestHeaders({ csrf }) → fetch pam-aduser
    → incrementAdUserRequests() → appLogger.httpError() ved feil
```

### Autentisering (server-side)

- `getAduserRequestHeaders()` i `aduserAuth.server.ts`: OBO-token + headers + CSRF. Brukes av server actions.
- `exchangeTokenOasis()` i `auth.server.ts`: Enklere OBO-bytte. Brukes av API-ruter.
- Returnerer discriminated unions (`{ ok: true, headers }` | `{ ok: false, reason }`) — aldri throw.
- CSRF-bootstrapping skjer automatisk ved `csrf: "required"` (skriveoperasjoner).

### Klient-side sesjon

`AuthenticationProvider` → `UserProvider` → `FavouritesProvider` i kjede.
Broadcast-events: `USER_LOGGED_IN`, `USER_LOGGED_OUT`.

### URL-parameterversjonering

Søke-URLer er versjonert (`?v=5`). Migreringslogikk i `src/app/stillinger/(sok)/_utils/versioning/`.
