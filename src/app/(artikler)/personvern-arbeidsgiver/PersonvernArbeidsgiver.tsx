import { BodyLong, BodyShort, Heading, Link as AkselLink } from "@navikt/ds-react";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import NextLink from "next/link";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";

type Props = {
    readonly meta: PageInfo;
};
export default function PersonvernArbeidsgiver({ meta }: Props) {
    return (
        <article lang={meta.language !== "nb" ? meta.language : undefined} className="container-small mt-5 mb-24">
            <AkselLink as={NextLink} href="/personvern" className="mb-8">
                <ChevronLeftIcon aria-hidden="true" />
                <BodyShort>Til personvernserklæring</BodyShort>
            </AkselLink>
            <Heading size="xlarge" level="1" spacing>
                {meta.title}
            </Heading>
            <BodyLong className="mb-8">Sist endra 1. februar 2022</BodyLong>

            <Heading size="large" level="2" spacing>
                Innhald
            </Heading>
            <ul aria-label="Innhold på siden" className="mb-12">
                <li>
                    <BodyLong>
                        <AkselLink href="#information">Hvilke personopplysningar samlar vi inn?</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#goals">Kva formål blir personopplysningane brukte til?</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#time">Kor lenge blir opplysningane lagra?</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#legal">
                            Kva er det rettslege grunnlaget for behandlinga av personopplysningar?
                        </AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#who">Kven blir opplysningane delte med?</AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <AkselLink href="#rights">Kva rettar har du?</AkselLink>
                    </BodyLong>
                </li>
            </ul>

            <Heading size="large" level="2" spacing id="information">
                Kva personopplysningar samlar vi inn?
            </Heading>
            <BodyLong spacing>
                Medan du er innlogga vil innloggingsinformasjon du gir oppbevarast i ein informasjonskapsel, som gjer at
                du held fram med å vere innlogga heile tida medan du er inne på sidene våre.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Stillingsannonsar
            </Heading>
            <BodyLong spacing>
                Vi behandlar stillingsannonsar som verksemda har publisert på arbeidsplassen.no, under dette
                personopplysningar du har oppgitt i desse, til dømes namn og kontaktinformasjon. Dette inkluderer
                stillingar sendt inn via rekrutteringssystem vi samarbeider med. Annonserer du stillingane dine i aviser
                tilknytt Amedia eller Polaris media blir dei automatisk overførte og viste på arbeidsplassen.no.
                Annonsane blir arkiverte og anonymiserte opplysningar blir brukte til statistiske formål.
            </BodyLong>
            <BodyLong spacing>
                Arbeidsgivarar kan ikkje krevje noka form for avgift eller anna vederlag frå arbeidssøkjarar for tilbod
                om tilsetjing.
            </BodyLong>

            <Heading className="mb-8" size="large" level="2" id="goals">
                Kva formål blir personopplysningane brukte til?
            </Heading>
            <Heading size="medium" level="3" spacing>
                Velfungerande arbeidsmarknad
            </Heading>
            <BodyLong spacing>
                Arbeidsplassen.no skal bidra ein velfungerande arbeidsmarknad gjennom ei open plattform for
                arbeidsmarknaden. Vi lagrar og behandlar personopplysningar for å gjere det enklare for jobbsøkjarar å
                finne jobb og for arbeidsgivarar å skaffe arbeidskraft. Dette er i tråd med Navs samfunnsoppdrag om å få
                fleire i arbeid.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Statistikk og kunnskap om arbeidsmarknaden
            </Heading>
            <BodyLong className="mb-12">
                Nav nyttar opplysningane frå arbeidsplassen.no til å utvikle statistikk og kunnskap om arbeidsmarknaden.
                Les meir i{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering#chapter-3">
                    Navs personvernerklæring.
                </AkselLink>
            </BodyLong>

            <Heading size="large" level="2" spacing id="time">
                Kor lenge blir opplysningane lagra?
            </Heading>
            <BodyLong spacing>
                Stillingsannonsar som er offentleg kunngjorde på arbeidsplassen.no er underlagde arkivplikt etter
                arkivlova §6 og blir varetekne for ettertida.
            </BodyLong>

            <Heading size="large" level="2" spacing id="legal">
                Kva er det rettslege grunnlaget for behandlinga av personopplysningar?
            </Heading>

            <Heading size="medium" level="3" spacing>
                Offentleg styresmaktsutøving
            </Heading>
            <BodyLong spacing>
                Nav behandlar personopplysningar for å utøve offentleg styresmakt som følgjer av føresegner i Nav-loven
                og arbeidsmarknadslova om arbeidsretta oppfølging, sjå særleg Nav-loven § 4 og arbeidsmarkedsloven § 10.
                Det er også nødvendig å behandle personopplysningane til deg som representerer arbeidsgivar, for at Nav
                skal kunne oppfylle den overordna oppgåva si med å hjelpe å få jobbsøkjarar i arbeid.
            </BodyLong>
            <BodyLong>Døme på behandling basert på offentleg styresmaktsutøving:</BodyLong>
            <ul aria-label="Eksempler på behandling basert på offentlig myndighetsutøvelse" className="mb-12">
                <li>
                    <BodyLong>Hjelpe arbeidsgivarar med å skaffe arbeidskraft</BodyLong>
                </li>
                <li>
                    <BodyLong>Innhente informasjon om arbeidsmarknaden</BodyLong>
                </li>
                <li>
                    <BodyLong>Arbeidsformidling</BodyLong>
                </li>
            </ul>

            <Heading size="large" level="2" spacing id="who">
                Kven blir opplysningane delte med?
            </Heading>

            <Heading size="medium" level="2" spacing>
                Brukarar av arbeidsplassen.no
            </Heading>
            <BodyLong spacing>
                Stillingsannonser er ope tilgjengeleg for alle brukarar av arbeidsplassen.no dersom det blir offentleg
                publisert. Upubliserte opplysningar, slik som utkast til stillingsannonsar, er berre tilgjengeleg for
                dei med tilgang i verksemda di. Inaktive annonsar er ikkje synlege i søk, held fram med å vere
                tilgjengelege gjennom URL-lenkjer i ein periode før dei blir gjorde utilgjengelege.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                EURES-databasen
            </Heading>
            <BodyLong spacing>
                Stillingsannonser som blir publisert på arbeidsplassen.no blir vidaresendt til EURES-databasen. EURES
                (European Employment Services) er eit samarbeid mellom EU-kommisjonen og EU/EØS-området og Sveits. I
                Noreg ligg EURES i Nav.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Opne data
            </Heading>
            <BodyLong spacing>
                Aktive stillingsutlysingar er offentleg publiserte data som Nav igjen tilgjengeleggjer som opne data i
                tråd med føringar for offentleg styresmakter. Dette blir gjort gjennom Felles datakatalog som blir
                forvalta av Digitaliseringsdirektoratet.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Databehandlarane våre
            </Heading>
            <BodyLong className="mb-12">
                For å kunne tilby våre tenester på arbeidsplassen.no nyttar vi databehandlarar, som inneber at vi deler
                personopplysningane dine med desse. Dette gjeld til dømes IT-leverandørar som har avtalar med Nav. For å
                lese meir om dette, sjå{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering#chapter-4">
                    Navs generelle personvernerklæring.
                </AkselLink>
            </BodyLong>

            <Heading size="large" level="2" spacing id="rights">
                Kva rettar har du?
            </Heading>

            <Heading size="medium" level="3" spacing>
                Rett til innsyn og retting
            </Heading>
            <BodyLong spacing>
                Du har rett til å få vite kva personopplysningar vi har om deg, kvar vi har henta dei frå og be om
                retting av feilaktige opplysningar. Personopplysningar knytte til stillingsannonsar kan rettast i
                systemet opplysningane vart oppgitt i opphavleg, anten det er eit rekrutteringssystem eller direkte på
                arbeidsplassen.no. For innsyn i personopplysningar knytte til deg som representant for arbeidsgivar, må
                du{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering#chapter-7">
                    ta kontakt med oss på Nav.no.
                </AkselLink>
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Rett til å protestere og rett til sletting
            </Heading>
            <BodyLong spacing>
                Du har rett til å protestere mot at opplysningane dine blir behandla på arbeidsplassen.no. For å
                protestere, tek du kontakt med Nav. Nav vil då slutte å behandle opplysningane dine og eventuelt slette
                dei, med mindre det er tungtvegande grunnar til at Nav likevel må behandle dei.
            </BodyLong>
            <BodyLong>
                I heilt spesielle tilfelle vil du kunne ha rett til å få sletta opplysningar om deg. For at vi skal
                kunne slette personopplysningar om deg, føreset det at Nav ikkje har ei lovpålagd plikt etter arkivlova
                eller anna lovgiving til å lagre opplysningane.
            </BodyLong>
        </article>
    );
}
