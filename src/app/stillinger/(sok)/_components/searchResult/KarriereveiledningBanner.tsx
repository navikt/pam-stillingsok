import React, { ReactElement } from "react";
import { BodyShort, Box, Heading, HGrid, HStack } from "@navikt/ds-react";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";
import FigureConfused from "@/app/_common/components/FigureConfused";
import { SOKERESULTAT_KLIKK_KARRIEREVEILEDNING } from "@/app/_common/umami/constants";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

export default function KarriereveiledningBanner(): ReactElement {
    return (
        <Box
            padding={{ xs: "4", md: "6" }}
            borderRadius="small"
            background="surface-alt-3-subtle"
            data-nosnippet="true"
        >
            <HGrid gap="4" columns={{ xs: 1, sm: "repeat(2, minmax(0, auto))" }} align="center">
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
