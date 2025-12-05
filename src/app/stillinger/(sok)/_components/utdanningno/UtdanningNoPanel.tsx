import React from "react";
import { BodyShort, Box, Heading, HGrid, HStack } from "@navikt/ds-react";
import FigureConfused from "@/app/_common/components/FigureConfused";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";
import { SOKERESULTAT_KLIKK_UTDANNING_NO } from "@/app/_common/umami/constants";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

function UtdanningNoPanel() {
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
                        Fant du ikke noe som fristet?
                    </Heading>

                    <BodyShort spacing>
                        Utforsk hvilke{" "}
                        <AkselNextLink
                            className="default-text-color-link"
                            onClick={() => {
                                umamiTracking(SOKERESULTAT_KLIKK_UTDANNING_NO);
                            }}
                            rel="external"
                            href="https://utdanning.no/interessesiden/yrker/"
                        >
                            jobber som passer dine interesser på utdanning.no
                        </AkselNextLink>
                    </BodyShort>
                </div>

                <HStack justify="center">
                    <FigureConfused />
                </HStack>
            </HGrid>
        </Box>
    );
}

export default UtdanningNoPanel;
