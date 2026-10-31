import type { ExperimentDefinition } from "./core/experiments";

// Eksperimentregisteret. Legg til oppføringer her. Se README.md for livsløp og regler.
export const experiments = [
    {
        key: "ny-cta",
        status: "on",
        assignmentVersion: 1,
        owner: "team-arbeidsplassen",
        endsAt: "2026-12-31T23:59:59Z",
        eligiblePathPrefixes: ["/stillinger/stilling"],
    },
] as const satisfies ReadonlyArray<ExperimentDefinition>;

export type ExperimentKey = (typeof experiments)[number]["key"];

export const experimentConversions = [
    "cta_click",
    "form_submit",
    "form_submit_success",
    "favorite_add",
    "favorite_remove",
] as const;

export type ExperimentConversion = (typeof experimentConversions)[number];

// Cookienavn appen eier og rydder, men ikke lenger bruker.
export const retiredCookieNames: ReadonlyArray<string> = ["ab_qualifications_soek_superrask_cta"];
