type SortableByKey = Readonly<{
    key: string;
}>;

export default function sortFiltersAlphabetically<TItem extends SortableByKey>(items: readonly TItem[]): TItem[] {
    return [...items].sort((firstItem, secondItem) => {
        return firstItem.key.localeCompare(secondItem.key, "nb-NO");
    });
}
