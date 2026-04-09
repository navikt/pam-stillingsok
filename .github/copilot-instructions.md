# GitHub Copilot Instructions

Next.js 16 · TypeScript · Vitest · pnpm · `@navikt/ds-react` (Aksel)

> Kodestil, spacing og UU er dekket i `.github/instructions/`-filer som lastes automatisk ved filmatch.

>Når du rapporterer informasjon til meg, vær ekstremt kortfattet og ofre grammatikk for korthetens skyld
---

## Arkitektur

```
Bruker → Wonderwall (auth-proxy) → Next.js (pam-stillingsok)
                                        ├── arbeidsplassen-search-api  (stillinger via OpenSearch)
                                        ├── pam-aduser                 (favoritter, lagrede søk, brukerdata)
                                        ├── interest-api               (superrask søknad, trekk søknad)
                                        └── Redis/Valkey               (server-side cache)
```

- **Søk** er uautentisert og treffer arbeidsplassen-search-api direkte.
- **Brukerdata** (favoritter, lagrede søk, bruker-CRUD) krever innlogging via pam-aduser med OBO-token (TokenX).
- **Wonderwall** sitter foran appen i GCP og håndterer ID-porten OIDC.

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

---

## Nøkkelkonvensjoner

- **Server actions**: `_common/actions/`-mapper, `"use server"`. Mønster: headers → auth → fetch → metrics → logg → retur. GET: `csrf: "none"`, skriving: `csrf: "required"`. Returtype: `ActionResponse<T>`.
- **Zod**: All ekstern data valideres. Bruk `safeParse()` — aldri `parse()`.
- **Tracking**: Via `src/app/_common/umami/` og `trackEvent()` — aldri `window.umami` direkte.
- **Logging**: `appLogger` fra `src/app/_common/logging/appLogger.ts`. HTTP-feil: `appLogger.httpError({ method, url, status, statusText })`.
