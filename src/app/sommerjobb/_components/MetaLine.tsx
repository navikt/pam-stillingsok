import React from "react";
import { BodyShort, HStack } from "@navikt/ds-react";

type MetaLineProps = Readonly<{
    icon: JSX.Element;
    label: string;
    value: string;
}>;

function MetaLine({ icon, label, value }: MetaLineProps) {
    return (
        <HStack gap="space-8" className="min-width" align="center" wrap={false}>
            <span aria-hidden="true">{icon}</span>
            <BodyShort size="small">
                <span className="sr-only">{label}</span>
                {value}
            </BodyShort>
        </HStack>
    );
}

export default MetaLine;
