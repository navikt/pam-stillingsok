import React from "react";
import { BodyShort, Box, Heading, HGrid, HStack } from "@navikt/ds-react";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";
import FigureConfused from "@/app/_common/components/FigureConfused";
import { SOKERESULTAT_KLIKK_KARRIEREVEILEDNING } from "@/app/_common/umami/constants";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

export default function KarriereveiledningBanner() {
    return (
        <Box
            padding={{ xs: "space-16", md: "space-32" }}
            borderRadius="2"
            className="bg-brand-peach-subtle"
            data-nosnippet="true"
        >
            <HGrid gap="space-16" columns={{ xs: 1, sm: "repeat(2, minmax(0, auto))" }} align="center">
                <div>
                    <Heading level="3" size="small" spacing>
                        Trenger du forslag til jobb?
                    </Heading>

                    <BodyShort spacing>
                        På{" "}
                        <AkselNextLink
                            className="default-text-color-link"
                            onClick={() => {
                                umamiTracking(SOKERESULTAT_KLIKK_KARRIEREVEILEDNING);
                            }}
                            rel="external"
                            href="https://karriereveiledning.no/karrierevalg/fa-forslag-til-jobber?tema=1289"
                        >
                            Karriereveiledning.no
                        </AkselNextLink>{" "}
                        kan du finne jobber basert på din utdanning og erfaring.
                    </BodyShort>
                </div>

                <HStack justify="center">
                    <FigureConfused />
                </HStack>
            </HGrid>
        </Box>
    );
}
