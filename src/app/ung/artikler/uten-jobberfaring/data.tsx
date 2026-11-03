import { BodyLong } from "@navikt/ds-react";
import type { ReactNode } from "react";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

export const tipsList: { title: string; description: ReactNode; id: string }[] = [
    {
        id: "uten-jobberfaring-rad-1",
        title: "Let der jobbene faktisk er",
        description: (
            <BodyLong>
                Sjekk jobbportaler som arbeidsplassen.no og finn.no jevnlig. Nye stillinger legges ut hver dag. Si også
                ifra til familie og venner at du er på jobbjakt.
            </BodyLong>
        ),
    },
    {
        id: "uten-jobberfaring-rad-2",
        title: "Er du under 18?",
        description: (
            <BodyLong>
                Bruk filteret «under 18 år». På arbeidsplassen.no kan du filtrere jobbene slik at du lettere finner
                stillinger som passer for deg.
            </BodyLong>
        ),
    },
    {
        id: "uten-jobberfaring-rad-3",
        title: "Prøv superrask søknad",
        description: (
            <BodyLong>
                Noen stillinger på arbeidsplassen.no har{" "}
                <AkselNextLink href="/ung/artikler/superrask-soknad-sok-pa-jobben" inlineText>
                    superrask søknad
                </AkselNextLink>
                . Da kan du søke enkelt uten å bruke masse tid på lange søknader.
            </BodyLong>
        ),
    },
    {
        id: "uten-jobberfaring-rad-4",
        title: "Du har mer erfaring enn du tror ",
        description: (
            <BodyLong>
                Idrett, fritidsaktiviteter, frivillig arbeid, barnepass eller andre ansvar du har hatt kan også være
                erfaring som arbeidsgivere setter pris på.{" "}
            </BodyLong>
        ),
    },
    {
        id: "uten-jobberfaring-rad-5",
        title: "Ikke vær redd for å ta kontakt  ",
        description: "",
    },
];
