import React, { useState } from "react";
import { BodyLong, Heading, Panel, Link as AkselLink, HStack } from "@navikt/ds-react";
import "./Feedback.css";
import { FaceSmileIcon, FaceFrownIcon } from "@navikt/aksel-icons";
import PropTypes from "prop-types";
import { FeedbackButton } from "@navikt/arbeidsplassen-react";
import logAmplitudeEvent from "../../../../common/tracking/amplitude";

function Option({ emoji, text, onClick }) {
    return (
        <button
            type="button"
            className="Feedback__option"
            onClick={() => {
                onClick(text);
            }}
        >
            <div className="Feedback__emoji">{emoji}</div>
            <div>{text}</div>
        </button>
    );
}

Option.propTypes = {
    emoji: PropTypes.node.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

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
        <Panel className="mt-8 text-center" id="feedback-panel">
            <Heading level="2" size="small" className="mb-2" id="feedback-panel-title">
                Synes du søketreffene er relevante?
            </Heading>
            {!hasGivenRating ? (
                <HStack justify="center" className="mb-2">
                    <div>
                        <FeedbackButton
                            onClick={onRatingClick}
                            aria-describedby="feedback-panel-title"
                            icon={<FaceSmileIcon aria-hidden="true" height="1.5rem" />}
                        >
                            Ja
                        </FeedbackButton>
                    </div>
                    <div>
                        <FeedbackButton
                            onClick={onRatingClick}
                            aria-describedby="feedback-panel-title"
                            icon={<FaceFrownIcon aria-hidden="true" height="1.5rem" />}
                        >
                            Nei
                        </FeedbackButton>
                    </div>
                </HStack>
            ) : (
                <BodyLong className="mt-4 mb-4 bold">Takk for tilbakemeldingen!</BodyLong>
            )}

            <BodyLong className="mb-2">
                Er det noe du savner eller synes kunne vært bedre, så vil vi gjerne høre det.
            </BodyLong>
            <BodyLong>
                <AkselLink href="https://surveys.hotjar.com/8eedca7e-3fae-4852-8d96-4c9c80424cdc">
                    Skriv en kort tilbakemelding
                </AkselLink>
            </BodyLong>
        </Panel>
    );
}

Feedback.propTypes = {
    query: PropTypes.shape({ q: PropTypes.string }).isRequired,
};

export default Feedback;
