import React, { useState } from "react";
import { BodyLong, Heading, Panel, Link as AkselLink } from "@navikt/ds-react";
import "./Feedback.css";
import logAmplitudeEvent from "../../../../common/tracking/amplitude";
import { FaceFrownIcon, FaceIcon, FaceSmileIcon, HeartIcon } from "@navikt/aksel-icons";

function Feedback() {
    const [hasGivenRating, setHasGiverRating] = useState(false);

    function Option({ emoji, text }) {
        return (
            <button
                type="button"
                className="Feedback__option"
                onClick={() => {
                    logAmplitudeEvent("rate new layout", {
                        rating: text
                    });
                    setHasGiverRating(true);
                }}
            >
                <div className="Feedback__emoji">{emoji}</div>
                <div>{text}</div>
            </button>
        );
    }

    return (
        <Panel className="arb-panel mt-2">
            <Heading level="2" size="medium" spacing>
                Hva synes du om søketjenesten?
            </Heading>
            {!hasGivenRating ? (
                <div className="Feedback__options">
                    <Option text="Dårlig" emoji={<FaceFrownIcon aria-hidden="true" />} />
                    <Option text="Nøytral" emoji={<FaceIcon aria-hidden="true" />} />
                    <Option text="Bra" emoji={<FaceSmileIcon aria-hidden="true" />} />
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

export default Feedback;
