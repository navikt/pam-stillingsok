import { BodyLong, Heading, LocalAlert, VStack } from "@navikt/ds-react";
import { LocalAlertContent, LocalAlertHeader, LocalAlertTitle } from "@navikt/ds-react/LocalAlert";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

type OnboardingDataErrorProps = Readonly<{
    title: string;
    message: string;
    headingLevel?: "1" | "2";
    backHref?: string;
    backLabel?: string;
}>;

export function OnboardingDataError({
    title,
    message,
    headingLevel = "1",
    backHref = "/ung",
    backLabel = "Tilbake til ung-sida",
}: OnboardingDataErrorProps) {
    return (
        <LocalAlert status="error">
            <LocalAlertHeader>
                {headingLevel === "1" ? (
                    <LocalAlertTitle as="div">
                        <Heading level="1" size="medium">
                            {title}
                        </Heading>
                    </LocalAlertTitle>
                ) : (
                    <LocalAlertTitle>{title}</LocalAlertTitle>
                )}
            </LocalAlertHeader>
            <LocalAlertContent>
                <VStack gap="space-16">
                    <BodyLong>{message}</BodyLong>
                    <AkselNextLink href={backHref}>{backLabel}</AkselNextLink>
                </VStack>
            </LocalAlertContent>
        </LocalAlert>
    );
}
