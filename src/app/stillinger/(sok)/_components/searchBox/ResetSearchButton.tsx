"use client";

import { TrashIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import { track } from "@/app/_common/umami";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";

export default function ResetSearchButton() {
    const query = useQuery();

    return (
        <Button
            type="button"
            variant="tertiary"
            onClick={() => {
                query.reset();
                track("Filter - fjernet alle");
            }}
            icon={<TrashIcon aria-hidden="true" />}
            size="small"
        >
            Nullstill søk
        </Button>
    );
}
