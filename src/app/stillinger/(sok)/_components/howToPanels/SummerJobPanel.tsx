import { BodyLong, Box, Heading, HStack } from "@navikt/ds-react";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import FigureHoldingFlowerAlt from "@/features/ung/ui/FigureHoldingFlowerAlt";

function SummerJobPanel() {
    return (
        <Box padding={{ xs: "space-16", md: "space-24" }} borderRadius="8" className="bg-brand-peach-subtle">
            <HStack gap="space-24" align="center" wrap={false}>
                <FigureHoldingFlowerAlt />
                <div>
                    <Heading level="3" size="small" className="mb-1">
                        Skal du søke sommerjobb?
                    </Heading>

                    <BodyLong>
                        Se våre{" "}
                        <AkselNextLink
                            inlineText
                            data-color="neutral"
                            href="/ung/artikler/5-tips-til-deg-som-skal-soke-sommerjobb"
                        >
                            5 tips til deg som skal søke sommerjobb
                        </AkselNextLink>
                    </BodyLong>
                </div>
            </HStack>
        </Box>
    );
}

export default SummerJobPanel;
