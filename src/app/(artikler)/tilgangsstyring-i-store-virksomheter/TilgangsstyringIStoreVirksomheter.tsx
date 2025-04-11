import { Alert, BodyLong, BodyShort, Heading, Link as AkselLink } from "@navikt/ds-react";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import NextLink from "next/link";

export default function TilgangsstyringIStoreVirksomheter() {
    return (
        <article className="container-small mt-5 mb-24">
            <AkselLink as={NextLink} href="/arbeidsgivertjenester" className="mb-8">
                <ChevronLeftIcon aria-hidden="true" />
                <BodyShort>Tilbake</BodyShort>
            </AkselLink>
            <Heading spacing size="xlarge" level="1">
                Tilgangsstyring i store virksomheter
            </Heading>
            <BodyLong spacing>
                Her tilbyr vi informasjon til store virksomheter om hvordan tilgangsstyring kan håndteres på ulike
                måter. Formålet vårt er å vise hvordan du gir og får tilgang til Navs rekrutteringstjenester.
            </BodyLong>
            <BodyLong>Du finner svar på spørsmål om</BodyLong>
            <ul>
                <li>
                    <BodyLong>tilgangsstyring i store virksomheter</BodyLong>
                </li>
                <li>
                    <BodyLong>overordnede roller som gir vide tilganger</BodyLong>
                </li>
                <li>
                    <BodyLong>å få tilgang til arbeidsplassen.no og kandidatlister fra Nav</BodyLong>
                </li>
            </ul>
            <BodyLong spacing>Lurer du fortsatt på noe, kan du ringe Altinn brukerstøtte på 75 00 60 00.</BodyLong>
            <Alert variant="info" className="mb-12">
                <BodyLong>
                    For at du eller en kollega skal kunne benytte Navs rekrutteringstjeneste på vegne av virksomheten,
                    må dere ha enkeltrettigheten Rekruttering, eller Altinn-rolle Lønn og personalmedarbeider, eller
                    Altinn-rolle Utfyller/Innsender. Tilgangene kan gis på for hovedenhet (inkludert alle underenheter)
                    eller for en enkelt underenhet. Arbeidsgiver kan delegere tilgang til deg via Altinn, hvis du ikke
                    har den allerede.
                </BodyLong>
            </Alert>

            <Heading spacing size="large" level="2">
                Generelt om tilgangsstyring
            </Heading>

            <Heading size="medium" level="3" spacing>
                Hvorfor kan tilgangsstyring være krevende?
            </Heading>
            <BodyLong spacing>
                Virksomheter kan ha utfordringer med å håndtere tilgangsstyring, spesielt når organisasjonen er stor og
                kompleks. Ansatte kan oppleve at det er vanskelig å finne ut hvem i organisasjonen som kan gi tilgang.
                Det er stor avstand mellom de som skal ha tilgang og de som har myndighet til å delegere.
            </BodyLong>
            <BodyLong spacing>
                På samme måte kan de som har myndighet til å delegere oppleve det som krevende å holde oversikt over
                medarbeidere og hvilke tilganger de har eller skal ha.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Virksomheten min har virksomhetssertifikat, kan vi bruke det på arbeidsplassen.no?
            </Heading>
            <BodyLong spacing>
                Nei, dette sertifikatet kan ikke brukes. Tilgang til arbeidsplassen.no og kandidatlister fra Nav på Min
                side Arbeidsgiver kan bare gis i Altinn.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Tilgang til hele eller deler av organisasjonen?
            </Heading>
            <BodyLong spacing>
                Tilgangsstyringen på arbeidsplassen.no og kandidatlister fra Nav er basert på underenhet. Arbeidsgivere
                som gir tilgang, velger i Altinn om tilgangen skal være begrenset til en eller flere underenheter, eller
                omfatte hovedenheten inkludert alle underenheter. Det er altså ikke nødvendig å gi personer tilgang til
                hele organisasjonen.
            </BodyLong>
            <BodyLong spacing>
                Hvis det er ønskelig at en medarbeider skal ha tilgang til alle underenheter, er det praktisk for den
                som gir tilgang å kunne gi én tilgang til hovedenhet, som automatisk gir tilgang for alle underenheter.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Hvordan løser vi rollestyring på en praktisk måte i vår virksomhet?
            </Heading>
            <BodyLong spacing>
                De fleste store og etablerte virksomheter vet at det kan være upraktisk at daglig leder eller eier
                administrerer tilgangsstyring i Altinn. Ofte er denne oppgaven delegert til mellomledere eller HR. Det
                finnes noen praktiske måter å løse det på ved hjelp av rollene Tilgangsstyring og eventuelt
                Hovedadministrator. Se beskrivelser under.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Overordnede roller med vide tilganger
            </Heading>
            <Heading size="medium" level="3" spacing>
                Hvordan fungerer rollen Tilgangsstyring?
            </Heading>
            <BodyLong spacing>
                En praktisk måte å organisere tilgangsstyring på, er å tildele en eller flere medarbeidere rollen
                Tilgangsstyring. Denne rollen kan tildele rettigheter i organisasjonen. Merk at en person som skal ha
                rollen Tilgangsstyring, selv må ha de rollene/rettighetene hen skal administrere. En tilgangsstyrer må
                derfor ha enkeltrettigheten Rekruttering og/eller rollene Lønn og personalmedarbeider eller Utfyller/
                Innsender, for å kunne gi andre den samme rettigheten som vil gi tilgang som arbeidsgiver til
                arbeidsplassen.no og kandidatlister fra Nav.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Hvordan fungerer rollen Hovedadministrator?
            </Heading>
            <BodyLong spacing>
                Hvis virksomheten ønsker at én nøkkelperson skal administrere alle Altinn-rettigheter på vegne av
                virksomheten, er løsningen rollen Hovedadministrator. Daglig leder, styrets leder, bestyrende reder
                eller innehaver kan etablere denne rollen.
            </BodyLong>
            <BodyLong spacing>
                Hovedadministrator kan delegere alle roller og rettigheter for en virksomhet, også roller og rettigheter
                som hovedadministratoren ikke har selv. Hovedadministrator kan derfor både gi og trekke
                enkeltrettigheten Rekruttering, eller de to rollene som gir tilgang til arbeidsplassen.no (Lønn og
                personalmedarbeider og Utfyller/innsender).
            </BodyLong>
            <BodyLong spacing>
                Hovedadministrator kan også gi en eller flere medarbeidere rollen Tilgangsstyring. Hovedadministrator
                inntar da en overordnet rolle, og tilgangsstyrere administrerer roller og rettigheter, for eksempel
                enkeltrettigheten Rekruttering.
            </BodyLong>
            <BodyLong spacing>
                Les mer om{" "}
                <AkselLink href="https://www.altinn.no/hjelp/profil/roller-og-rettigheter/">
                    Altinn-roller og rettigheter på altinn.no
                </AkselLink>
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                I vår virksomhet har vi egendefinerte roller. Kan jeg bruke dem på arbeidsplassen.no?
            </Heading>
            <BodyLong spacing>
                Hvis virksomheten organiserer sine tilganger i egendefinerte roller i Altinn, kan man inkludere
                enkeltrettigheten Rekruttering i en egendefinert rolle.
            </BodyLong>
            <Heading size="large" level="2" spacing>
                Jeg ønsker tilgang til arbeidsplassen.no
            </Heading>
            <Heading size="medium" level="3" spacing>
                Hvordan kan jeg vite om jeg allerede har tilgang til arbeidsplassen.no?
            </Heading>
            <BodyLong spacing>
                Du kan se hvilke tilganger du har når du er innlogget i Altinn. Du kan også forsøke å logge inn som
                arbeidsgiver på arbeidsplassen.no. Har du ikke tilgang, så får du en melding om det.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Hvem kan jeg spørre om tilgang til arbeidsplassen.no?
            </Heading>
            <BodyLong>
                Noen i ledelsen eller HR kan gi deg tilgang. Hvis du ikke vet hvem det kan være, så kan du “be om
                tilgang” i Altinn eller på nav.no. Denne funksjonen er det foreløpig kun de som allerede har en
                Altinn-rolle fra før i virksomheten som kan benytte. Når du ber om tilgang, vil rett person få en
                melding på e-post eller SMS. Velg et av alternativene:
            </BodyLong>
            <ul>
                <li>
                    <BodyLong>
                        Det kan gjøres på altinn.no. Les om hvordan du kan{" "}
                        <AkselLink href="https://www.altinn.no/hjelp/profil/sporre-om-rettighet/">
                            spørre om rettighet på Altinn.no
                        </AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Gå til nav.no, som har litt flere støttefunksjoner for deg. På{" "}
                        <AkselLink href="https://arbeidsgiver.nav.no/min-side-arbeidsgiver/">
                            Min side - arbeidsgiver
                        </AkselLink>
                        finner du oversikt over roller eller enkeltrettigheter som ulike Nav-tjenester krever. Når du er
                        logget inn vil du finne mulighet for å “be om tilgang”.
                    </BodyLong>
                </li>
            </ul>
            <BodyLong spacing>
                Hvis du ikke har mulighet til å be om tilgang som beskrevet, må du selv finne ut hvem i HR eller
                ledelsen som kan gi deg tilgang.
            </BodyLong>
            <Heading size="large" level="2" spacing>
                Jeg skal gi tilgang til Arbeidsplassen
            </Heading>
            <Heading size="medium" level="3" spacing>
                Har jeg allerede riktig rolle for å gi tilgang til Arbeidsplassen?
            </Heading>
            <BodyLong>Logg inn i Altinn, da vil du se hvilke Altinn-tilganger du har.</BodyLong>
            <ul>
                <li>
                    <BodyLong>
                        Hvis du er registrert i Enhetsregisteret som daglig leder, styrets leder, bestyrende reder eller
                        innehaver, vil du automatisk ha alle tilganger som du kan gi videre til andre.{" "}
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Har du rollen Hovedadministrator, kan du gi andre medarbeidere de tilgangene de trenger.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Har du rollen Tilgangsstyrer, kan du gi andre medarbeidere de tilgangene de trenger, forutsatt
                        at du selv har de rettighetene du skal tildele til andre (enkeltrettigheten Rekruttering, eller
                        Altinn-rolle Lønn og personalmedarbeider, eller Altinn-rolle Utfyller/innsender).{" "}
                    </BodyLong>
                </li>
            </ul>
            <BodyLong spacing>
                Hvis du ikke har de nødvendige rollene for å kunne gi tilgang videre, kan daglig leder eller
                hovedadministrator i virksomheten din gi deg nødvendige tilganger.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Bør jeg delegere tilgang til arbeidsplassen.no gjennom rolle eller enkeltrettighet?
            </Heading>
            <BodyLong spacing>
                Enkeltrettigheten Rekruttering er tilstrekkelig, hvis du som arbeidsgiver kun ønsker å gi tilgang til
                Navs rekrutteringstjenester. Da kan du som arbeidsgiver vite at en medarbeider ikke får tilgang til
                andre tjenester. Hvis du tildeler rollen Lønn og personalmedarbeider eller Utfyller/Innsender, er det
                vide tilganger som gir tilgang til flere tjenester enn bare arbeidsplassen.no og kandidatlister fra Nav.
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Jeg er usikker på hva Rekruttering gir tilgang til?
            </Heading>
            <BodyLong spacing>
                Enkeltrettigheten Rekruttering gir kun tilgang til Navs rekrutteringstjenester på arbeidsplassen.no og
                kandidatlister tilsendt fra Nav. Tildeler du enkeltrettigheten Rekruttering, kan du være sikker på at du
                ikke gir tilgang til andre tjenester enn Navs rekrutteringstjenester. Les om
                <AkselLink href="https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/rekruttering/">
                    enkeltrettigheten Rekruttering på altinn.no
                </AkselLink>
            </BodyLong>
            <Heading size="medium" level="3" spacing>
                Hvordan kan jeg holde oversikt over hvem som har tilganger i Altinn?
            </Heading>
            <BodyLong spacing>
                Alle som har roller i virksomheten, kan gå inn på Altinn og se hvilke medarbeidere som har roller og
                enkeltrettigheter, og hvilke roller og enkeltrettigheter de har.
            </BodyLong>
        </article>
    );
}
