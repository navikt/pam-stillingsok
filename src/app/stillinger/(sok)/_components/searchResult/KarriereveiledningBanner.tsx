import React, { ReactElement } from "react";
import { BodyShort, Box, Heading, HGrid, HStack, Link as AkselLink } from "@navikt/ds-react";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";
import FigureConfused from "@/app/_common/components/FigureConfused";

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
                        Trenger du hjelp til å finne en jobb?
                    </Heading>

                    <BodyShort spacing>
                        På{" "}
                        <AkselLink
                            className="default-text-color-link"
                            onClick={() => {
                                umamiTracking("Søkeresultat klikk karriereveiledning");
                            }}
                            rel="external"
                            href="https://karriereveiledning.no/karrierevalg/verktoy-soke-jobb"
                        >
                            Karriereveiledning.no
                        </AkselLink>{" "}
                        finner du tips og verktøy til jobbsøking. Du kan også få gratis veiledning på chat, telefon og
                        e-post.
                    </BodyShort>
                </div>

                <HStack justify="center">
                    <FigureConfused />
                </HStack>
            </HGrid>
        </Box>
    );
}
