import React, { useState } from "react";
import { BodyLong, Heading, HStack, Panel, VStack } from "@navikt/ds-react";
import { FeedbackButton } from "@navikt/arbeidsplassen-react";
import { FaceFrownIcon, FaceIcon, FaceSmileIcon } from "@navikt/aksel-icons";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";
import { KLIKK_MIN_SIDE_FEEDBACK } from "@/app/_common/umami/constants";

function Feedback() {
    const [hasAnswered, setHasAnswered] = useState(false);

    const trackAnswer = () => {
        setHasAnswered(true);
    };

    return (
        <Panel className="mb-9">
            <VStack gap="2" justify="center">
                <Heading size="small" level="2" className="text-center" id="survey-title">
                    I hvilken grad opplever du at våre tjenester hjelper deg som jobbsøker?
                </Heading>

                {hasAnswered ? (
                    <BodyLong className="text-center bold">Takk for tilbakemeldingen!</BodyLong>
                ) : (
                    <HStack gap="2" justify="center">
                        <FeedbackButton
                            ariaDescribedby="survey-title"
                            onClick={() => {
                                trackAnswer("Mye");
                                umamiTracking(KLIKK_MIN_SIDE_FEEDBACK, {
                                    value: "Mye",
                                });
                            }}
                            icon={<FaceSmileIcon aria-hidden="true" width="1.5em" height="1.5em" />}
                        >
                            Mye
                        </FeedbackButton>
                        <FeedbackButton
                            ariaDescribedby="survey-title"
                            onClick={() => {
                                trackAnswer("Lite");
                                umamiTracking(KLIKK_MIN_SIDE_FEEDBACK, {
                                    value: "Lite",
                                });
                            }}
                            icon={<FaceFrownIcon aria-hidden="true" width="1.5em" height="1.5em" />}
                        >
                            Lite
                        </FeedbackButton>
                        <FeedbackButton
                            ariaDescribedby="survey-title"
                            onClick={() => {
                                trackAnswer("Vet ikke");
                                umamiTracking(KLIKK_MIN_SIDE_FEEDBACK, {
                                    value: "Vet ikke",
                                });
                            }}
                            icon={<FaceIcon aria-hidden="true" width="1.5em" height="1.5em" />}
                        >
                            Vet ikke
                        </FeedbackButton>
                    </HStack>
                )}
            </VStack>
        </Panel>
    );
}

export default Feedback;
