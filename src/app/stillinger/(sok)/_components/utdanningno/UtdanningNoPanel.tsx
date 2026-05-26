import { BodyLong, Box, Heading, HStack } from "@navikt/ds-react";
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
            <HStack gap="space-24" align="center" wrap={false}>
                <FigureConfused />
                <div>
                    <Heading level="3" size="small" className="mb-1">
                        Fant du ikke noe som fristet?
                    </Heading>

                    <BodyLong>
                        <AkselNextLink
                            inlineText
                            data-color="neutral"
                            onClick={() => {
                                track(SOKERESULTAT_KLIKK_UTDANNING_NO);
                            }}
                            rel="external"
                            href="https://utdanning.no/interessesiden/yrker/"
                        >
                            Utforsk yrker på utdanning.no
                        </AkselNextLink>
                        {" eller "}
                        <AkselNextLink
                            inlineText
                            data-color="neutral"
                            onClick={() => {
                                track(SOKERESULTAT_KLIKK_KARRIEREVEILEDNING);
                            }}
                            rel="external"
                            href="https://karriereveiledning.no/karrierevalg/fa-forslag-til-jobber?tema=1289"
                        >
                            få forslag til ledige stillinger på karriereveiledning.no
                        </AkselNextLink>{" "}
                    </BodyLong>
                </div>
            </HStack>
        </Box>
    );
}

export default UtdanningNoPanel;
