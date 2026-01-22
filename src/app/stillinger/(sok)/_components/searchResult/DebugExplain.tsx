import React, { ReactElement } from "react";
import { BodyShort, Box, BoxProps, HStack, ReadMore } from "@navikt/ds-react";
import { type StillingSoekResponseExplanation } from "@/server/schemas/stillingSearchSchema";

interface ExplainItemProps {
    explanation: StillingSoekResponseExplanation;
}

function ExplainItem({ explanation }: ExplainItemProps): ReactElement {
    const { description, value } = explanation;
    let color: NonNullable<BoxProps["background"]> = "neutral-soft";

    if (explanation.description.startsWith("weight")) {
        if (value < 0) {
            color = "danger-soft";
        } else if (value === 0) {
            color = "neutral-soft";
        } else if (value < 1) {
            color = "warning-soft";
        } else if (value >= 1) {
            color = "success-soft";
        }
    }

    return (
        <HStack align="center" gap="space-4" wrap={false}>
            <Box background={color} paddingBlock="space-2" paddingInline="space-8" borderRadius="2">
                <BodyShort textColor="subtle" size="small" className="monospace">
                    {Math.abs(value) % 1 > 0 ? value.toFixed(2) : value}
                </BodyShort>
            </Box>
            {description}
        </HStack>
    );
}

interface DebugExplainProps {
    explanation: StillingSoekResponseExplanation;
}

export default function DebugExplain({ explanation }: DebugExplainProps): ReactElement {
    return (
        <Box paddingBlock="space-2">
            {explanation.details.length > 0 ? (
                <ReadMore
                    size="small"
                    header={<ExplainItem explanation={explanation} />}
                    defaultOpen={["sum of", "max"].some((string) => explanation.description.startsWith(string))}
                >
                    {explanation.details.length > 0 &&
                        explanation.details.map((it) => <DebugExplain explanation={it} key={it.description} />)}
                </ReadMore>
            ) : (
                <Box paddingInline="space-24 space-0">
                    <ExplainItem explanation={explanation} />
                </Box>
            )}
        </Box>
    );
}
