import React, { ReactElement } from "react";
import { BodyShort, Box, Heading } from "@navikt/ds-react";
import { useSearchParams } from "next/navigation";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";

export default function Divider(): ReactElement {
    const searchParams = useSearchParams();

    return (
        <Box background="surface-subtle" className="mt-16" paddingBlock="4" paddingInline="4" borderRadius="small">
            <Heading level="3" size="small" className="mb-05">
                Søketreff som kan være relevante
            </Heading>
            <BodyShort>
                Annonsene under ga delvis treff på &laquo;
                {searchParams.getAll(QueryNames.SEARCH_STRING).join(", ")}
                &raquo;
            </BodyShort>
        </Box>
    );
}
