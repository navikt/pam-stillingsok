"use client";

import { TrashIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

export default function DrivingDistanceResetButton() {
    const query = useQuery();

    return (
        <Button
            type="button"
            variant="tertiary"
            onClick={() => {
                query.update(
                    (draft) => {
                        draft.delete(QueryNames.POSTCODE);
                        draft.delete(QueryNames.DISTANCE);
                    },
                    {
                        changedKey: QueryNames.POSTCODE,
                    },
                );
            }}
            icon={<TrashIcon aria-hidden="true" />}
            size="small"
        >
            Fjern
        </Button>
    );
}
