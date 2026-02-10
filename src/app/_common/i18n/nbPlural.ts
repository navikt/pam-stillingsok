export type NounForms = {
    readonly singular: string;
    readonly plural: string;
};

export type NumberFormatter = (value: number) => string;

export const formatCountWithNoun = (
    count: number,
    noun: NounForms,
    formatNumberValue: NumberFormatter = (value) => String(value),
): string => {
    const formattedCount = formatNumberValue(count);

    if (count === 1) {
        return `${formattedCount} ${noun.singular}`;
    }

    return `${formattedCount} ${noun.plural}`;
};
