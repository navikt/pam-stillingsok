import React, { useState } from "react";
import { BodyLong, BodyShort, Box, Button, Heading, HStack, Link as AkselLink } from "@navikt/ds-react";
import { XMarkIcon } from "@navikt/aksel-icons";

function HotjarSurvey() {
    const [isDismissed, setIsDismissed] = useState(async () => {
        try {
            const found = await sessionStorage.getItem(`feedback-hotjar-dismissed`);
            if (!found) {
                return false;
            }
            return found === "true";
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
    }

    if (isDismissed) {
        return <></>;
    }

    return (
        <Box
            className="mb-12"
            padding={{ xs: "4", md: "6" }}
            background="surface-alt-2-subtle"
            borderRadius="small"
            suppressHydrationWarning={true}
        >
            <HStack justify="space-between" align="start" wrap={false}>
                <Heading level="2" size="small" spacing>
                    Hjelp oss med å forbedre opplevelsen for deg som ser etter jobber
                </Heading>
                <Button
                    size="small"
                    variant="tertiary-neutral"
                    onClick={dismiss}
                    icon={<XMarkIcon aria-label="Lukk" width="1em" height="1em" />}
                />
            </HStack>
            <BodyShort spacing>
                Hva er viktig for deg når du ser etter jobber? Hva frustrerer deg mest? Gi oss innspill ved å svare på
                noen korte spørsmål. Spørreundersøkelsen er på norsk og er anonym.
            </BodyShort>

            <BodyLong>
                <AkselLink href="https://surveys.hotjar.com/11b59436-15fe-4b2c-b4c2-c6304c54dfb1">
                    Svar på noen korte spørsmål
                </AkselLink>
            </BodyLong>
        </Box>
    );
}

export default HotjarSurvey;
