import type { ExperimentDefinition } from "./types";
import { validateExperiments } from "./validateExperiments";

export const experiments: ReadonlyArray<ExperimentDefinition> = [
    {
        key: "search_jobs_cta",
        status: "on", // skru av eller på eksperimentet
        trafficPercent: 70, // hvor stor andel av nye brukere som skal inn i eksperimentet (0–100)
        pathPrefixes: ["/"], // Hvor gjøres eksperimentet
        variants: [
            { key: "standard", weightPercent: 50 }, // fordeling mellom variantene innenfor eksperimentet (må summe til 100)
            { key: "test", weightPercent: 50 },
        ],
    },
] as const;

// Kjør validering ved oppstart/bygg.
const result = validateExperiments(experiments);

if (!result.ok) {
    // Kaster feil for å unngå at appen starter med ugyldig konfig.
    throw new Error(`Ugyldig A/B-konfig:\n${result.errorMessage}`);
}
