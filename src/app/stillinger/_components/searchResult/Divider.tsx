import React, { ReactElement } from "react";
import { Box, Heading } from "@navikt/ds-react";
import { useSearchParams } from "next/navigation";
import { QueryNames } from "@/app/stillinger/_utils/QueryNames";

export default function Divider(): ReactElement {
    const searchParams = useSearchParams();

    return (
        <Box background="surface-subtle" className="mt-8" paddingBlock="4" paddingInline="2" borderRadius="small">
            <Heading level="3" size="small" className="mb-05">
                Søketreff som delvis nevner &laquo;
                {searchParams?.getAll(QueryNames.SEARCH_STRING).join(", ")}
                &raquo; i annonsen
            </Heading>
        </Box>
    );
}
