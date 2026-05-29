import { filterNestedFacets } from "@/app/stillinger/(sok)/elastic/filter/filterNestedFacets";

export function filterOccupation(occupationFirstLevels: string[] | undefined, occupationSecondLevels: string[] = []) {
    return filterNestedFacets(
        occupationFirstLevels,
        occupationSecondLevels,
        "occupationList.level1",
        "occupationList.level2",
        "occupationList",
    );
}
