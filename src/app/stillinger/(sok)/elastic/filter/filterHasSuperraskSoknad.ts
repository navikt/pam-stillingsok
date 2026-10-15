export function filterHasSuperraskSoknad(hasSuperraskSoknad: boolean | undefined) {
    if (hasSuperraskSoknad) {
        return [
            {
                term: {
                    "properties.hasInterestform": "true",
                },
            },
        ];
    }
    return [];
}
