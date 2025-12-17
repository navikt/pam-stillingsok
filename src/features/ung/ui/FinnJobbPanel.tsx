"use client";

import { BodyLong, Box, Heading, HGrid, Link } from "@navikt/ds-react";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import FigureEnteringDoor from "@/features/ung/ui/FigureEnteringDoor";

function FinnJobbPanel() {
    return (
        <Link href="/stillinger?education=Ingen+krav&v=5&experience=Ingen" className="box-link full-width">
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
                            Finn din første jobb
                        </Heading>
                        <BodyLong size="large" className="mb-4">
                            Ingen jobberfaring? Ingen problem. Finn din dør inn til arbeidslivet!
                        </BodyLong>
                        <ArrowRightIcon aria-hidden="true" fontSize="2rem" />
                    </div>
                </HGrid>
            </Box>
        </Link>
    );
}
export default FinnJobbPanel;
