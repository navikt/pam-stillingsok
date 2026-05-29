import type { ExtendedQuery } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import { filterEducation } from "@/app/stillinger/(sok)/elastic/filter/filterEducation";
import { filterEngagementType } from "@/app/stillinger/(sok)/elastic/filter/filterEngagementType";
import { filterExperience } from "@/app/stillinger/(sok)/elastic/filter/filterExperience";
import { filterExtent } from "@/app/stillinger/(sok)/elastic/filter/filterExtent";
import { filterLocation } from "@/app/stillinger/(sok)/elastic/filter/filterLocation";
import { filterNeedDriversLicense } from "@/app/stillinger/(sok)/elastic/filter/filterNeedDriversLicense";
import { filterOccupation } from "@/app/stillinger/(sok)/elastic/filter/filterOccupation";
import { filterPublished } from "@/app/stillinger/(sok)/elastic/filter/filterPublished";
import { filterRemote } from "@/app/stillinger/(sok)/elastic/filter/filterRemote";
import { filterSector } from "@/app/stillinger/(sok)/elastic/filter/filterSector";
import { filterUnder18 } from "@/app/stillinger/(sok)/elastic/filter/filterUnder18";
import { filterWithinDrivingDistance } from "@/app/stillinger/(sok)/elastic/filter/filterWithinDrivingDistance";
import { filterWorkLanguage } from "@/app/stillinger/(sok)/elastic/filter/filterWorkLanguage";
import type { BoolFilter, NestedFilter, RangeFilter } from "@/app/stillinger/(sok)/elastic/types/types";

export const NOT_DEFINED = "Ikke oppgitt";

export function buildAllFilters(query: ExtendedQuery, excludeFilter?: string) {
    const {
        counties,
        countries,
        experience,
        education,
        municipals,
        needDriversLicense,
        under18,
        extent,
        workLanguage,
        remote,
        engagementType,
        sector,
        published,
        occupationFirstLevels,
        occupationSecondLevels,
        international,
        withinDrivingDistance,
    } = query;

    let filters: (BoolFilter | NestedFilter | RangeFilter)[] = [];

    if (excludeFilter !== "education") {
        filters = [...filters, ...filterEducation(education)];
    }
    if (excludeFilter !== "engagementType") {
        filters = [...filters, ...filterEngagementType(engagementType)];
    }
    if (excludeFilter !== "experience") {
        filters = [...filters, ...filterExperience(experience)];
    }
    if (excludeFilter !== "extent") {
        filters = [...filters, ...filterExtent(extent)];
    }
    if (excludeFilter !== "location") {
        filters = [...filters, filterLocation(counties, municipals, countries, international)];
    }
    if (excludeFilter !== "needDriversLicense") {
        filters = [...filters, ...filterNeedDriversLicense(needDriversLicense)];
    }
    if (excludeFilter !== "occupation") {
        filters = [...filters, filterOccupation(occupationFirstLevels, occupationSecondLevels)];
    }
    if (excludeFilter !== "published") {
        filters = [...filters, ...filterPublished(published)];
    }
    if (excludeFilter !== "remote") {
        filters = [...filters, ...filterRemote(remote)];
    }
    if (excludeFilter !== "sector") {
        filters = [...filters, ...filterSector(sector)];
    }
    if (excludeFilter !== "under18") {
        filters = [...filters, ...filterUnder18(under18)];
    }
    if (excludeFilter !== "withinDrivingDistance") {
        filters = [...filters, filterWithinDrivingDistance(withinDrivingDistance)];
    }
    if (excludeFilter !== "workLanguage") {
        filters = [...filters, ...filterWorkLanguage(workLanguage)];
    }

    return filters;
}
