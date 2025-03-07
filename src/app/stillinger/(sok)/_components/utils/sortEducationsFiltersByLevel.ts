import { FilterAggregation } from "@/app/stillinger/_common/types/FilterAggregations";

export default function sortEducationsFiltersByLevel(filters: FilterAggregation[]): FilterAggregation[] {
    const educationLevelOrder = [
        "Ingen krav",
        "Videregående",
        "Fagbrev",
        "Fagskole",
        "Bachelor",
        "Master",
        "Forskningsgrad",
    ];
    const clone = filters;

    clone.sort((a, b) => educationLevelOrder.indexOf(a.key) - educationLevelOrder.indexOf(b.key));

    return clone;
}
