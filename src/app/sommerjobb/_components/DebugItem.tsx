import React, { ReactElement } from "react";
import { BodyShort, Box, HStack } from "@navikt/ds-react";
import { SommerjobbAd } from "@/app/sommerjobb/_utils/types/SommerjobbAd";
import { StillingSoekResponseExplanation } from "@/server/schemas/stillingSearchSchema";

interface DebugExplainProps {
    explanation: StillingSoekResponseExplanation;
    defaultOpen?: boolean;
}

interface SommerjobbItemProps {
    sommerjobbAd: SommerjobbAd;
}

function DebugExplain({ explanation }: DebugExplainProps): ReactElement {
    return (
        <>
            {explanation.details.length > 0 && (
                <>
                    {explanation.description.startsWith("weight(") && (
                        <Box background="surface-subtle" padding="1">
                            <BodyShort size="small">
                                {explanation.description.split("weight(")[1].split(" ")[0].split(":").join("=")}
                            </BodyShort>
                        </Box>
                    )}
                    {explanation.details.length > 0 &&
                        explanation.details.map((it) => <DebugExplain explanation={it} key={it.description} />)}
                </>
            )}
        </>
    );
}

function DebugItem({ sommerjobbAd }: SommerjobbItemProps): ReactElement {
    return (
        <Box paddingBlock="4">
            <HStack gap="2">
                <Box background="surface-subtle" padding="1">
                    <BodyShort size="small" weight="semibold">
                        {Math.abs(sommerjobbAd.explanation.value) % 1 > 0
                            ? sommerjobbAd.explanation.value.toFixed(2)
                            : sommerjobbAd.explanation.value}
                    </BodyShort>
                </Box>
                <DebugExplain explanation={sommerjobbAd.explanation} />
            </HStack>
        </Box>
    );
}

export default DebugItem;
