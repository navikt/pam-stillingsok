import React, { useState } from "react";
import { BodyLong, Heading, Panel, Link as AkselLink, HStack, VStack } from "@navikt/ds-react";
import "./Feedback.css";
import { FaceSmileIcon, FaceFrownIcon } from "@navikt/aksel-icons";
import PropTypes from "prop-types";
import { FeedbackButton } from "@navikt/arbeidsplassen-react";
import logAmplitudeEvent from "../../../../common/tracking/amplitude";

function Feedback({ query }) {
    const [hasGivenRating, setHasGiverRating] = useState(false);

    const onRatingClick = (text) => {
        try {
            logAmplitudeEvent("rate search result relevance", {
                rating: text,
                hasSearchString: query.q !== undefined && query.q.length > 0,
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
                            onClick={onRatingClick}
                            aria-describedby="feedback-panel-title"
                            icon={<FaceSmileIcon aria-hidden="true" height="1.5rem" width="1.5rem" />}
                        >
                            Ja
                        </FeedbackButton>
                        <FeedbackButton
                            onClick={onRatingClick}
                            aria-describedby="feedback-panel-title"
                            icon={<FaceFrownIcon aria-hidden="true" height="1.5rem" width="1.5rem" />}
                        >
                            Nei
                        </FeedbackButton>
                    </HStack>
                ) : (
                    <BodyLong className="bold">Takk for tilbakemeldingen!</BodyLong>
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

Feedback.propTypes = {
    query: PropTypes.shape({ q: PropTypes.string }).isRequired,
};

export default Feedback;
