import React, { useState } from "react";
import { BodyLong, BodyShort, Box, Button, Heading, HStack, Link as AkselLink } from "@navikt/ds-react";
import { XMarkIcon } from "@navikt/aksel-icons";
import logAmplitudeEvent from "../../../common/tracking/amplitude";

function HotjarSurvey() {
    const [isDismissed, setIsDismissed] = useState(() => {
        try {
            const found = sessionStorage.getItem(`feedback-hotjar-dismissed`);
            if (!found) {
                return false;
            }
            if (found === "true") {
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    });

    function dismiss() {
        setIsDismissed(true);
        try {
            sessionStorage.setItem("feedback-hotjar-dismissed", "true");
        } catch (e) {
            // ignore sessionStorage error
        }

        // Temporary amplitude event, code can be removed if it still
        // exists after november 2023
        try {
            logAmplitudeEvent("dismissed hotjar survey");
        } catch (err) {
            // ignore
        }
    }

    if (isDismissed) {
        return <div />;
    }

    return (
        <Box className="mb-12" padding={{ xs: "4", md: "6" }} background="surface-alt-2-subtle" borderRadius="small">
            <HStack justify="space-between" align="start" wrap={false}>
                <Heading level="2" size="small" spacing>
                    Hjelp oss med å forbedre jobbannonsene på arbeidsplassen.no
                </Heading>
                <Button
                    size="small"
                    variant="tertiary-neutral"
                    onClick={dismiss}
                    icon={<XMarkIcon aria-label="Lukk" width="1em" height="1em" />}
                />
            </HStack>
            <BodyShort spacing>
                Hva er viktig for deg når du leser annonser? Gi oss innspill ved å svare på noen korte spørsmål.
                Spørreundersøkelsen er på norsk og er anonym.
            </BodyShort>

            <BodyLong>
                <AkselLink href="https://surveys.hotjar.com/b74bff32-713a-4ce7-b87f-29e5580f750e">
                    Svar på noen korte spørsmål
                </AkselLink>
            </BodyLong>
        </Box>
    );
}

export default HotjarSurvey;
