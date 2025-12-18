"use client";

import { BodyLong, Box, Heading, HGrid, Link } from "@navikt/ds-react";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import FigureEnteringDoor from "@/features/ung/ui/FigureEnteringDoor";
import { track } from "@/app/_common/umami";

function FinnJobbPanel() {
    return (
        <Link
            href="/stillinger?education=Ingen+krav&v=5&experience=Ingen"
            className="box-link full-width"
            onClick={() => {
                track("Ung - klikket lenke til stillingssøk");
            }}
        >
            <Box
                background="surface-alt-3-subtle"
                paddingBlock={{ xs: "8", md: "12" }}
                paddingInline={{ xs: "6", md: "10" }}
                borderRadius="xlarge"
                className="full-width"
            >
                <HGrid gap={{ xs: "6", lg: "12" }} columns={{ xs: "1", md: "auto 1fr", lg: "auto 1fr" }} align="center">
                    <FigureEnteringDoor />
                    <div>
                        <Heading spacing level="2" size="large">
                            Finn jobber som ikke krever erfaring
                        </Heading>
                        <BodyLong size="large" className="mb-4">
                            Allerede nå kan du finne stillinger uten krav til arbeidserfaring eller utdanning her.
                        </BodyLong>
                        <ArrowRightIcon aria-hidden="true" fontSize="2rem" />
                    </div>
                </HGrid>
            </Box>
        </Link>
    );
}
export default FinnJobbPanel;
