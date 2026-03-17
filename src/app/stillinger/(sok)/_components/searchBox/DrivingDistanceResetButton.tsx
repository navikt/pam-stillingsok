"use client";

import React from "react";
import { Button } from "@navikt/ds-react";
import { TrashIcon } from "@navikt/aksel-icons";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";

export default function DrivingDistanceResetButton() {
    const query = useQuery();

    return (
        <Button
            type="button"
            variant="tertiary"
            onClick={() => {
                query.remove(QueryNames.POSTCODE);
                query.remove(QueryNames.DISTANCE);
            }}
            icon={<TrashIcon aria-hidden="true" />}
            size="small"
        >
            Fjern
        </Button>
    );
}
