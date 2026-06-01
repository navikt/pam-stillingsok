import type { ExtendedQuery } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import { ALLOWED_NUMBER_OF_RESULTS_PER_PAGE, SEARCH_CHUNK_SIZE } from "@/app/stillinger/(sok)/_utils/query";
import buildAggregations from "@/app/stillinger/(sok)/elastic/buildAggregations";
import buildPostFilter from "@/app/stillinger/(sok)/elastic/buildPostFilter";
import { buildQuery } from "@/app/stillinger/(sok)/elastic/buildQuery";
import buildSort from "@/app/stillinger/(sok)/elastic/buildSort";
import buildSourceIncludes from "@/app/stillinger/(sok)/elastic/buildSourceIncludes";
import type { OpenSearchRequestBody } from "@/app/stillinger/(sok)/elastic/types/types";

const elasticSearchRequestBody = (query: ExtendedQuery) => {
    const { from, size, explain } = query;

    const requestBody: OpenSearchRequestBody = {
        explain: explain === true,
        from: from || 0,
        size: size && ALLOWED_NUMBER_OF_RESULTS_PER_PAGE.includes(size) ? size : SEARCH_CHUNK_SIZE,
        track_total_hits: true,
        min_score: 0.7,
        query: buildQuery(query),
        post_filter: buildPostFilter(query),
        _source: buildSourceIncludes(),
        aggs: buildAggregations(query),
    };

    const sort = buildSort(query);

    if (sort) {
        requestBody.sort = sort;
    }

    return requestBody;
};

export default elasticSearchRequestBody;
