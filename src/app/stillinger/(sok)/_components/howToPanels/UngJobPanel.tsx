import { BodyLong, Box, Heading, HStack } from "@navikt/ds-react";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import FigureEnteringDoorAlt from "@/features/ung/ui/FigureEnteringDoorAlt";

function UngJobPanel() {
    return (
        <Box padding={{ xs: "space-16", md: "space-24" }} borderRadius="8" className="bg-brand-peach-subtle">
            <HStack gap="space-24" align="center" wrap={false}>
                <div>
                    <FigureEnteringDoorAlt />
                </div>
                <div>
                    <Heading level="3" size="small" className="mb-1">
                        Er du ung og vil jobbe?
                    </Heading>

                    <BodyLong>
                        Leter du etter din første jobb?{" "}
                        <AkselNextLink inlineText data-color="neutral" href="/ung">
                            Her finner du tips som gjør det enklere å søke.
                        </AkselNextLink>
                    </BodyLong>
                </div>
            </HStack>
        </Box>
    );
}

export default UngJobPanel;
