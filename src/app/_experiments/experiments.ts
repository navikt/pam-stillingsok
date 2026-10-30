import type { ExperimentDefinition } from "./types";

export const experiments: ReadonlyArray<ExperimentDefinition> = [];

// TypeScript-typen for alle gyldige experiment keys, basert på "key" i hvert element i experiments-arrayen.
export type ExperimentKey = (typeof experiments)[number]["key"];

// Runtime-konstant som kan importeres i appen for å evaluere og bruke eksperimentene.
export const experimentsRuntime: ReadonlyArray<ExperimentDefinition<ExperimentKey>> = experiments;
