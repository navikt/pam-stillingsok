import { BodyLong, BodyShort, Heading, Link } from "@navikt/ds-react";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

type Props = {
    readonly meta: PageInfo;
};

export default function TilgangSomArbeidsgiver({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language}>
            <AkselNextLink href="/arbeidsgivertjenester" className="mb-8">
                <ChevronLeftIcon aria-hidden="true" />
                <BodyShort>Tilbake</BodyShort>
            </AkselNextLink>
            <Heading spacing size="xlarge" level="1">
                {meta.title}
            </Heading>
            <BodyLong spacing>
                For å benytte arbeidsgivertjenestene på arbeidsplassen.no må den ansatte ha enten
                Altinn-enkeltrettigheten «Stillingsannonser på arbeidsplassen.no» eller en av Altinn-rollene «Lønn og
                personalmedarbeider» eller «Utfyller/Innsender». Enkeltrettigheten «Stillingsannonser på
                arbeidsplassen.no» gir tilgang til å bruke stillingsregistrering og superrask søknad på
                arbeidsplassen.no. Denne rettigheten gir ikke tilgang til å motta CVer. De to rollene gir også
                rettigheter til andre ting.
            </BodyLong>
            <Heading spacing size="large" level="2">
                Hvordan tildele enkeltrettigheten «Stillingsannonser på arbeidsplassen.no»
            </Heading>
            <BodyLong spacing>
                Hvis den ansatte som skal bruke arbeidsgivertjenestene på Arbeidsplassen.no ikke har roller eller
                enkeltrettigheter fra før, må det tildeles i Altinn. Daglig leder, styrets leder og andre som har fått
                tildelt rollen «tilgangsstyring» kan tildele og fjerne tilganger.
            </BodyLong>
            <BodyLong spacing>
                Gå til altinn.no og velg «Logg inn». Du bruker din private innlogging. Hvilken elektronisk ID du ønsker
                å bruke er opp til deg.
            </BodyLong>
            <BodyLong spacing>
                Når du har logget inn er det viktig at du velger riktig underenhet, fordi tilgangen til tjenestene på
                arbeidsplassen.no er på underenhet, ikke hovedenhet. Du kan hake av for «Se alle underenheter». Rett
                under navnet ditt vises det hvilken hovedenhet eller underenhet du representerer.
            </BodyLong>
            <BodyLong spacing>
                For å tildele ny rolle eller enkeltrettighet klikker du på «profil» i menylinjen. Velg så «Andre med
                rettigheter til virksomheten» og «+ Legg til ny person eller virksomhet». Skriv inn fødselsnummer og
                etternavn på personen du vil legge til, og klikk «Neste». I det neste bildet kan du gi og fjerne
                rettigheter. Velg «+ Gi tilgang til enkelttjenester». Skriv «Stillingsannonser på arbeidsplassen.no» i
                søkefeltet og velg alternativet «Stillingsannonser på arbeidsplassen.no» som vises. Trykk «Neste» og
                deretter «Gi rettigheter». Du har nå gitt personen enkeltrettigheten «Stillingsannonser på
                arbeidsplassen.no».
            </BodyLong>
            <BodyLong spacing>
                Hvis du ønsker å se hvem som har rettigheter i virksomheten kan du gå til «Profil» i menylinjen og velge
                «Andre med rettigheter til virksomheten».
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Hvordan fjerne enkeltrettigheten «Stillingsannonser på arbeidsplassen.no»
            </Heading>
            <BodyLong spacing>
                Dersom en person med rettigheten «Stillingsannonser på arbeidsplassen.no» ikke lenger skal ha tilgang,
                eller slutter i virksomheten, har du som arbeidsgiver ansvar for å fjerne rettigheten i Altinn. Daglig
                leder, styrets leder og andre som har fått tildelt rollen «tilgangsstyring» kan tildele og fjerne
                tilganger.
            </BodyLong>
            <BodyLong spacing>
                Gå til altinn.no og velg «Logg inn». Du bruker din private innlogging. Hvilken elektronisk ID du ønsker
                å bruke er opp til deg.
            </BodyLong>
            <BodyLong spacing>
                Når du har logget inn er det viktig at du velger riktig underenhet, fordi tilgangen til tjenestene på
                arbeidsplassen.no er på underenhet, ikke hovedenhet. Du kan hake av for «Se alle underenheter». Rett
                under navnet ditt vises det hvilken hovedenhet eller underenhet du representerer.
            </BodyLong>
            <BodyLong spacing>
                For å fjerne en persons enkeltrettighet klikker du på «profil» i menylinjen. Velg så «Andre med
                rettigheter i virksomheten». Klikk på personen du skal fjerne rettigheten til. For å fjerne rettigheter
                i Altinn klikker du på «Fjerne en eller flere rettigheter»
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Hvordan sjekke om en ansatt har enkeltrettigheten «Stillingsannonser på arbeidsplassen.no»
            </Heading>
            <BodyLong spacing>
                For å benytte arbeidsgivertjenestene på arbeidsplassen.no må den ansatte ha enkeltrettigheten
                «Stillingsannonser på arbeidsplassen.no» eller rollen «Lønn og personalmedarbeider» eller rollen
                «Utfyller/Innsender». Enkeltrettigheten «Stillingsannonser på arbeidsplassen.no» gir tilgang til å bruke
                stillingsregistrering og superrask søknad på arbeidsplassen.no. Denne rettigheten gir ikke tilgang til å
                motta CVer. De to rollene gir også rettigheter til andre ting. Daglig leder og styreleder i en
                virksomhet har automatisk rettigheten «Stillingsannonser på arbeidsplassen.no».
            </BodyLong>
            <BodyLong spacing>
                Gå til altinn.no og velg «Logg inn». Du bruker din private innlogging. Hvilken elektronisk ID du ønsker
                å bruke er opp til deg.
            </BodyLong>
            <BodyLong spacing>
                Når du har logget inn er det viktig at du velger riktig underenhet, fordi tilgangen til tjenestene på
                arbeidsplassen.no er på underenhet, ikke hovedenhet. Du kan hake av for «Se alle underenheter». Rett
                under navnet ditt vises det hvilken hovedenhet eller underenhet du representerer.
            </BodyLong>
            <BodyLong spacing>
                For å se hvem som har rettigheter i virksomheten trykk på «profil» i menylinjen. Velg så «Andre med
                rettigheter til virksomheten». Dersom personen vises i listen kan du klikke på «Se rettigheter» for å se
                hvilke enkeltrettigheter og/eller roller personen har.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Hvordan tildele rollen tilgangsstyring
            </Heading>
            <BodyLong spacing>
                I større selskaper kan det være hensiktsmessig at flere ansatte har ansvaret for å delegere eller fjerne
                rettigheter. Rollen «tilgangsstyring» gir mulighet til å gi eller fjerne roller og rettigheter man selv
                har på vegne av virksomheten. Daglig leder eller styrets leder kan gi en eller flere ansatte i
                virksomheten rollen «tilgangsstyring».
            </BodyLong>
            <BodyLong spacing>
                Gå til altinn.no og velg «Logg inn». Du bruker din private innlogging. Hvilken elektronisk ID du ønsker
                å bruke er opp til deg.
            </BodyLong>
            <BodyLong spacing>
                For å tildele ny rolle klikker du på «profil» i menylinjen. Velg så «Andre med rettigheter til
                virksomheten» og «+ Legg til ny person eller virksomhet» dersom vedkommende ikke står oppført fra før.
                Skriv inn fødselsnummer og etternavn på personen du vil legge til, og klikk «Neste». I det neste bildet
                kan du gi og fjerne rettigheter. Trykk på «Har også disse rollene» og velg «+ Legg til ny rolle». Velg
                «Tilgangsstyring» og trykk «Ferdig» nederst på siden.
            </BodyLong>
            <BodyLong spacing>
                Merk at nettsiden til Altinn kan endre seg. Denne beskrivelsen er sist oppdatert i mai 2023.
            </BodyLong>
            <BodyLong spacing>
                Se også Altinn sine egne veiledninger.{" "}
                <Link href="https://info.altinn.no/hjelp/profil/enkelttjenester-og-roller/hvordan-gi-en-enkelttjeneste-og-rolle-til-andre/">
                    https://info.altinn.no/hjelp/profil/enkelttjenester-og-roller/hvordan-gi-en-enkelttjeneste-og-rolle-til-andre/
                </Link>
            </BodyLong>
            <Link href="https://www.altinn.no/hjelp/sok/?q=delegere%20rettighet">
                https://www.altinn.no/hjelp/sok/?q=delegere%20rettighet{" "}
            </Link>
        </ArticleWrapper>
    );
}
