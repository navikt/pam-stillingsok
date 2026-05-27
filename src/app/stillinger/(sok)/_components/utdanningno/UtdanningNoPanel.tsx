import { BodyLong, Box, Heading, HGrid, HStack } from "@navikt/ds-react";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import FigureConfused from "@/app/_common/components/FigureConfused";
import { track } from "@/app/_common/umami";
import { SOKERESULTAT_KLIKK_KARRIEREVEILEDNING, SOKERESULTAT_KLIKK_UTDANNING_NO } from "@/app/_common/umami/constants";

function UtdanningNoPanel() {
    return (
        <Box
            padding={{ xs: "space-16", md: "space-24" }}
            borderRadius="8"
            className="bg-brand-peach-subtle"
            data-nosnippet="true"
        >
            <HGrid gap="space-24" columns={{ xs: 1, sm: "repeat(2, minmax(0, auto))" }} align="center">
                <div>
                    <Heading level="3" size="small" spacing>
                        Fant du ikke noe som fristet?
                    </Heading>

                    <BodyLong>
                        Utforsk hvilke{" "}
                        <AkselNextLink
                            inlineText
                            data-color="neutral"
                            onClick={() => {
                                track(SOKERESULTAT_KLIKK_UTDANNING_NO);
                            }}
                            rel="external"
                            href="https://utdanning.no/interessesiden/yrker/"
                        >
                            jobber som passer dine interesser på utdanning.no
                        </AkselNextLink>
                        {". På "}
                        <AkselNextLink
                            data-color="neutral"
                            onClick={() => {
                                track(SOKERESULTAT_KLIKK_KARRIEREVEILEDNING);
                            }}
                            rel="external"
                            href="https://karriereveiledning.no/karrierevalg/fa-forslag-til-jobber?tema=1289"
                        >
                            karriereveiledning.no
                        </AkselNextLink>{" "}
                        kan du finne jobber basert på din utdanning og erfaring.
                    </BodyLong>
                </div>

                <HStack justify="center">
                    <FigureConfused />
                </HStack>
            </HGrid>
        </Box>
    );
}

export default UtdanningNoPanel;
