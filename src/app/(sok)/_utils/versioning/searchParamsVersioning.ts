import { QueryNames } from "@/app/(sok)/_utils/QueryNames";
import { migrateToV1 } from "@/app/(sok)/_utils/versioning/version01";
import { migrateToV2 } from "@/app/(sok)/_utils/versioning/version02";
import { migrateToV3 } from "@/app/(sok)/_utils/versioning/version03";
import { migrateToV4 } from "@/app/(sok)/_utils/versioning/version04";
import { migrateToV5 } from "@/app/(sok)/_utils/versioning/version05";

export const CURRENT_VERSION = 5;
const FIRST_VERSION = 0;

export function migrateSearchParams(searchParams: URLSearchParams) {
    let migratedSearchParams = new URLSearchParams(searchParams.toString());

    const versionParam = searchParams.get(QueryNames.URL_VERSION);
    const version = versionParam ? parseInt(versionParam, 10) : FIRST_VERSION;

    if (version === CURRENT_VERSION || searchParams.size === 0) {
        return migratedSearchParams;
    }

    if (version < 1) {
        migratedSearchParams = migrateToV1(migratedSearchParams);
    }

    if (version < 2) {
        migratedSearchParams = migrateToV2(migratedSearchParams);
    }

    if (version < 3) {
        migratedSearchParams = migrateToV3(migratedSearchParams);
    }

    if (version < 4) {
        migratedSearchParams = migrateToV4(migratedSearchParams);
    }

    if (version < 5) {
        migratedSearchParams = migrateToV5(migratedSearchParams);
    }

    migratedSearchParams.set(QueryNames.URL_VERSION, `${CURRENT_VERSION}`);

    return migratedSearchParams;
}
