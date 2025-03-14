import { SOMMERJOBB_CATEGORIES } from "@/app/sommerjobb/_components/constants";

function removeDuplicatesFromArray(array: string[]) {
    return [...new Set(array)];
}

export default function mapFromUrlParamToJobCategories(params: string[]): string[] {
    const allJobCategories = params.map((param: string) => {
        const foundCategory = SOMMERJOBB_CATEGORIES.find((c) => c.label === param);
        if (foundCategory) {
            return foundCategory.values;
        }
        return [];
    });
    return removeDuplicatesFromArray(allJobCategories.flat());
}
