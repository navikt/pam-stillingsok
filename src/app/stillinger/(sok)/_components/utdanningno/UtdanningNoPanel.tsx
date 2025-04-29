import React from "react";
import { BodyShort, Box, Heading, HGrid, HStack, Link as AkselLink } from "@navikt/ds-react";
import FigureConfused from "@/app/_common/components/FigureConfused";

function UtdanningNoPanel() {
    return (
        <Box padding={{ xs: "4", md: "6" }} borderRadius="small" background="surface-alt-3-subtle">
            <HGrid gap="4" columns={{ xs: 1, sm: "repeat(2, minmax(0, auto))" }} align="center">
                <div>
                    <Heading level="3" size="small" spacing>
                        Fant du ikke noe som fristet?
                    </Heading>

                    <BodyShort spacing>
                        Utforsk hvilke{" "}
                        <AkselLink
                            className="default-text-color-link"
                            // data-umami-event="Søkeresultat klikk utdanning.no"
                            href="https://utdanning.no/interessesiden/yrker/"
                        >
                            jobber som passer dine interesser på utdanning.no
                        </AkselLink>
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
