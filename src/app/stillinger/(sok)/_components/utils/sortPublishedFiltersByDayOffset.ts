import { FilterAggregation } from "@/app/stillinger/_common/_types/FilterAggregations";

export default function sortPublishedFiltersByDayOffset(filters: FilterAggregation[]): FilterAggregation[] {
    const publishedValuesByDayOffset = ["now/d", "now-3d", "now-7d"];
    const clone = filters;

    clone.sort((a, b) => publishedValuesByDayOffset.indexOf(a.key) - publishedValuesByDayOffset.indexOf(b.key));

    return clone;
}
