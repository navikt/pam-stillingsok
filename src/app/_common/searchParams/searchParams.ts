export type PageSearchParams = Readonly<Record<string, string | string[] | undefined>>;

export const getSearchParam = (searchParams: PageSearchParams, key: string): string | undefined => {
    const value = searchParams[key];
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
};

export const getAllSearchParams = (searchParams: PageSearchParams, key: string): string[] => {
    const value = searchParams[key];
    if (value == null) {
        return [];
    }
    if (Array.isArray(value)) {
        return value;
    }
    return [value];
};

export const toUrlSearchParams = (searchParams: PageSearchParams): URLSearchParams => {
    const result = new URLSearchParams();

    for (const [name, value] of Object.entries(searchParams)) {
        if (value === undefined) {
            continue;
        }

        const values = Array.isArray(value) ? value : [value];
        for (const item of values) {
            result.append(name, item);
        }
    }

    return result;
};
