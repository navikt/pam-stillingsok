import { BodyLong, Heading, Link as AkselLink } from "@navikt/ds-react";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import NextLink from "next/link";

export default function PersonvernUnderOppfolging() {
    return (
        <article className="container-small mt-5 mb-24">
            <AkselLink as={NextLink} href="/personvern" className="mb-8">
                <ChevronLeftIcon aria-hidden="true" />
                Til personvernserklæring
            </AkselLink>
            <Heading size="xlarge" level="1" spacing>
                Personvernerklæring for deg som er under arbeidsrettet oppfølging fra NAV
            </Heading>
            <BodyLong>Publisert 1. februar 2022.</BodyLong>
            <BodyLong spacing>Oppdatert 29. juni 2022.</BodyLong>
            <BodyLong className="mb-8">
                <em>Oppfølging</em> betyr veiledning og hjelp fra NAV til å skaffe ny jobb eller beholde jobben. Dette
                får du dersom du har registrert deg som arbeidssøker hos NAV.
            </BodyLong>

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
                Statistikk og kunnskap om arbeidsmarkedet
            </Heading>
            <BodyLong spacing>
                NAV benytter opplysningene fra arbeidsplassen.no til å utvikle statistikk og kunnskap om
                arbeidsmarkedet. Les mer i{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering#chapter-3">
                    NAVs personvernerklæring.
                </AkselLink>
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Arbeidsrettet oppfølging fra NAV
            </Heading>
            <BodyLong className="mb-12">
                NAV behandler personopplysningene til deg som er under arbeidsrettet oppfølging fra NAV, for å kunne
                hjelpe deg å komme i arbeid raskere. Dette er i tråd med de lovpålagte oppgavene vi har. Opplysningene
                du oppgir i din CV kan brukes som en del av envurdering av dine rettigheter til tjenester og ytelser fra
                NAV, Dette omfatter arbeidsformidling, vurdering av ditt bistandsbehov, arbeidsevne og rett til
                dagpenger. Les mer i{" "}
                <AkselLink href="https://www.nav.no/personvernerklaering#chapter-3">
                    NAVs personvernerklæring.
                </AkselLink>
            </BodyLong>

            <Heading size="large" level="2" spacing id="time">
                Hvor lenge lagres opplysningene?
            </Heading>
            <BodyLong className="mb-12">
                Opplysningene oppbevares og behandles så lenge du er under oppfølging av NAV. CV-opplysningene du har
                oppgitt kan brukes som et grunnlag for vurdering av dine rettigheter til tjenester og ytelser fra NAV.
                Se <AkselLink href="https://www.nav.no/personvernerklaering#hvilke">NAVs personvernerklæring</AkselLink>{" "}
                for informasjon om slik behandling. NAV har en lovpålagt plikt til å oppbevare opplysningene i CV også
                etter at saksbehandlingen er avsluttet jf. Arkivloven § 6.
            </BodyLong>

            <Heading size="large" level="2" spacing id="legal">
                Hva er det rettslige grunnlaget for behandlingen av personopplysninger?
            </Heading>
            <BodyLong className="mb-12">
                Utøvelse av offentlig myndighet, jf. NAV-loven § 4 og arbeidsmarkedsloven § 10 NAV behandler
                personopplysninger for å utøve offentlig myndighet som følger av bestemmelser i NAV-loven og
                arbeidsmarkedsloven om arbeidsrettet oppfølging
            </BodyLong>

            <Heading size="large" level="2" spacing id="who">
                Hvem deles opplysningene med?
            </Heading>

            <Heading size="medium" level="3" spacing>
                Arbeidsgivere på arbeidsplassen.no
            </Heading>
            <BodyLong spacing>
                Dersom NAV-medarbeidere finner en relevant stilling for deg, kan de spørre deg om de kan dele din CV med
                denne arbeidsgiveren. Personopplysningene deles ikke med arbeidsgiveren før du godtar dette, og du kan
                kontakte NAV når som helst for å be om at opplysningene ikke lenger deles med arbeidsgiveren.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                CV-deling med den Europeiske Jobbmobilitetsportalen
            </Heading>
            <BodyLong spacing>
                Dersom du ønsker kan du dele CV-en din med arbeidsgivere nasjonalt eller i EU/EØS og Sveits, gjennom den
                den Europeiske Jobbmobilitetsportalen (EURES-portalen). EURES er også behandlingsansvarlig ved slik
                deling.
            </BodyLong>
            <BodyLong spacing>
                Du velger selv hvilke opplysninger fra CV-en din som du ønsker å dele med den Europeiske
                jobbmobilitetsportalen. Du kan når som helst endre eller slette hva du deler.
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
                Rett til å protestere og rett til sletting
            </Heading>
            <BodyLong spacing>
                Du har rett til å protestere mot at opplysningene dine behandles på arbeidsplassen.no. For å protestere,
                tar du kontakt med NAV. NAV vil da slutte å behandle opplysningene dine og eventuelt slette dem, med
                mindre det er tungtveiende grunner til at NAV likevel må behandle dem.
            </BodyLong>
            <BodyLong spacing>
                I helt spesielle tilfeller vil du kunne ha rett til å få slettet opplysninger om deg. For at vi skal
                kunne slette personopplysninger om deg, forutsetter det at NAV ikke har en lovpålagt plikt etter
                arkivloven eller annen lovgivning til å lagre opplysningene.
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
