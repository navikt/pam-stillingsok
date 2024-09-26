import { FilterAggregation } from "@/app/(sok)/_types/FilterAggregations";

export default function sortFiltersAlphabetically(filters: FilterAggregation[]): FilterAggregation[] {
    const clone = filters;

    clone.sort((a, b) => a.key.localeCompare(b.key, "no"));

    return clone;
}
