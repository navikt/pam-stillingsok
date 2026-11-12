import { InformationSquareIcon } from "@navikt/aksel-icons";
import { BodyLong, Heading, InfoCard, Link, List } from "@navikt/ds-react";
import { InfoCardContent, InfoCardHeader, InfoCardTitle } from "@navikt/ds-react/esm/info-card";
import { ListItem } from "@navikt/ds-react/esm/list";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";

type Props = {
    readonly meta: PageInfo;
};

export default function TilgangSomArbeidsgiver({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language}>
            <Heading spacing size="xlarge" level="1">
                {meta.title}
            </Heading>
            <BodyLong spacing>
                For å benytte arbeidsgivertjenestene på arbeidsplassen.no må den ansatte enten ha Altinn-enkelttjenesten
                «Stillingsannonser på arbeidsplassen.no» eller tilgangspakken “Ansettelsesforhold”. Enkelttjenesten
                «Stillingsannonser på arbeidsplassen.no» gir tilgang til å bruke stillingsregistrering og superrask
                søknad på arbeidsplassen.no. Denne rettigheten gir ikke tilgang til å motta CVer. Tilgangspakken
                "Ansettelsesforhold” gir også rettigheter til andre tjenester.
            </BodyLong>

            <InfoCard data-color="info" className="mb-12">
                <InfoCardHeader icon={<InformationSquareIcon aria-hidden />}>
                    <InfoCardTitle>Hva er en enkelttjeneste</InfoCardTitle>
                </InfoCardHeader>
                <InfoCardContent>
                    <BodyLong spacing>En enkelttjeneste er en fullmakt til én bestemt oppgave i Altinn.</BodyLong>
                    <BodyLong className="mb-4">Det kan være:</BodyLong>
                    <List className="mb-6">
                        <ListItem>ett skjema</ListItem>
                        <ListItem>én meldingstjeneste</ListItem>
                        <ListItem>én spesifikk digital tjeneste</ListItem>
                    </List>
                    <BodyLong>
                        Du bruker en enkelttjeneste når personen bare skal utføre én konkret oppgave, og ikke trenger
                        fullmakt til alt som ligger i en tilgangspakke. Les mer om enkelttjenester på Altinn sin
                        hjemmeside:{" "}
                        <Link
                            inlineText
                            href="https://info.altinn.no/hjelp/tilgang-og-fullmakt/#gi-eller-be-om-fullmakt-til-enkelttjenester"
                        >
                            Altinn - Tilgang og fullmakt
                        </Link>
                    </BodyLong>
                </InfoCardContent>
            </InfoCard>

            <Heading spacing size="large" level="2">
                Hvordan tildele enkeltrettigheten «Stillingsannonser på arbeidsplassen.no»
            </Heading>
            <BodyLong spacing>
                Hvis den ansatte som skal bruke arbeidsgivertjenestene på arbeidsplassen.no ikke har tilgangspakker
                eller enkelttjenester fra før, må det tildeles i Altinn. Daglig leder, styrets leder og andre som har
                fått tildelt tilgangspakken «Tilgangsstyring» kan tildele og fjerne tilganger.
            </BodyLong>
            <BodyLong spacing>
                Gå til altinn.no og velg «Logg inn». Du bruker din private innlogging. Hvilken elektronisk ID du ønsker
                å bruke er opp til deg.
            </BodyLong>
            <BodyLong spacing>
                Når du har logget inn, er det viktig at du velger riktig underenhet, fordi tilgangen til tjenestene på
                arbeidsplassen.no er på underenhet, ikke hovedenhet. Rett under navnet ditt vises det hvilken hovedenhet
                eller underenhet du representerer. For å tildele ny tilgangspakke eller enkelttjeneste, se Altinn sin
                guide:{" "}
                <Link
                    inlineText
                    href="https://info.altinn.no/hjelp/tilgang-og-fullmakt/#gi-eller-be-om-fullmakt-til-enkelttjenester"
                >
                    https://info.altinn.no/hjelp/tilgang-og-fullmakt/#gi-eller-be-om-fullmakt-til-enkelttjenester
                </Link>{" "}
                Her kan du gi fullmakt til enkelttjenesten “Stillingsannonser på arbeidsplassen.no”.
            </BodyLong>
            <BodyLong spacing>
                Hvis du ønsker å se hvem som har rettigheter i virksomheten, kan du gå til «Brukere» i menylinjen.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Hvordan fjerne enkeltrettigheten «Stillingsannonser på arbeidsplassen.no»
            </Heading>
            <BodyLong spacing>
                Dersom en person med enkelttjenesten «Stillingsannonser på arbeidsplassen.no» ikke lenger skal ha
                tilgang, eller slutter i virksomheten, har du som arbeidsgiver ansvar for å fjerne fullmakten i Altinn.
                Daglig leder, styrets leder og andre som har fått tildelt tilgangspakken «tilgangsstyring» kan tildele
                og fjerne tilganger.
            </BodyLong>
            <BodyLong spacing>
                Gå til altinn.no og velg «Logg inn». Du bruker din private innlogging. Hvilken elektronisk ID du ønsker
                å bruke er opp til deg.
            </BodyLong>
            <BodyLong spacing>
                Når du har logget inn er det viktig at du velger riktig underenhet, fordi tilgangen til tjenestene på
                arbeidsplassen.no er på underenhet, ikke hovedenhet. Rett under navnet ditt vises det hvilken hovedenhet
                eller underenhet du representerer.
            </BodyLong>
            <BodyLong spacing>
                For å fjerne en persons enkeltrettighet klikker du på «Brukere» i menylinjen. Klikk på personen du skal
                fjerne rettigheten til og velg fanen “Enkelttjenester”. Klikk på “- Slett fullmakt” på rettigheten du
                ønsker å fjerne.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Hvordan sjekke om en ansatt har enkeltrettigheten «Stillingsannonser på arbeidsplassen.no»
            </Heading>
            <BodyLong spacing>
                For å benytte arbeidsgivertjenestene på arbeidsplassen.no må den ansatte ha enkelttjenesten
                «Stillingsannonser på arbeidsplassen.no» eller tilgangspakken “Ansettelsesforhold”. Enkelttjenesten
                «Stillingsannonser på arbeidsplassen.no» gir tilgang til å bruke stillingsregistrering og superrask
                søknad på arbeidsplassen.no. Denne enkelttjenesten gir ikke tilgang til å motta CVer. Tilgangspakken
                “Ansettelsesforhold” gir også rettigheter til andre ting. Daglig leder og styreleder i en virksomhet har
                automatisk enkelttjenesten «Stillingsannonser på arbeidsplassen.no».
            </BodyLong>
            <BodyLong spacing>
                Gå til altinn.no og velg «Logg inn». Du bruker din private innlogging. Hvilken elektronisk ID du ønsker
                å bruke er opp til deg.
            </BodyLong>
            <BodyLong spacing>
                Når du har logget inn er det viktig at du velger riktig underenhet, fordi tilgangen til tjenestene på
                arbeidsplassen.no er på underenhet, ikke hovedenhet. Rett under navnet ditt vises det hvilken hovedenhet
                eller underenhet du representerer.
            </BodyLong>
            <BodyLong spacing>
                For å se hvem som har rettigheter i virksomheten trykk på «Brukere» i menylinjen. Velg brukeren du
                ønsker å sjekke rettigheter for. Enkeltrettigheter brukeren har vises under fanen “Enkelttjenester”.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Hvordan tildele rollen tilgangsstyring
            </Heading>
            <BodyLong spacing>
                I større selskaper kan det være hensiktsmessig at flere ansatte har ansvaret for å delegere eller fjerne
                rettigheter. Tilgangspakken «Tilgangsstyring» gir mulighet til å gi eller fjerne tilgangspakker og
                enkelttjenester man selv har på vegne av virksomheten. Daglig leder eller styrets leder kan gi en eller
                flere ansatte i virksomheten tilgangspakken «Tilgangsstyring». Se:{" "}
                <Link
                    inlineText
                    href="https://info.altinn.no/hjelp/tilgang-og-fullmakt/#gi-eller-be-om-fullmakt-til-tilgangspakker"
                >
                    https://info.altinn.no/hjelp/tilgang-og-fullmakt/#gi-eller-be-om-fullmakt-til-tilgangspakker
                </Link>
            </BodyLong>
        </ArticleWrapper>
    );
}
