"use client";

import { Button } from "@navikt/ds-react";
import { track } from "@/app/_common/umami";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";

export default function ClearAllFiltersButton() {
    const query = useQuery();

    return (
        <Button
            type="button"
            variant="tertiary"
            size="small"
            onClick={() => {
                track("Klikk - Fjern alle filtre", { enhet: "desktop" });
                query.reset();
            }}
        >
            Fjern alle
        </Button>
    );
}
