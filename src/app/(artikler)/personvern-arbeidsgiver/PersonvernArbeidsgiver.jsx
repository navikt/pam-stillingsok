import { BodyLong, Heading, Link as AkselLink } from "@navikt/ds-react";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import NextLink from "next/link";

export default function PersonvernArbeidsgiver() {
    return (
        <article className="container-small mt-5 mb-24">
            <AkselLink as={NextLink} href="/personvern" className="mb-8">
                <ChevronLeftIcon aria-hidden="true" />
                Til personvernserklæring
            </AkselLink>
            <Heading size="xlarge" level="1" spacing>
                Personvernerklæring for deg som representerer en arbeidsgiver
            </Heading>
            <BodyLong className="mb-8">Sist endret 1. februar 2022</BodyLong>

            <Heading size="large" level="2" spacing>
                Innhold
            </Heading>
            <ul className="mb-12">
                <li>
                    <BodyLong>
                        <AkselLink href="#information">Hvilke personopplysninger samler vi inn?</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#goals">Hvilke formål brukes personopplysningene til?</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#time">Hvor lenge lagres opplysningene?</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#legal">
                            Hva er det rettslige grunnlaget for behandlingen av personopplysninger?
                        </AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#who">Hvem deles opplysningene med?</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#rights">Hvilke rettigheter har du?</AkselLink>
                    </BodyLong>
                </li>
            </ul>

            <Heading size="large" level="2" spacing id="information">
                Hvilke personopplysninger samler vi inn?
            </Heading>
            <BodyLong spacing>
                Mens du er innlogget vil innloggingsinformasjon du avgir oppbevares i en informasjonskapsel, som gjør at
                du forblir innlogget hele tiden mens du er inne på våre sider.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Stillingsannonser
            </Heading>
            <BodyLong spacing>
                Vi behandler stillingsannonser som virksomheten har publisert på arbeidsplassen.no, herunder
                personopplysninger du har oppgitt i disse, for eksempel navn og kontaktinformasjon. Dette inkluderer
                stillinger sendt inn via rekrutteringssystemer vi samarbeider med. Annonserer du stillingene dine i
                aviser tilknyttet Amedia eller Polaris media blir de automatisk overført og vist på arbeidsplassen.no.
                Annonsene arkiveres og anonymiserte opplysninger brukes til statistiske formål.
            </BodyLong>
            <BodyLong spacing>
                Arbeidsgivere kan ikke kreve noen form for avgift eller annet vederlag fra arbeidssøkere for tilbud om
                ansettelse.
            </BodyLong>

            <Heading className="mb-8" size="large" level="2" id="goals">
                Hvilke formål brukes personopplysningene til?
            </Heading>
            <Heading size="medium" level="3" spacing>
                Velfungerende arbeidsmarked
            </Heading>
            <BodyLong spacing>
                Arbeidsplassen.no skal bidra et velfungerende arbeidsmarked gjennom en åpen plattform for
                arbeidsmarkedet. Vi lagrer og behandler personopplysninger for å gjøre det enklere for jobbsøkere å
                finne jobb og for arbeidsgivere å skaffe arbeidskraft. Dette er i tråd med NAVs samfunnsoppdrag om å få
                flere i arbeid.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Statistikk og kunnskap om arbeidsmarkedet
            </Heading>
            <BodyLong className="mb-12">
                NAV benytter opplysningene fra arbeidsplassen.no til å utvikle statistikk og kunnskap om
                arbeidsmarkedet. Les mer i{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering#chapter-3">
                    NAVs personvernerklæring.
                </AkselLink>
            </BodyLong>

            <Heading size="large" level="2" spacing id="time">
                Hvor lenge lagres opplysningene?
            </Heading>
            <BodyLong spacing>
                Stillingsannonser som er offentlig utlyst på arbeidsplassen.no er underlagt arkivplikt etter arkivloven
                §6 og ivaretas for ettertiden.
            </BodyLong>

            <Heading size="large" level="2" spacing id="legal">
                Hva er det rettslige grunnlaget for behandlingen av personopplysninger?
            </Heading>

            <Heading size="medium" level="3" spacing>
                Offentlig myndighetsutøvelse
            </Heading>
            <BodyLong spacing>
                NAV behandler personopplysninger for å utøve offentlig myndighet som følger av bestemmelser i NAV-loven
                og arbeidsmarkedsloven om arbeidsrettet oppfølging, se særlig NAV-loven § 4 og arbeidsmarkedsloven § 10.
                Det er også nødvendig å behandle personopplysningene til deg som representerer arbeidsgiver, for at NAV
                skal kunne oppfylle sin overordnede oppgave med å hjelpe å få jobbsøkere i arbeid.
            </BodyLong>
            <BodyLong>Eksempler på behandling basert på offentlig myndighetsutøvelse:</BodyLong>
            <ul className="mb-12">
                <li>
                    <BodyLong>Bistå arbeidsgivere med å skaffe arbeidskraft</BodyLong>
                </li>
                <li>
                    <BodyLong>Innhente informasjon om arbeidsmarkedet</BodyLong>
                </li>
                <li>
                    <BodyLong>Arbeidsformidling</BodyLong>
                </li>
            </ul>

            <Heading size="large" level="2" spacing id="who">
                Hvem deles opplysningene med?
            </Heading>

            <Heading size="medium" level="2" spacing>
                Brukere av arbeidsplassen.no
            </Heading>
            <BodyLong spacing>
                Stillingsannonser er åpent tilgjengelig for alle brukere av arbeidsplassen.no dersom det publiseres
                offentlig. Upubliserte opplysninger, slik som utkast til stillingsannonser, er kun tilgjengelig for de
                med tilgang i din virksomhet. Inaktive annonser er ikke synlige i søk, fortsetter å være tilgjengelige
                gjennom URL-lenker i en periode før de gjøres utilgjengelige.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                EURES-databasen
            </Heading>
            <BodyLong spacing>
                Stillingsannonser som publiseres på arbeidsplassen.no blir videresendt til EURES-databasen. EURES
                (European Employment Services) er et samarbeid mellom EU-kommisjonen og EU/EØS-området og Sveits. I
                Norge ligger EURES i NAV.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Åpne data
            </Heading>
            <BodyLong spacing>
                Aktive stillingsutlysninger er offentlig publiserte data som NAV igjen tilgjengeliggjør som åpne data i
                tråd med føringer for offentlig myndigheter. Dette gjøres gjennom Felles datakatalog som forvaltes av
                Digitaliseringsdirektoratet.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Våre databehandlere
            </Heading>
            <BodyLong className="mb-12">
                For å kunne tilby våre tjenester på arbeidsplassen.no benytter vi databehandlere, som innebærer at vi
                deler dine personopplysninger med disse. Dette gjelder for eksempel IT-leverandører som har avtaler med
                NAV. For å lese mer om dette, se{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering#chapter-4">
                    NAVs generelle personvernerklæring.
                </AkselLink>
            </BodyLong>

            <Heading size="large" level="2" spacing id="rights">
                Hvilke rettigheter har du?
            </Heading>

            <Heading size="medium" level="3" spacing>
                Rett til innsyn og retting
            </Heading>
            <BodyLong spacing>
                Du har rett til å få vite hvilke personopplysninger vi har om deg, hvor vi har hentet dem fra og be om
                retting av uriktige opplysninger. Personopplysninger knyttet til stillingsannonser vil kunne rettes i
                systemet opplysningene ble oppgitt i opprinnelig, enten det er et rekrutteringssystem eller direkte på
                arbeidsplassen.no. For innsyn i personopplysninger knyttet til deg som representant for arbeidsgiver, må
                du{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering#chapter-7">
                    ta kontakt med oss på nav.no.
                </AkselLink>
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Rett til å protestere og rett til sletting
            </Heading>
            <BodyLong spacing>
                Du har rett til å protestere mot at opplysningene dine behandles på arbeidsplassen.no. For å protestere,
                tar du kontakt med NAV. NAV vil da slutte å behandle opplysningene dine og eventuelt slette dem, med
                mindre det er tungtveiende grunner til at NAV likevel må behandle dem.
            </BodyLong>
            <BodyLong>
                I helt spesielle tilfeller vil du kunne ha rett til å få slettet opplysninger om deg. For at vi skal
                kunne slette personopplysninger om deg, forutsetter det at NAV ikke har en lovpålagt plikt etter
                arkivloven eller annen lovgivning til å lagre opplysningene.
            </BodyLong>
        </article>
    );
}
