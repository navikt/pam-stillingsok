import { BodyLong, Heading, Link as AkselLink } from "@navikt/ds-react";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import NextLink from "next/link";

export default function PersonvernIkkeUnderOppfolging() {
    return (
        <article className="container-small mt-5 mb-24">
            <AkselLink as={NextLink} href="/personvern" className="mb-8">
                <ChevronLeftIcon aria-hidden="true" />
                Til personvernserklæring
            </AkselLink>
            <Heading size="xlarge" level="1" spacing>
                Personvernerklæring for deg som ikke er under arbeidsrettet oppfølging fra NAV
            </Heading>
            <BodyLong>Publisert 1. februar 2022.</BodyLong>
            <BodyLong className="mb-8">Oppdatert 29. juni 2022.</BodyLong>

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

            <Heading size="medium" level="3" spacing>
                Profil
            </Heading>
            <BodyLong>
                Når du tar i bruk innloggede tjenester på arbeidsplassen.no, innhenter vi grunnleggende personalia fra
                folkeregisteret:
            </BodyLong>
            <ul>
                <li>
                    <BodyLong>Navn</BodyLong>
                </li>
                <li>
                    <BodyLong>Telefonnummer</BodyLong>
                </li>
                <li>
                    <BodyLong>E-postadresse</BodyLong>
                </li>
                <li>
                    <BodyLong>Bostedsadresse</BodyLong>
                </li>
            </ul>
            <BodyLong spacing>
                Disse opplysningene er nødvendige for at vi skal kunne opprette en profil for deg. Dersom du ikke ønsker
                at vi behandler disse opplysningene, vil vi ikke kunne opprette en profil. Du kan redigere opplysningene
                vi har om deg, men det vil ikke påvirke dine registrerte data i folkeregisteret.
            </BodyLong>
            <BodyLong>
                Dersom du velger å ta i bruk øvrige tjenester på innloggede sider, vil vi lagre de nødvendige
                opplysningene for å bruke tjenesten i din profil. Dette kan for eksempel være:
            </BodyLong>
            <ul>
                <li>
                    <BodyLong>Favoritter – stillinger</BodyLong>
                </li>
                <li>
                    <BodyLong>Lagrede søk – stillinger</BodyLong>
                </li>
            </ul>
            <BodyLong spacing>Du kan slette disse opplysningene når du selv ønsker.</BodyLong>
            <BodyLong spacing>
                Mens du er innlogget vil innloggingsinformasjon du avgir oppbevares i en informasjonskapsel, som gjør at
                du forblir innlogget hele tiden mens du er inne på våre sider.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                CV-opplysninger
            </Heading>
            <BodyLong spacing>Du kan registrere følgende CV-opplysninger i vår CV-tjeneste:</BodyLong>
            <ul>
                <li>
                    <BodyLong>Sammendrag</BodyLong>
                </li>
                <li>
                    <BodyLong>Jobbønsker</BodyLong>
                </li>
                <li>
                    <BodyLong>Utdanninger</BodyLong>
                </li>
                <li>
                    <BodyLong>Fagbrev</BodyLong>
                </li>
                <li>
                    <BodyLong>Språk</BodyLong>
                </li>
                <li>
                    <BodyLong>Kompetanser</BodyLong>
                </li>
                <li>
                    <BodyLong>Arbeidserfaringer</BodyLong>
                </li>
                <li>
                    <BodyLong>Andre erfaringer</BodyLong>
                </li>
                <li>
                    <BodyLong>Offentlge godkjenninger</BodyLong>
                </li>
                <li>
                    <BodyLong>Andre godkjenninger</BodyLong>
                </li>
                <li>
                    <BodyLong>Førerkort</BodyLong>
                </li>
                <li>
                    <BodyLong>Kurs</BodyLong>
                </li>
            </ul>
            <BodyLong spacing>Du kan når som helst endre eller slette opplysningene i din CV.</BodyLong>

            <Heading size="large" level="2" spacing id="goals">
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
                Profilering og tilpasset innhold
            </Heading>
            <BodyLong spacing>
                Dersom du selv har samtykket til det, vil du kunne motta innhold som er tilpasset deg, basert på
                personopplysningene vi samler inn på arbeidsplassen.no. Dette vil for eksempel kunne være forslag om
                jobber som kan være relevant for deg.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Statistikk og kunnskap om arbeidsmarkedet
            </Heading>
            <BodyLong className="mb-12">
                NAV benytter opplysningene fra arbeidsplassen.no til å utvikle statistikk og kunnskap om
                arbeidsmarkedet. Les mer i{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering#chapter-3">
                    NAVs generelle personvernerklæring.
                </AkselLink>
            </BodyLong>

            <Heading size="large" level="2" spacing id="time">
                Hvor lenge lagres opplysningene?
            </Heading>
            <BodyLong spacing>
                Opplysningene vi trenger for at du skal kunne ha en profil på arbeidsplassen.no, lagres inntil du
                sletter profilen din hos oss. Opplysningene du gir fra deg ved bruk av de ulike tjenestene, lagres så
                lenge du har valgt å ta i bruk tjenesten på arbeidsplassen.no. Dersom du sletter opplysningene fra din
                profil, slettes også dataene hos oss. NAV behandler også opplysninger for statistikkformål. Statistikken
                kan i noen tilfeller inneholde personopplysninger.
            </BodyLong>
            <BodyLong className="mb-12">
                Din profil og alle opplysninger tilknyttet deg slettes automatisk etter 1 år. Du får et varsel om dette
                før opplysningene slettes, slik at du har mulighet til å fornye samtykke, og beholde opplysningene et år
                til.
            </BodyLong>

            <Heading size="large" level="2" spacing id="legal">
                Hva er det rettslige grunnlaget for behandlingen av personopplysninger?
            </Heading>

            <Heading size="medium" level="3" spacing>
                Samtykke
            </Heading>
            <BodyLong className="mb-12">
                Når du tar i bruk og legger informasjon inn på innloggede tjenester på arbeidsplassen.no, samtykker du
                til at vi kan behandle personopplysninger om deg. Du kan selv velge hvilke tjenester du vil samtykke til
                at vi behandler personopplysninger for, herunder deling av CV med arbeidsgivere og med den Europeiske
                Jobbmobilitetsportalen. Du kan når som helst trekke ditt samtykke.
            </BodyLong>

            <Heading size="large" level="2" spacing id="who">
                Hvem deles opplysningene med?
            </Heading>

            <Heading size="medium" level="3" spacing>
                CV-deling med den Europeiske Jobbmobilitetsportalen
            </Heading>
            <BodyLong spacing>
                Dersom du ønsker kan du dele CV-en din med arbeidsgivere nasjonalt eller i EU/EØS og Sveits, gjennom den
                den Europeiske Jobbmobilitetsportalen (EURES-portalen). EURES er også behandlingsansvarlig ved slik
                deling. Mer informasjon om denne behandlingen finner du i tjenesten før du eventuelt samtykker til å
                dele din CV.
            </BodyLong>
            <BodyLong spacing>
                Du velger selv ut hva fra CV-en din som du ønsker å dele med den Europeiske jobbmobilitetsportalen. Du
                kan når som helst endre eller slette hva du deler.
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
                Du har rett til å få vite hvilke personopplysninger vi har om deg og be om retting av uriktige
                opplysninger. Du kan logge deg inn på Min side på arbeidsplassen.no for å se mange av opplysningene vi
                har registrert om deg. For innsyn i personopplysninger ut over dette, må du{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering#chapter-7">
                    ta kontakt med oss på nav.no.
                </AkselLink>
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Rett til å trekke tilbake samtykke og sletting
            </Heading>
            <BodyLong spacing>
                Når du har samtykket til en behandling, kan du til enhver tid trekke tilbake dine samtykker. Dette gjør
                du ved gå til «innstillinger». Der kan du administrere dine samtykker, og slette dem om du ønsker.
            </BodyLong>
            <BodyLong spacing>
                Du kan også velge «slett min profil». Da vil alle opplysninger du har på arbeidsplassen.no slettes.
            </BodyLong>
            <BodyLong spacing>
                Du kan også slette eller endre opplysninger enkeltvis inne i de ulike tjenestene som CV og stillingssøk.
            </BodyLong>
            <BodyLong spacing>
                Hver 6. måned vil vi sende deg en e-post for å minne deg på at du har opplysninger lagret på
                arbeidsplassen.no, hva som er status på dine opplysninger, og informasjon om hvordan du kan endre eller
                slette dine opplysninger.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Rett til dataportabilitet
            </Heading>
            <BodyLong spacing>
                Du har rett til å be oss om å overføre opplysninger om deg til deg eller en annen behandlingsansvarlig.
                Dette innebærer en rett til å få utlevert i et maskinlesbart og vanlig brukt filformat dersom du ønsker
                dette. Formålet med dette er at du skal kunne gjenbruke disse opplysningene hos en annen
                behandlingsansvarlig, dersom du ønsker.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Rett til begrensning av behandlingen
            </Heading>
            <BodyLong>
                Du har rett til å be om at NAV midlertidig stopper behandlingen av dine opplysninger, dersom du mener at
                opplysningene vi har om deg er feil eller du mener at vår behandling av opplysningene er ulovlig. Det
                samme gjelder dersom du mener at vi ikke trenger opplysningene.
            </BodyLong>
        </article>
    );
}
