# Video i onboarding-resultatet

> Status: Qbrick og Vimeo embeddes med klikk-for-å-laste-komponenter (`QbrickVideo` og `VimeoVideo`)
> i både onboarding-resultater og Shared Content-artikler. Vimeo-lenken hentes fra API-et og
> valideres med `isSafeVimeoHref()` før den brukes; komponenten gjør ingen Vimeo-kall før brukeren
> klikker. CSP (`frame-src`) tillater `https://player.vimeo.com`. I Shared Content-artikler vises en
> valgfri thumbnail fra Drupals fil-proxy (CMS-origin, aldri et direkte kall til Vimeo) før klikk.
>
> Gjenstår: brukerrettet personvern- og cookieinformasjon om Vimeo-innbygging må godkjennes og
> publiseres av innholdsansvarlig før dette regnes som ferdig fra et personvernperspektiv.

## Avgrensning

Løsningen støtter Qbrick og Vimeo. YouTube er utelukket.

Nåværende leveranse:

- embedder Qbrick med den eksisterende `QbrickVideo`-komponenten
- embedder Vimeo med den delte `VimeoVideo`-komponenten (`src/app/_common/VimeoVideo/`), brukt i
  både onboarding-resultater (`ResultContent`) og Shared Content-artikler (`ArticleContent`)
- validerer Vimeo-lenken på serversiden (`isSafeVimeoHref()`) før den sendes til klienten, og bygger
  embed-URL-en lokalt fra et utledet numerisk ID i stedet for å stole på en vilkårlig API-URL
- laster ingen Vimeo-ressurs før brukeren klikker på avspillingsknappen
- sporer aktivering med Umami-eventet `Klikk - video`, som nå har et `provider`-felt
  (`"qbrick" | "vimeo"`) i tillegg til område og plassering; URL-en spores ikke
- legger `https://player.vimeo.com` til CSP sitt `frame-src`
- viser en valgfri thumbnail i artikler, hentet via Drupals `field_video_media.thumbnail`-relasjon
  (en `file--file`-ressurs på CMS-origin). Thumbnailen er alltid fra vår egen fil-proxy, aldri fra
  Vimeo direkte. Filen kan mangle på proxyen selv om relasjonen finnes i JSON:API-responsen;
  mapperen og komponenten faller da stille tilbake til gradient-placeholderen uten å feile mappingen
- legger ikke til player-SDK eller andre avhengigheter

Live resultatflyt bygger fortsatt resultatseksjoner fra artikler
(`liveSharedContentSource.server.ts`); egne FAQ-videoblokker finnes bare i mockdata. Når Shared
Content leverer en tilsvarende videoblokk i live resultater, kan samme domenetype og komponenter
gjenbrukes uten videre endring.


## Implementert Qbrick-flyt

Mockadapteren mapper en Qbrick-videoblokk til en provider-spesifikk domenetype:

```text
paragraph--answer_video
├── field_video_provider = qbrick
├── field_qbrick_media_id
├── field_title
├── field_duration
└── field_thumbnail
```

`ResultContent` sender den validerte media-ID-en til dagens `QbrickVideo`.

Komponenten:

- viser plakatbildet før avspilling
- oppretter ingen iframe før brukeren trykker «Spill av video»
- bygger Qbrick-URL-en fra en kjent host, konto og config
- bruker en tilgjengelig iframe-tittel og avspillingsknapp
- beholder dagens samtykkebevisste trackingmekanisme, men onboarding sender ikke nye trackingdata ennå

Mocken bruker sommerjobbvideoen som allerede finnes på Arbeidsplassen:

```text
mediaId=b87f69fe-5b28-40e6-8446-6e08c8beb3d5
```

Eksisterende Qbrick-artikkelsider og `QbrickVideo` er ikke endret.

## Implementert Vimeo-flyt

Mockadapteren mapper en Vimeo-videoblokk til en ekstern lenke:

```text
paragraph--answer_video
├── field_video_provider = vimeo
├── source_url
└── field_title
```

Adapteren tillater bare:

- `https://vimeo.com/{numerisk-id}`
- `https://player.vimeo.com/video/{numerisk-id}`

Valideringen avviser blant annet:

- HTTP
- credentials og porter
- fragmenter og query-parametre
- lookalike-hoster som `vimeo.com.evil.example`
- andre path-formater

Et tomt spørsmålstegn etter video-ID-en godtas fordi staging leverer dette:

```text
https://player.vimeo.com/video/1180806925?
```

UI-et bruker den delte `VimeoVideo`-komponenten: en 16:9-ramme med last-knapp. Iframen lastes først
etter klikk, med `dnt=1` og `autoplay=1`. I Shared Content-artikler vises i tillegg en valgfri thumbnail fra Drupals
fil-proxy før klikk; onboarding-resultater (mockdata) har ingen thumbnail-kilde og viser bare
gradient-placeholderen.

## Domenemodell

Videoblokka har to gyldige varianter:

```ts
type QbrickVideoBlock = {
    type: "video";
    provider: "qbrick";
    mediaId: string;
    title: string;
};

type VimeoVideoBlock = {
    type: "video";
    provider: "vimeo";
    href: string;
    title: string;
    thumbnailSrc?: string;
};
```

Thumbnail er valgfri metadata. `thumbnailSrc` er alltid en absolutt URL på CMS-origin
(Drupals fil-proxy), aldri en Vimeo-URL. Provider-feltet gjør at UI-et ikke må tolke URL-er eller
håndtere kombinasjoner som `mediaId` og `href` samtidig.

Mockfeltene er foreløpige. Drupal-feltnavnene skal ikke lekke videre enn adapteren.

## Bekreftet Vimeo-kontrakt i staging

Staginginnholdet «Hvordan finner jeg flere relevante jobber?» har denne relasjonen:

```text
node--shared_content
└── field_sc_content
    └── paragraph--video
        └── field_video_media
            └── media--remote_video
                ├── name
                ├── field_media_oembed_video
                └── thumbnail (file--file, valgfri)
```

Spørringen må inkludere:

```text
field_sc_content.field_video_media
field_sc_content.field_video_media.thumbnail
```

Eksempelfilene ligger i:

- `src/features/ung/onboarding/server/drupal/__fixtures__/collection.json`
- `src/features/ung/onboarding/server/drupal/__fixtures__/on_its_own.json`

`rendered_html` skal ikke brukes som spillerkontrakt. Frontend skal bruke den strukturerte medierelasjonen og validere URL-en.

## Vimeo-embedding er implementert

Produktbeslutning (2026-10-08): Vimeo skal støttes med samme klikk-for-å-laste-mønster som
Qbrick. Løsningen er gjennomført som beskrevet i «Nåværende leveranse» ovenfor:

- `VimeoVideo`-komponenten (`src/app/_common/VimeoVideo/`) bygger embed-URL-en lokalt fra et
  validert, numerisk video-ID, aldri fra en vilkårlig API-URL.
- Iframen lastes ikke før et aktivt klikk.
- Embed-URL-en er `https://player.vimeo.com/video/{id}?dnt=1&autoplay=1`.
- `frame-src` i `src/proxy.ts` har bare fått `https://player.vimeo.com` lagt til.
- Ved ugyldig eller ukjent lenkeform vises bare den rå lenken som tekst, ingen embed og ingen
  Vimeo-reservelenke.
- I artikler vises en valgfri thumbnail fra `field_video_media.thumbnail` (Drupals fil-proxy,
  CMS-origin) før klikk. Mangler filen på proxyen, eller feiler lastingen i nettleseren, faller
  komponenten stille tilbake til gradient-placeholderen. Ingen direkte kall til
  `vimeo.com/api/oembed.json` er lagt til, siden det ville vært et kall til Vimeo før klikk.
- Ingen Vimeo-SDK er lagt til.

**Gjenstår før dette er ferdig fra et personvernperspektiv:** brukerrettet tekst om at Vimeo
mottar vanlige forespørselsdata når brukeren starter en video, og en vurdering av om
personvernerklæringen eller cookieoversikten (`src/app/(artikler)/personvern/` og
`src/app/(artikler)/informasjonskapsler/`) må oppdateres. Dette krever godkjenning fra
innholdsansvarlig og er ikke en kodeendring.

## Live Qbrick avventer API-kontrakt

API-teamet må bekrefte om Qbrick leveres som:

- URL i `field_media_oembed_video`
- egen medietype eller eget felt
- Qbrick media-ID

Når kontrakten er kjent, skal liveadapteren mappe den til samme domenetype som mockadapteren. Resultatkomponenten og `QbrickVideo` skal ikke kjenne Drupal-feltnavnene.

## Tester

Implementasjonen dekker:

- mapping av Qbrick media-ID og Vimeo-URL
- avvisning av ugyldig Qbrick-ID
- avvisning av ugyldig Vimeo-protokoll og lookalike-host (`isSafeVimeoHref`, dedikert testet i
  `urlSafety.test.ts` og `vimeoHref.test.ts`)
- bevart blokk-rekkefølge
- ingen Qbrick- eller Vimeo-iframe før klikk
- riktig Qbrick- og Vimeo-iframe-URL etter klikk, inkludert `dnt=1`
- rå lenke vist i stedet for embed ved ugyldig lenkeform
- `Klikk - video`-eventet med riktig `provider`
- mapping av thumbnail fra `field_video_media.thumbnail`, inkludert relativ-til-absolutt-URL og
  at mappingen ikke feiler når fil-ressursen mangler i `included`
- thumbnail vist før klikk, og fallback til gradient-placeholder når bildet feiler å laste
- automatisk UU-test av resultat- og artikkelinnholdet samt `VimeoVideo`
