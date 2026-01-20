import React, { ReactElement, useContext } from "react";

import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { useSearchParams } from "next/navigation";
import {
    AuthenticationContext,
    ValidJobSeekerStatus,
} from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import { Switch } from "@navikt/ds-react/esm";

/** Normaliser inngående query verdi til en gyldig union. */
const normalize = (raw: string | null | undefined): boolean => {
    return raw === "true";
};

function JobSeeker(): ReactElement {
    const { validJobSeekerStatus } = useContext(AuthenticationContext);
    const query = useQuery();
    const searchParams = useSearchParams();

    if (validJobSeekerStatus !== ValidJobSeekerStatus.IS_VALID_JOB_SEEKER) return <></>;

    const handleChecked = (checked: boolean): void => {
        if (checked) query.set(QueryNames.JOB_SEEKER, "true");
        else query.remove(QueryNames.JOB_SEEKER);
    };

    return (
        <Switch
            color="secondary"
            className="mb-4"
            checked={normalize(searchParams.get(QueryNames.JOB_SEEKER))}
            onChange={(e) => handleChecked(e.target.checked)}
            description="Kun for deg som er registrert jobbsøker hos Nav"
        >
            Muligheter
        </Switch>
    );
}

export default JobSeeker;
