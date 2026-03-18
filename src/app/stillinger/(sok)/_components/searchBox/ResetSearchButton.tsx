"use client";

import React from "react";
import { Button } from "@navikt/ds-react";
import { TrashIcon } from "@navikt/aksel-icons";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";

export default function ResetSearchButton() {
    const query = useQuery();

    return (
        <Button
            type="button"
            variant="tertiary"
            onClick={() => {
                query.reset();
            }}
            icon={<TrashIcon aria-hidden="true" />}
            size="small"
        >
            Nullstill søk
        </Button>
    );
}
