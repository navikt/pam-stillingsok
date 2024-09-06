interface InputSearchParams {
    q?: string;
}

interface OutputSearchParams {
    q?: string[];
}

export function migrateToV4(inputSearchParams: InputSearchParams): OutputSearchParams {
    const { q, ...otherSearchParams } = inputSearchParams;

    if (q) {
        const result = {
            ...otherSearchParams,
            q: q.split(" "),
        };
        return result;
    }

    return { ...otherSearchParams };
}
