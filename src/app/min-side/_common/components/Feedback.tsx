import React, { useState } from "react";
import { BodyLong, Heading, HStack, Panel, VStack } from "@navikt/ds-react";
import { FeedbackButton } from "@navikt/arbeidsplassen-react";
import { FaceFrownIcon, FaceIcon, FaceSmileIcon } from "@navikt/aksel-icons";
import { track } from "@/app/_common/umami";

function Feedback() {
    const [hasAnswered, setHasAnswered] = useState(false);

    const trackAnswer = (answer: "Mye" | "Lite" | "Vet ikke") => {
        setHasAnswered(true);
        track("Klikk min side feedback", { value: answer, location: "min_side" });
    };

    return (
        <Panel className="mb-9">
            <VStack gap="space-8" justify="center">
                <Heading size="small" level="2" className="text-center" id="survey-title">
                    I hvilken grad opplever du at våre tjenester hjelper deg som jobbsøker?
                </Heading>

                {hasAnswered ? (
                    <BodyLong className="text-center bold">Takk for tilbakemeldingen!</BodyLong>
                ) : (
                    <HStack gap="space-8" justify="center">
                        <FeedbackButton
                            ariaDescribedby="survey-title"
                            onClick={() => {
                                trackAnswer("Mye");
                            }}
                            icon={<FaceSmileIcon aria-hidden="true" width="1.5em" height="1.5em" />}
                        >
                            Mye
                        </FeedbackButton>
                        <FeedbackButton
                            ariaDescribedby="survey-title"
                            onClick={() => {
                                trackAnswer("Lite");
                            }}
                            icon={<FaceFrownIcon aria-hidden="true" width="1.5em" height="1.5em" />}
                        >
                            Lite
                        </FeedbackButton>
                        <FeedbackButton
                            ariaDescribedby="survey-title"
                            onClick={() => {
                                trackAnswer("Vet ikke");
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
