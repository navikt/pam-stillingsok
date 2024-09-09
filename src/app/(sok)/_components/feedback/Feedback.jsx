import React, { useState } from "react";
import { BodyLong, Heading, HStack, Link as AkselLink, Panel, VStack } from "@navikt/ds-react";
import { FaceFrownIcon, FaceSmileIcon } from "@navikt/aksel-icons";
import { FeedbackButton } from "@navikt/arbeidsplassen-react";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";
import useSearchQuery from "@/app/(sok)/_components/SearchStateProvider";
import { SEARCH_STRING } from "@/app/(sok)/_components/searchParamNames";

function Feedback() {
    const [hasGivenRating, setHasGiverRating] = useState(false);
    const searchQuery = useSearchQuery();

    const onRatingClick = (text) => {
        try {
            logAmplitudeEvent("rate search result relevance", {
                rating: text,
                hasSearchString: searchQuery.has(SEARCH_STRING),
            });
        } catch (err) {
            // ignore
        }
        setHasGiverRating(true);
    };

    return (
        <Panel className="text-center" id="feedback-panel">
            <VStack gap="2">
                <Heading level="2" size="small" id="feedback-panel-title">
                    Synes du søketreffene er relevante?
                </Heading>
                {!hasGivenRating ? (
                    <HStack justify="center" gap="2">
                        <FeedbackButton
                            onClick={() => onRatingClick("Ja")}
                            aria-describedby="feedback-panel-title"
                            icon={<FaceSmileIcon aria-hidden="true" fontSize="1.5rem" />}
                        >
                            Ja
                        </FeedbackButton>
                        <FeedbackButton
                            onClick={() => onRatingClick("Nei")}
                            aria-describedby="feedback-panel-title"
                            icon={<FaceFrownIcon aria-hidden="true" fontSize="1.5rem" />}
                        >
                            Nei
                        </FeedbackButton>
                    </HStack>
                ) : (
                    <BodyLong weight="semibold">Takk for tilbakemeldingen!</BodyLong>
                )}

                <BodyLong>Er det noe du savner eller synes kunne vært bedre, så vil vi gjerne høre det.</BodyLong>

                <BodyLong>
                    <AkselLink href="https://surveys.hotjar.com/8eedca7e-3fae-4852-8d96-4c9c80424cdc">
                        Skriv en kort tilbakemelding
                    </AkselLink>
                </BodyLong>
            </VStack>
        </Panel>
    );
}

export default Feedback;
