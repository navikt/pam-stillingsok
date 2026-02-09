import fixLocationName from "@/app/stillinger/_common/utils/fixLocationName";

export type KommuneRaw = {
    readonly navn: string;
    readonly fylkesnummer: string;
    readonly kommunenummer: string;
};

export type FylkeRaw = {
    readonly navn: string;
    readonly fylkesnummer: string;
};

export type SearchLocation = {
    readonly key: string;
    readonly label: string;
    readonly code: string;
    readonly municipals: readonly {
        readonly key: string;
        readonly label: string;
        readonly code: string;
    }[];
};

export const mapGeografiTilLocations = (input: {
    readonly municipals: readonly KommuneRaw[];
    readonly counties: readonly FylkeRaw[];
}): SearchLocation[] => {
    const { municipals, counties } = input;

    return [
        ...counties.map((county) => {
            const countyMunicipals = municipals
                .filter((municipal) => {
                    return municipal.fylkesnummer === county.fylkesnummer;
                })
                .map((municipal) => {
                    return {
                        key: `${county.navn}.${municipal.navn}`,
                        label: fixLocationName(municipal.navn),
                        code: municipal.kommunenummer,
                    };
                });

            return {
                key: county.navn,
                label: fixLocationName(county.navn),
                code: county.fylkesnummer,
                municipals: countyMunicipals,
            };
        }),
        { key: "UTLAND", label: "Utland", code: "999", municipals: [] },
    ];
};
