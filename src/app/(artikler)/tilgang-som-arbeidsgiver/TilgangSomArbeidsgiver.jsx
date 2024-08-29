import { BodyLong, Heading, Link as AkselLink } from "@navikt/ds-react";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import NextLink from "next/link";

export default function TilgangSomArbeidsgiver() {
    return (
        <article className="container-small mt-5 mb-24">
            <AkselLink as={NextLink} href="/arbeidsgivertjenester" className="mb-8">
                <ChevronLeftIcon aria-hidden="true" />
                Tilbake
            </AkselLink>
            <Heading spacing size="xlarge" level="1">
                Hvordan gi eller få tilgang som arbeidsgiver
            </Heading>
            <BodyLong spacing>
                For å benytte arbeidsgivertjenestene på arbeidsplassen.no må den ansatte ha enten
                Altinn-enkeltrettigheten «Rekruttering» eller en av Altinn-rollene «Lønn og personalmedarbeider» eller
                «Utfyller/Innsender». Enkeltrettigheten «Rekruttering» gir kun tilgang til NAVs rekrutteringstjenester.
                De to rollene gir også rettigheter til andre ting.
            </BodyLong>
            <Heading spacing size="large" level="2">
                Hvordan tildele enkeltrettigheten rekruttering
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
                rettigheter. Velg «+ Gi tilgang til enkelttjenester». Skriv «Rekruttering» i søkefeltet og velg
                alternativet «Rekruttering» som vises. Trykk «Neste» og deretter «Gi rettigheter». Du har nå gitt
                personen enkeltrettigheten “Rekruttering”.
            </BodyLong>
            <BodyLong spacing>
                Hvis du ønsker å se hvem som har rettigheter i virksomheten kan du gå til «Profil» i menylinjen og velge
                «Andre med rettigheter til virksomheten».
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Hvordan fjerne enkeltrettigheten rekruttering
            </Heading>
            <BodyLong spacing>
                Dersom en person med rettigheten rekruttering ikke lenger skal ha tilgang, eller slutter i virksomheten,
                har du som arbeidsgiver ansvar for å fjerne rettigheten i Altinn. Daglig leder, styrets leder og andre
                som har fått tildelt rollen «tilgangsstyring» kan tildele og fjerne tilganger.
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
                Hvordan sjekke om en ansatt har enkeltrettigheten rekruttering
            </Heading>
            <BodyLong spacing>
                For å benytte arbeidsgivertjenestene på arbeidsplassen.no må den ansatte ha enkeltrettigheten
                «Rekruttering» eller rollen «Lønn og personalmedarbeider» eller rollen «Utfyller/Innsender».
                Enkeltrettigheten «Rekruttering» gir kun tilgang til NAVs rekrutteringstjenester. De to rollene gir også
                rettigheter til andre ting. Daglig leder og styreleder i en virksomhet har automatisk rettigheten
                Rekruttering.
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
                <AkselLink href="Se også Altinn sine egne veiledninger. https://www.altinn.no/hjelp/profil/roller-og-rettigheter/hvordan-gi-rettigheter-til-andre/">
                    https://www.altinn.no/hjelp/profil/roller-og-rettigheter/hvordan-gi-rettigheter-til-andre/
                </AkselLink>
            </BodyLong>
            <AkselLink href="https://www.altinn.no/hjelp/sok/?q=delegere%20rettighet">
                https://www.altinn.no/hjelp/sok/?q=delegere%20rettighet{" "}
            </AkselLink>
        </article>
    );
}
