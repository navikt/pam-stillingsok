import type { ExperimentDefinition } from "./types";

export const experiments: ReadonlyArray<ExperimentDefinition> = [
    {
        key: "search_results_card_density",
        status: "on",
        trafficPercent: 60,
        pathPrefixes: ["/stillinger"],
        variants: [
            { key: "standard", weightPercent: 50 },
            { key: "test", weightPercent: 50 },
        ],
    },
    {
        key: "saved_search_cta_copy",
        status: "off",
        trafficPercent: 0,
        pathPrefixes: ["/stillinger/lagrede-sok"],
        variants: [
            { key: "standard", weightPercent: 50 },
            { key: "test", weightPercent: 50 },
        ],
    },
] as const;
