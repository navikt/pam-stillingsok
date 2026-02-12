import React from "react";
import { Box, ExpansionCard, Heading, Hide, Show, Stack, VStack } from "@navikt/ds-react";
import { LocationPinIcon } from "@navikt/aksel-icons";

type WrapperProps = {
    readonly children: React.ReactNode;
    readonly headerText: string;
    readonly defaultOpen?: boolean;
};
function SommerjobbStedVelgerWrapper({ children, headerText, defaultOpen = false }: WrapperProps) {
    return (
        <>
            <Show below="md">
                <ExpansionCard aria-label={headerText} defaultOpen={defaultOpen}>
                    <ExpansionCard.Header>
                        <ExpansionCard.Title as="h2" size="small">
                            <Stack as="span" wrap={false} gap={{ xs: "space-8", sm: "space-16" }} align="center">
                                <LocationPinIcon aria-hidden fontSize="2rem" />
                                {headerText}
                            </Stack>
                        </ExpansionCard.Title>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>{children}</ExpansionCard.Content>
                </ExpansionCard>
            </Show>
            <Hide below="md">
                <VStack align="center">
                    <Heading align="center" level="2" size="small" className="mb-4">
                        {headerText}
                    </Heading>
                    <Box maxWidth={{ md: "340px" }} width="100%">
                        {children}
                    </Box>
                </VStack>
            </Hide>
        </>
    );
}

export default SommerjobbStedVelgerWrapper;
