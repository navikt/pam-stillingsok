import type { ExtendedQuery } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import type { Sort } from "@/app/stillinger/(sok)/elastic/types/types";

function mapSortByValue(value: string) {
    switch (value) {
        case "expires":
            return "expires";
        default:
            return "published";
    }
}

function mapSortByOrder(value: string) {
    if (value !== "published") {
        return "asc";
    }
    return "desc";
}

export default function buildSort(query: ExtendedQuery): Sort[] | undefined {
    let { sort } = query;

    if (!query.q || query.q.length === 0) {
        if (sort !== "expires") {
            sort = "published";
        }
    }

    if (sort && sort !== "relevant") {
        return [
            {
                [mapSortByValue(sort)]: {
                    order: mapSortByOrder(sort),
                },
            },
            "_score",
            "_id",
        ];
    }

    return undefined;
}
