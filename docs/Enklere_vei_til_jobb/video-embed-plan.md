# Video i onboarding-resultatet

> Status: Qbrick er implementert i mockflyten. Vimeo vises som ekstern lenke.
>
> Vimeo-embedding avventer godkjenning fra personvernansvarlig og skal ikke implementeres før godkjenningen er på plass.

## Avgrensning

Løsningen støtter Qbrick og Vimeo. YouTube er utelukket.

Nåværende leveranse:

- embedder Qbrick med den eksisterende `QbrickVideo`-komponenten
- viser Vimeo som ekstern lenke i samme fane
- bruker bare mockdata
- endrer ikke CSP
- legger ikke til player-SDK eller andre avhengigheter

Livekobling for video avventer en bekreftet Qbrick-kontrakt fra Shared Content.

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

UI-et viser lenka med Aksel `LinkCard`, teksten «Video hos Vimeo» og eventuell varighet. Lenka åpnes i samme fane. Ingen Vimeo-iframe eller leverandør-hostet thumbnail lastes på Arbeidsplassen.

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
};
```

Varighet og thumbnail er valgfrie metadata. Provider-feltet gjør at UI-et ikke må tolke URL-er eller håndtere kombinasjoner som `mediaId` og `href` samtidig.

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
                └── field_media_oembed_video
```

Spørringen må inkludere:

```text
field_sc_content.field_video_media
```

Eksempelfilene ligger i:

- `docs/Enklere_vei_til_jobb/json_eksempler/collection.json`
- `docs/Enklere_vei_til_jobb/json_eksempler/on_its_own.json`

`rendered_html` skal ikke brukes som spillerkontrakt. Frontend skal bruke den strukturerte medierelasjonen og validere URL-en.

## Vimeo-embedding avventer godkjenning

Vimeo skal forbli en ekstern lenke fram til personvernansvarlig har vurdert:

- databehandling og nødvendige cookies hos Vimeo
- om klikk-for-å-laste gir tilstrekkelig informasjon og kontroll
- teksten som skal vises før brukeren laster inn Vimeo
- om personvernerklæringen må oppdateres

Det skal ikke legges til Vimeo-host i `frame-src` før denne vurderingen er godkjent.

### Arbeid etter godkjenning

Når Vimeo-embedding er godkjent:

1. Lag en klikk-for-å-laste-komponent for Vimeo.
2. Bygg iframe-URL-en lokalt fra validert video-ID.
3. Bruk `https://player.vimeo.com/video/{id}?dnt=1`.
4. Ikke last iframe eller Vimeo-thumbnail før aktivt klikk.
5. Legg bare `https://player.vimeo.com` til `frame-src`.
6. Behold ekstern lenke som fallback ved ugyldig eller ukjent innhold.
7. Test tastaturbruk, tilgjengelig navn, 200 prosent zoom og smal skjerm.
8. Test at ingen Vimeo-kall skjer før brukeren aktiverer videoen.

Ingen Vimeo-SDK er planlagt.

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
- avvisning av ugyldig Vimeo-protokoll og lookalike-host
- bevart blokk-rekkefølge
- ingen Qbrick-iframe før klikk
- riktig Qbrick-iframe etter klikk
- Vimeo-lenke i samme fane
- ingen Vimeo-iframe
- automatisk UU-test av resultatinnholdet
