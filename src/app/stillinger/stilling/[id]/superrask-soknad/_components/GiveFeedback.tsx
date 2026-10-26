import { BodyLong, Box, Heading, HStack, Show, VStack } from "@navikt/ds-react";
import FigureWithHeartAboveHead from "@/app/_common/components/FigureWithHeartAboveHead";
import SkyraSurvey from "@/app/_common/skyra/SkyraSurvey";

function GiveFeedback() {
    return (
        <Box
            background="neutral-soft"
            padding="space-24"
            borderRadius="12"
            as="section"
            aria-labelledby="give-feedback-heading"
        >
            <VStack align="start" gap="space-24">
                <HStack gap="space-8" wrap={false}>
                    <VStack>
                        <Heading id="give-feedback-heading" level="3" size="small" spacing>
                            Hva syntes du om Superrask søknad?
                        </Heading>
                        <VStack align="start" gap="space-8">
                            <BodyLong>
                                Vi setter stor pris på dine tilbakemeldinger dersom det er noe du savner eller noe du
                                synes kunne vært bedre med denne tjenesten.
                            </BodyLong>
                            <BodyLong>Det tar under ett minutt.</BodyLong>
                        </VStack>
                    </VStack>
                    <Show above="md">
                        <Box padding="space-8" flexShrink="0">
                            <FigureWithHeartAboveHead />
                        </Box>
                    </Show>
                </HStack>
                <SkyraSurvey
                    buttonVariant="secondary"
                    buttonText="Svar på noen kjappe spørsmål"
                    buttonSize="medium"
                    skyraSlug="arbeids-og-velferdsetaten-nav/tilbakemelding-superrask-soknad-jobbsoker"
                />
            </VStack>
        </Box>
    );
}

export default GiveFeedback;
