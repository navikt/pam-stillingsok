import type { ExtendedQuery } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import { buildAllFilters } from "@/app/stillinger/(sok)/elastic/filter/buildAllFilters";

export default function buildPostFilter(query: ExtendedQuery) {
    return {
        bool: {
            filter: buildAllFilters(query),
        },
    };
}
