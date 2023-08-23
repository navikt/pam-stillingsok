import React, { useState } from "react";
import { BodyLong, Heading, Panel, Link as AkselLink } from "@navikt/ds-react";
import "./Feedback.css";
import { ThumbUpIcon, ThumbDownIcon } from "@navikt/aksel-icons";
import PropTypes from "prop-types";
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
        <Panel className="arb-panel-tertiary mt-2 text-center">
            <Heading level="2" size="small" spacing>
                Synes du søketreffene er relevante?
            </Heading>
            {!hasGivenRating ? (
                <div className="Feedback__options">
                    <Option text="Ja" onClick={onRatingClick} emoji={<ThumbUpIcon aria-hidden="true" />} />
                    <Option text="Nei" onClick={onRatingClick} emoji={<ThumbDownIcon aria-hidden="true" />} />
                </div>
            ) : (
                <BodyLong className="mt-1 mb-1 bold">Takk for tilbakemeldingen!</BodyLong>
            )}

            <BodyLong className="mb-0_5">
                Er noe du savner eller noe du synes kunne vært bedre, så vil vi gjerne høre det.
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
