import { FilterAggregation } from "@/app/stillinger/_common/_types/FilterAggregations";

export default function sortRemoteFilters(filter: FilterAggregation[]): FilterAggregation[] {
    const sortedPublishedValues = ["Hybridkontor", "Hjemmekontor", "Hjemmekontor ikke mulig"];
    const clone = filter;

    clone.sort((a, b) => sortedPublishedValues.indexOf(a.key) - sortedPublishedValues.indexOf(b.key));

    return clone;
}
