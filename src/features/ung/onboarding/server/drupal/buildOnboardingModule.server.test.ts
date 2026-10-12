import { afterEach, describe, expect, it, vi } from "vitest";
import { appLogger } from "@/app/_common/logging/appLogger";
import type { Selection } from "@/features/ung/onboarding/domain/onboarding";
import {
    buildCollectionFilter,
    buildOnboardingModule,
} from "@/features/ung/onboarding/server/drupal/buildOnboardingModule.server";
import type {
    SharedContentClient,
    TaxonomyTerm,
    TaxonomyVocabulary,
} from "@/features/ung/onboarding/server/drupal/drupalClient.server";
import type { SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";

const GOALS_PARENT_ID = "813d0e38-b09b-4362-bd0c-6b978cc16ecb";
const AGE_UNDER_18 = "5be5c5a4-c191-4f00-9ad1-cc4ac365da78";
const AGE_18_OR_OLDER = "7d074491-7231-4c1c-aef3-bdd917776198";
const EXPERIENCE_NONE = "0fd8124e-edf2-459d-9986-7fb2167dd3da";
const EXPERIENCE_SOME = "a2dc822c-1eea-4201-bf2e-bcd61077ca05";
const GOAL_FIND_JOB = "03c6bc26-0b80-42c0-95aa-d001c6e9c5e2";
const GOAL_APPLY = "cb90945e-a2c4-4a50-8dcb-438c1fe69764";

function term(id: string, name: string, weight: number, description?: string): TaxonomyTerm {
    return { id, name, weight, ...(description ? { description } : {}) };
}

type ClientOverrides = Readonly<{
    taxonomy?: Partial<Record<TaxonomyVocabulary, SharedContentResult<readonly TaxonomyTerm[]>>>;
}>;

function createClient(overrides: ClientOverrides = {}): SharedContentClient {
    const taxonomy = overrides.taxonomy ?? {};
    return {
        getCollection: vi.fn(),
        getArticle: vi.fn(),
        getWebformYaml: vi.fn(),
        apiUrl: "https://cms.staging.karriereveiledning.no",
        getTaxonomyTerms: vi.fn(async (vocabulary: TaxonomyVocabulary) => {
            return (taxonomy[vocabulary] ?? { ok: true, data: [] }) as SharedContentResult<readonly TaxonomyTerm[]>;
        }),
    };
}

const FULL_TAXONOMY: Required<ClientOverrides>["taxonomy"] = {
    shared_content_age: {
        ok: true,
        data: [term(AGE_18_OR_OLDER, "Over 18", 1), term(AGE_UNDER_18, "Under 18", 0)],
    },
    shared_content_experience: {
        ok: true,
        data: [term(EXPERIENCE_SOME, "Some experience", 1), term(EXPERIENCE_NONE, "Never had a job", 0)],
    },
    situations: {
        ok: true,
        data: [
            term(GOAL_APPLY, "Skriv CV og søknad", 1, "Tips og verktøy for CV og søknad."),
            term(GOAL_FIND_JOB, "Finne jobber", 0, "Tips til å finne ledige stillinger."),
        ],
    },
};

describe("buildOnboardingModule", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
    });

    it("gir konfigurasjonsfeil når ankeret for mål mangler", async () => {
        vi.stubEnv("SHARED_CONTENT_GOALS_PARENT_ID", "");

        const result = await buildOnboardingModule(createClient({ taxonomy: FULL_TAXONOMY }));

        expect(result).toMatchObject({ ok: false, error: { type: "configuration" } });
    });

    it("bygger tre lokale steg med alternativer og beskrivelser fra taxonomy", async () => {
        const client = createClient({ taxonomy: FULL_TAXONOMY });

        const result = await buildOnboardingModule(client, GOALS_PARENT_ID);

        expect(result.ok).toBe(true);
        if (!result.ok) {
            return;
        }

        expect(result.data.module).toMatchObject({
            id: "enklere-vei-til-jobb",
            title: "Staging demo: Finn innhold som passer deg",
            steps: [
                {
                    id: "age_step",
                    title: "Alder",
                    questions: [{ id: "age", controlType: "radios", required: false, multiple: false }],
                },
                {
                    id: "experience_step",
                    title: "Erfaring",
                    questions: [{ id: "experience", controlType: "radios", required: true, multiple: false }],
                },
                {
                    id: "goals_step",
                    title: "Dine mål",
                    questions: [{ id: "goals", controlType: "checkboxes", required: false, multiple: true }],
                },
            ],
        });
        expect(result.data.module.steps[0]?.questions[0]?.options).toEqual([
            { id: AGE_UNDER_18, label: "Under 18" },
            { id: AGE_18_OR_OLDER, label: "Over 18" },
        ]);
        expect(result.data.module.steps[2]?.questions[0]?.options).toEqual([
            { id: GOAL_FIND_JOB, label: "Finne jobber", description: "Tips til å finne ledige stillinger." },
            { id: GOAL_APPLY, label: "Skriv CV og søknad", description: "Tips og verktøy for CV og søknad." },
        ]);
        expect(result.data.filterDimensionByQuestionId).toEqual(
            new Map([
                ["age", "age"],
                ["experience", "experience"],
                ["goals", "audiences"],
            ]),
        );
        expect(client.getTaxonomyTerms).toHaveBeenCalledWith("situations", { parentId: GOALS_PARENT_ID });
        expect(client.getArticle).not.toHaveBeenCalled();
        expect(client.getWebformYaml).not.toHaveBeenCalled();
    });

    it("skjuler spørsmål og steg uten svaralternativer og logger en advarsel", async () => {
        const warnSpy = vi.spyOn(appLogger, "warn").mockImplementation(() => {});
        const client = createClient({
            taxonomy: {
                ...FULL_TAXONOMY,
                shared_content_experience: { ok: true, data: [] },
            },
        });

        const result = await buildOnboardingModule(client, GOALS_PARENT_ID);

        expect(result.ok).toBe(true);
        if (!result.ok) {
            return;
        }
        expect(result.data.module.steps.map((step) => step.id)).toEqual(["age_step", "goals_step"]);
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining("spørsmål"),
            expect.objectContaining({ questionId: "experience" }),
        );
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining("steg"),
            expect.objectContaining({ stepId: "experience_step" }),
        );
    });

    it("gir feil når ingen steg har spørsmål med svaralternativer", async () => {
        vi.spyOn(appLogger, "warn").mockImplementation(() => {});
        const client = createClient({
            taxonomy: {
                shared_content_age: { ok: true, data: [] },
                shared_content_experience: { ok: true, data: [] },
                situations: { ok: true, data: [] },
            },
        });

        const result = await buildOnboardingModule(client, GOALS_PARENT_ID);

        expect(result).toMatchObject({ ok: false, error: { type: "invalid-response" } });
    });

    it("gir videre feilen fra ett av taxonomy-kallene", async () => {
        const client = createClient({
            taxonomy: {
                ...FULL_TAXONOMY,
                shared_content_experience: { ok: false, error: { type: "http", message: "Feil", status: 500 } },
            },
        });

        const result = await buildOnboardingModule(client, GOALS_PARENT_ID);

        expect(result).toMatchObject({ ok: false, error: { type: "http", status: 500 } });
    });
});

describe("buildCollectionFilter", () => {
    async function buildModule() {
        return buildOnboardingModule(createClient({ taxonomy: FULL_TAXONOMY }), GOALS_PARENT_ID);
    }

    it("grupperer valgte svar etter filterfelt", async () => {
        const built = await buildModule();
        if (!built.ok) {
            throw new Error("Forventet gyldig modul");
        }
        const selection: Selection = {
            age: { dimension: "age", optionIds: [AGE_UNDER_18] },
            goals: { dimension: "audiences", optionIds: [GOAL_FIND_JOB, GOAL_APPLY] },
        };

        expect(buildCollectionFilter(built.data, selection)).toEqual({
            age: [AGE_UNDER_18],
            audiences: [GOAL_FIND_JOB, GOAL_APPLY],
        });
    });

    it("gir tomt filter når ingen valg er gjort", async () => {
        const built = await buildModule();
        if (!built.ok) {
            throw new Error("Forventet gyldig modul");
        }

        expect(buildCollectionFilter(built.data, {})).toEqual({});
    });

    it("ignorerer ukjente svar-ID-er og stoler ikke på dimension-feltet i Selection", async () => {
        const built = await buildModule();
        if (!built.ok) {
            throw new Error("Forventet gyldig modul");
        }
        const selection: Selection = {
            age: { dimension: "audiences", optionIds: ["ukjent-id"] },
        };

        expect(buildCollectionFilter(built.data, selection)).toEqual({});
    });
});
