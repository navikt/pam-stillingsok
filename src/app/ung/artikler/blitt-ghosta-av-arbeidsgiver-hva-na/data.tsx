import { ReactNode } from "react";
import { BodyShort, Link } from "@navikt/ds-react";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

export const tipsList: { title: string; description: ReactNode; id: string }[] = [
    {
        id: "5-tips-sommerjobb-1",
        title: "Send en hyggelig melding til arbeidsgiver og spør om en oppdatering.",
        description: (
            <>
                <BodyShort spacing>Et eksempel kan være:</BodyShort>
                <BodyShort spacing>
                    “Hei! Jeg søkte nylig på stillingen som [stillingstittel] hos dere, og ville bare høre om det er
                    noen oppdatering. Jeg er fortsatt veldig interessert i jobben.{" "}
                </BodyShort>
                <BodyShort spacing>Jeg ser frem til å høre fra dere!</BodyShort>
                <BodyShort>
                    Vennlig hilsen
                    <br />
                    [Navnet ditt]”
                </BodyShort>
            </>
        ),
    },
    {
        id: "5-tips-sommerjobb-2",
        title: "Søk andre stillinger mens du venter på svar",
        description: (
            <>
                <BodyShort spacing>
                    Sjekk ut flere stillinger{" "}
                    <AkselNextLink href="/stillinger?experience=Ingen&v=5">her.</AkselNextLink>
                </BodyShort>
                <BodyShort>
                    Det finnes også flere andre steder du kan se etter jobb. Sjekk tips for alternative steder du kan
                    <Link href="https://karriereveiledning.no/karrierevalg/6-steder-du-kan-lete-etter-jobb?tema=1289">
                        lete etter jobb på karriereveiledning.no
                    </Link>
                </BodyShort>
            </>
        ),
    },
    {
        id: "5-tips-sommerjobb-3",
        title: "Bruk ventetiden smart",
        description: (
            <>
                <BodyShort spacing>
                    Google deg selv og sjekk profiler du har i sosiale medier og jobbportaler, oppdater CV og vurder
                    frivillig arbeid eller ta kurs. Sjekk ut frivillige jobber på frivillig.no.
                </BodyShort>
                <BodyShort>
                    For andre jobbsøkertips se <Link href="https://www.nav.no/soker-jobb">her.</Link>
                </BodyShort>
            </>
        ),
    },
    {
        id: "5-tips-sommerjobb-4",
        title: "Forbered deg til intervju",
        description: (
            <>
                Øv deg på intervjuspørsmål på <Link href="karriereveiledning.no">karriereveiledning.no</Link>
            </>
        ),
    },
];
