import { ExtendedQuery } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import {
    filterLocation,
    filterWithinDrivingDistance,
    NestedFilter,
    OpenSearchRequestBody,
} from "@/app/stillinger/(sok)/_utils/elasticSearchRequestBody";

const DEFAULT_SIZE = 4;

const elasticSimilaritySearchRequestBody = (query: ExtendedQuery) => {
    const {
        from,
        size,
        counties,
        countries,
        municipals,
        international,
        withinDrivingDistance,
        explain,
        compositeAdVector,
        k = 25,
    } = query;

    if (!compositeAdVector || compositeAdVector.length === 0) {
        return undefined;
    }

    // To ensure consistent search results across multiple shards in elasticsearch when query is blank
    let { sort, q } = query;
    if (!q || q.length === 0) {
        if (sort !== "expires") {
            sort = "published";
        }
        q = [""];
    }

    // Filters
    const filters: ({ term: { status: string } } | NestedFilter)[] = [
        {
            term: {
                status: "ACTIVE",
            },
        },
    ];

    if (withinDrivingDistance?.postcodes && withinDrivingDistance.postcodes.length > 0) {
        filters.push(filterWithinDrivingDistance(withinDrivingDistance));
    } else if (counties) {
        filters.push(filterLocation(counties, municipals, countries, international));
    }

    // Create vector query
    const similarityQuery = {
        knn: {
            compositeAdVector: {
                vector: compositeAdVector,
                k: k,
                filter: {
                    bool: {
                        must: filters,
                    },
                },
            },
        },
    };

    const template: OpenSearchRequestBody = {
        explain: explain === true,
        from: from || 0,
        size: size || DEFAULT_SIZE,
        track_total_hits: true,
        query: similarityQuery,
        _source: {
            includes: [
                "employer.name",
                "businessName",
                "properties.adtextFormat",
                "properties.employer",
                "properties.jobtitle",
                "properties.location",
                "properties.applicationdue",
                "properties.hasInterestform",
                "properties.needDriversLicense",
                "properties.under18",
                "properties.experience",
                "properties.education",
                "properties.workLanguage",
                "properties.remote",
                "locationList.postalCode",
                "locationList.city",
                "locationList.address",
                "locationList.municipal",
                "locationList.county",
                "locationList.country",
                "title",
                "published",
                "expires",
                "uuid",
                "status",
                "source",
                "medium",
                "reference",
                "categoryList.name",
                "categoryList.categoryType",
                "properties.keywords",
                "properties.searchtagsai",
                "properties.searchtags.label",
                "properties.searchtags.score",
                "occupationList.level1",
                "occupationList.level2",
            ],
        },
    };
    return template;
};

export default elasticSimilaritySearchRequestBody;
