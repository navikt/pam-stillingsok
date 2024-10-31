import React, { ReactElement } from "react";
import { BodyShort, Box, HStack, ReadMore } from "@navikt/ds-react";

type Explanation = {
    description: string;
    value: number;
    details: Explanation[];
};

interface ExplainItemProps {
    explanation: Explanation;
}

function ExplainItem({ explanation }: ExplainItemProps): ReactElement {
    const { description, value } = explanation;
    let color: string = "surface-subtle";

    if (explanation.description.startsWith("weight")) {
        if (value < 0) {
            color = "surface-danger-subtle";
        } else if (value === 0) {
            color = "surface-subtle";
        } else if (value < 1) {
            color = "surface-warning-subtle";
        } else if (value >= 1) {
            color = "surface-success-subtle";
        }
    }

    return (
        <HStack align="center" gap="1" wrap={false}>
            <Box background={color} paddingBlock="05" paddingInline="2" borderRadius="small">
                <BodyShort textColor="subtle" size="small" className="monospace">
                    {Math.abs(value) % 1 > 0 ? value.toFixed(2) : value}
                </BodyShort>
            </Box>
            {description}
        </HStack>
    );
}

interface DebugExplainProps {
    explanation: Explanation;
}

export default function DebugExplain({ explanation }: DebugExplainProps): ReactElement {
    return (
        <Box paddingBlock="05">
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
                <Box paddingInline="6 0">
                    <ExplainItem explanation={explanation} />
                </Box>
            )}
        </Box>
    );
}
