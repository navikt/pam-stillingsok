import { ReactNode } from "react";
import { BodyLong, Link } from "@navikt/ds-react";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

export const tipsList: { title: string; description: ReactNode; id: string }[] = [
    {
        id: "tips-ghosting-1",
        title: "Send en hyggelig melding til arbeidsgiver og spør om en oppdatering",
        description: (
            <>
                <BodyLong className="mb-2">Et eksempel kan være:</BodyLong>
                <BodyLong className="mb-2">
                    “Hei! Jeg søkte nylig på stillingen som [stillingstittel] hos dere, og ville bare høre om det er
                    noen oppdatering. Jeg er fortsatt veldig interessert i jobben.{" "}
                </BodyLong>
                <BodyLong className="mb-2">Jeg ser frem til å høre fra dere!</BodyLong>
                <BodyLong>
                    Vennlig hilsen
                    <br />
                    [Navnet ditt]”
                </BodyLong>
            </>
        ),
    },
    {
        id: "tips-ghosting-2",
        title: "Søk andre stillinger mens du venter på svar",
        description: (
            <>
                <BodyLong className="mb-2">
                    <AkselNextLink href="/stillinger?experience=Ingen&v=5">
                        Sjekk ut flere stillinger her.
                    </AkselNextLink>
                </BodyLong>
                <BodyLong>
                    Det finnes også flere andre steder du kan se etter jobb. Sjekk tips for alternative steder du kan{" "}
                    <Link
                        inlineText
                        href="https://karriereveiledning.no/karrierevalg/6-steder-du-kan-lete-etter-jobb?tema=1289"
                    >
                        lete etter jobb på karriereveiledning.no
                    </Link>
                </BodyLong>
            </>
        ),
    },
    {
        id: "tips-ghosting-3",
        title: "Bruk ventetiden smart",
        description: (
            <>
                <BodyLong className="mb-2">
                    Google deg selv og sjekk profiler du har i sosiale medier og jobbportaler, oppdater CV og vurder
                    frivillig arbeid eller ta kurs. Sjekk ut frivillige jobber på frivillig.no.
                </BodyLong>
                <BodyLong>
                    For andre jobbsøkertips, se{" "}
                    <Link href="https://www.nav.no/soker-jobb">jobbsøkertips på nav.no.</Link>
                </BodyLong>
            </>
        ),
    },
    {
        id: "tips-ghosting-4",
        title: "Forbered deg til intervju",
        description: (
            <BodyLong>
                Øv deg på intervjuspørsmål på{" "}
                <Link href="https://karriereveiledning.no/karrierevalg/ov-deg-pa-intervjusporsmal?tema=1289">
                    karriereveiledning.no
                </Link>
            </BodyLong>
        ),
    },
];
