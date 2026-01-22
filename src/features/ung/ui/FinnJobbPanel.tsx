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
                paddingBlock={{ xs: "space-32", md: "space-48" }}
                paddingInline={{ xs: "space-24", md: "space-40" }}
                borderRadius="12"
                className="full-width bg-brand-peach-subtle"
            >
                <HGrid
                    gap={{ xs: "space-24", lg: "space-48" }}
                    columns={{ xs: "space-4", sm: "auto 1fr" }}
                    align="center"
                >
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
