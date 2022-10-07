import findZeroCountLocationFacets from "./findZeroCountLocationFacets";
import { findUnknownSearchCriteriaValues } from "./findUnknownSearchCriteriaValues";

export default function buildUnknown(query, aggregations, globalResult, locationsResponse) {
    return {
        countries: findZeroCountLocationFacets(
            query.countries || [],
            globalResult.aggregations.nationalCountMap,
            globalResult.aggregations.internationalCountMap
        ),
        occupationFirstLevels: findUnknownSearchCriteriaValues(
            query.occupationFirstLevels || [],
            aggregations.occupationFirstLevels
        ),
        occupationSecondLevels: findUnknownSearchCriteriaValues(
            query.occupationSecondLevels || [],
            aggregations.occupationFirstLevels,
            "occupationSecondLevels"
        ),
        counties: findUnknownSearchCriteriaValues(query.counties || [], locationsResponse),
        municipals: findUnknownSearchCriteriaValues(query.municipals || [], locationsResponse, "municipals"),
        extent: findUnknownSearchCriteriaValues(query.extent || [], aggregations.extent),
        sector: findUnknownSearchCriteriaValues(query.sector || [], aggregations.sector),
        engagementType: findUnknownSearchCriteriaValues(query.engagementType || [], aggregations.engagementTypes)
    };
}
