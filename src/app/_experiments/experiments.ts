import type { ExperimentDefinition } from "./types";

export const experiments = [
    {
        key: "search_jobs_cta",
        status: "off", // skru av eller på eksperimentet
        trafficPercent: 100, // hvor stor andel av nye brukere som skal inn i eksperimentet (0–100)
        pathPrefixes: ["/"], // Hvor gjøres eksperimentet
        variants: [
            { key: "standard", weightPercent: 50 }, // fordeling mellom variantene innenfor eksperimentet (må summe til 100)
            { key: "test", weightPercent: 50 },
        ],
    },
] as const satisfies ReadonlyArray<ExperimentDefinition>;

// TypeScript-typen for alle gyldige experiment keys, basert på "key" i hvert element i experiments-arrayen.
export type ExperimentKey = (typeof experiments)[number]["key"];

// Runtime-konstant som kan importeres i appen for å evaluere og bruke eksperimentene.
export const experimentsRuntime: ReadonlyArray<ExperimentDefinition<ExperimentKey>> = experiments;
