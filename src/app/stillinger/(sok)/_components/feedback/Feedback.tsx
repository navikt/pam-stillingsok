import React, { useState } from "react";
import { BodyLong, Box, Heading, HStack, VStack } from "@navikt/ds-react";
import { FaceFrownIcon, FaceSmileIcon } from "@navikt/aksel-icons";
import { FeedbackButton } from "@navikt/arbeidsplassen-react";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { logSearch } from "@/app/stillinger/_common/monitoring/search-logging";
import { parseSearchParams } from "@/app/stillinger/(sok)/_utils/parseSearchParams";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";
import { RELEVANTE_SOKETREFF } from "@/app/_common/umami/constants";
import SkyraSurvey from "@/app/_common/skyra/SkyraSurvey";
import { trackSearchRating } from "@/features/metrics/metricsActions";

export default function Feedback() {
    const [hasGivenRating, setHasGiverRating] = useState<boolean>(false);
    const query = useQuery();

    const onRatingClick = (text: string): void => {
        try {
            logSearch(text, parseSearchParams(query.urlSearchParams));
        } catch {
            // ignore
        }
        setHasGiverRating(true);
    };

    return (
        <Box padding="space-16" className="text-center" id="feedback-panel">
            <VStack gap="space-8">
                <Heading level="2" size="small" id="feedback-panel-title">
                    Synes du søketreffene er relevante?
                </Heading>
                {!hasGivenRating ? (
                    <HStack justify="center" gap="space-8">
                        <FeedbackButton
                            ariaDescribedby="feedback-panel-title"
                            icon={<FaceSmileIcon aria-hidden="true" fontSize="1.5rem" />}
                            onClick={() => {
                                onRatingClick("Ja");
                                trackSearchRating("Ja").then();
                                umamiTracking(RELEVANTE_SOKETREFF, {
                                    value: "Ja",
                                });
                            }}
                        >
                            Ja
                        </FeedbackButton>
                        <FeedbackButton
                            ariaDescribedby="feedback-panel-title"
                            icon={<FaceFrownIcon aria-hidden="true" fontSize="1.5rem" />}
                            onClick={() => {
                                onRatingClick("Nei");
                                trackSearchRating("Nei").then();
                                umamiTracking(RELEVANTE_SOKETREFF, {
                                    value: "Nei",
                                });
                            }}
                        >
                            Nei
                        </FeedbackButton>
                    </HStack>
                ) : (
                    <BodyLong weight="semibold">Takk for tilbakemeldingen!</BodyLong>
                )}

                <BodyLong spacing>
                    Er det noe du savner eller synes kunne vært bedre, så vil vi gjerne høre det.
                </BodyLong>
            </VStack>

            <SkyraSurvey
                buttonText="Skriv en kort tilbakemelding"
                skyraSlug="arbeids-og-velferdsetaten-nav/test-arbeidsplassen-dev"
            />
        </Box>
    );
}
