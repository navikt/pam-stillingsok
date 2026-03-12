export type VariantKey = "standard" | "test";
export type ExperimentStatus = "off" | "on";

export type ExperimentDefinition<K extends string = string> = Readonly<{
    readonly key: K;
    readonly status: ExperimentStatus;
    readonly trafficPercent: number;
    readonly variants: ReadonlyArray<Readonly<{ readonly key: VariantKey; readonly weightPercent: number }>>;
    readonly pathPrefixes?: ReadonlyArray<string>;
}>;
