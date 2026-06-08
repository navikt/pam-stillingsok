import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { OCCUPATION_MAP } from "./sokehjelperConstants";
import type { WizardState } from "./sokehjelperTypes";

function appendRemoteHjemmekontor(params: URLSearchParams): void {
    params.append(QueryNames.REMOTE, "Kun hjemmekontor");
    params.append(QueryNames.REMOTE, "Delvis hjemmekontor");
}

export function buildSearchUrl(state: WizardState): string {
    if (state.jobbtype === "vet-hva-jeg-vil") {
        return "/stillinger";
    }

    const params = new URLSearchParams();

    if (state.jobbtype === "sommerjobb") {
        params.set(QueryNames.IS_SUMMER_JOB, "true");
    } else if (state.jobbtype === "deltid") {
        params.append(QueryNames.EXTENT, "Deltid");
    } else if (state.jobbtype === "foerste-jobb") {
        params.append(QueryNames.EXPERIENCE, "Ingen");
    }

    const wantsHjemmekontor = state.jobbtype === "hjemmekontor" || state.sted === "hjemmekontor";
    if (wantsHjemmekontor) {
        appendRemoteHjemmekontor(params);
    }

    if (state.sted === "sted" && state.county !== null) {
        params.append(QueryNames.COUNTY, state.county);
    }

    if (state.yrke !== null) {
        if (state.yrke !== "annet") {
            params.append(QueryNames.OCCUPATION_FIRST_LEVEL, OCCUPATION_MAP[state.yrke]);
        } else if (state.fritekst.length > 0) {
            params.append(QueryNames.SEARCH_STRING, state.fritekst);
        }
    }

    const queryString = params.toString();
    return queryString.length > 0 ? `/stillinger?${queryString}` : "/stillinger";
}
