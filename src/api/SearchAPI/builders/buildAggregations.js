import buildCount from "./buildCount";
import buildLocations from "./buildLocations";
import buildHomeOfficeValues from "./buildHomeOfficeValues";

export default function buildAggregations(globalResult, customResult, locations) {
    return {
        locations: buildCount(
            buildLocations({
                ...globalResult,
                locations
            }),
            buildLocations({
                ...customResult,
                locations
            }),
            "subLocations"
        ),
        occupationFirstLevels: buildCount(
            globalResult.aggregations.occupationFirstLevels,
            customResult.aggregations.occupationFirstLevels,
            "occupationSecondLevels"
        ),
        remote: buildCount(
            buildHomeOfficeValues(globalResult.aggregations.remote),
            buildHomeOfficeValues(customResult.aggregations.remote)
        ),
        published: buildCount(globalResult.aggregations.published, customResult.aggregations.published),
        extent: buildCount(globalResult.aggregations.extent, customResult.aggregations.extent),
        engagementTypes: buildCount(
            globalResult.aggregations.engagementTypes,
            customResult.aggregations.engagementTypes
        ),
        sector: buildCount(globalResult.aggregations.sector, customResult.aggregations.sector)
    };
}
