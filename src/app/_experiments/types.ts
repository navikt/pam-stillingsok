export type ExperimentKey = "search_jobs_cta";

export type VariantKey = "standard" | "test";

export type ExperimentStatus = "off" | "on";

export type ExperimentDefinition = Readonly<{
    readonly key: ExperimentKey;
    readonly status: ExperimentStatus;

    /** 0–100: andel nye brukere som skal inn i eksperimentet */
    readonly trafficPercent: number;

    /** Vekting innenfor de som er med. Summen må være 100 */
    readonly variants: ReadonlyArray<
        Readonly<{
            readonly key: VariantKey;
            readonly weightPercent: number;
        }>
    >;

    /** Begrens til deler av appen */
    readonly pathPrefixes?: ReadonlyArray<string>;
}>;
