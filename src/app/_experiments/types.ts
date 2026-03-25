export type VariantKey = "standard" | "test";
export type ExperimentStatus = "off" | "on";

export type ExperimentDefinition<K extends string = string> = Readonly<{
    readonly key: K;
    readonly status: ExperimentStatus;
    readonly trafficPercent: number;
    readonly variants: ReadonlyArray<Readonly<{ readonly key: VariantKey; readonly weightPercent: number }>>;
    readonly pathPrefixes?: ReadonlyArray<string>;
}>;

export type ExperimentConversion =
    | "cta_click"
    | "form_submit"
    | "form_submit_success"
    | "favorite_add"
    | "favorite_remove";
