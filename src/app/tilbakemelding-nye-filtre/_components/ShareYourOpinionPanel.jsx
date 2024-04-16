import React, { useContext } from "react";
import { Bleed, BodyLong, BodyShort, Box, Button, Heading, HStack } from "@navikt/ds-react";
import { XMarkIcon } from "@navikt/aksel-icons";
import Link from "next/link";
import { UserPreferencesContext } from "@/app/_common/user/UserPreferenceProvider";

function ShareYourOpinionPanel() {
    const { dismissPanel, dismissedPanels } = useContext(UserPreferencesContext);

    function dismiss() {
        dismissPanel("new-filters-survey");
    }

    if (dismissedPanels.includes("new-filters-survey")) {
        return null;
    }

    return (
        <Box padding={{ xs: "4", md: "6" }} background="surface-alt-2-subtle" borderRadius="small" className="mb-4">
            <HStack justify="space-between" align="start" wrap={false}>
                <Heading level="2" size="small" className="mb-05">
                    Del din mening!
                </Heading>
                <Bleed marginBlock="1 0" marginInline="0 1" asChild>
                    <Button
                        aria-label="Lukk"
                        size="small"
                        variant="tertiary-neutral"
                        onClick={dismiss}
                        icon={<XMarkIcon aria-label="Lukk" width="1em" height="1em" />}
                    />
                </Bleed>
            </HStack>
            <BodyShort className="mb-4">
                Vi utforsker nye filtre og vil gjere høre fra deg før vi går videre med forslagene.
            </BodyShort>

            <BodyLong>
                <Button variant="secondary" as={Link} href="/tilbakemelding-nye-filtre">
                    Vis nye filterforslag
                </Button>
            </BodyLong>
        </Box>
    );
}

export default ShareYourOpinionPanel;
