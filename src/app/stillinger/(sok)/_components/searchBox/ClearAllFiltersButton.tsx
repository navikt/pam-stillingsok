"use client";

import { Button } from "@navikt/ds-react";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";

export default function ClearAllFiltersButton() {
    const query = useQuery();

    return (
        <Button
            type="button"
            variant="tertiary"
            size="small"
            onClick={() => {
                query.reset();
            }}
        >
            Fjern alle
        </Button>
    );
}
