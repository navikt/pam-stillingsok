import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { OCCUPATION_MAP } from "./sokehjelperConstants";
import type { WizardState } from "./sokehjelperTypes";

function appendRemoteHjemmekontor(params: URLSearchParams): void {
    params.append(QueryNames.REMOTE, "Kun hjemmekontor");
    params.append(QueryNames.REMOTE, "Delvis hjemmekontor");
}

export function buildSearchUrl(state: WizardState): string {
    const params = new URLSearchParams();

    for (const jobbtype of state.jobbtypes) {
        if (jobbtype === "sommerjobb") {
            params.set(QueryNames.IS_SUMMER_JOB, "true");
        } else if (jobbtype === "deltid") {
            params.append(QueryNames.EXTENT, "Deltid");
        } else if (jobbtype === "foerste-jobb") {
            params.append(QueryNames.EXPERIENCE, "Ingen");
        } else if (jobbtype === "superrask") {
            params.set(QueryNames.HAS_SUPERRASK_SOKNAD, "true");
        }
    }

    const wantsHjemmekontor = state.steder.includes("hjemmekontor");
    if (wantsHjemmekontor) {
        appendRemoteHjemmekontor(params);
    }

    if (state.steder.includes("sted") && state.county !== null) {
        params.append(QueryNames.COUNTY, state.county);
    }

    for (const yrke of state.yrker) {
        if (yrke !== "annet") {
            params.append(QueryNames.OCCUPATION_FIRST_LEVEL, OCCUPATION_MAP[yrke]);
        }
    }

    if (state.yrker.includes("annet") && state.fritekst.length > 0) {
        params.append(QueryNames.SEARCH_STRING, state.fritekst);
    }

    const queryString = params.toString();
    return queryString.length > 0 ? `/stillinger?${queryString}` : "/stillinger";
}
