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

const ENV_KEY = "SHARED_CONTENT_GOALS_PARENT_ID";
const GOALS_PARENT_ID = "813d0e38-b09b-4362-bd0c-6b978cc16ecb";

const AGE_UNDER_18 = "5be5c5a4-c191-4f00-9ad1-cc4ac365da78";
const AGE_18_OR_OLDER = "7d074491-7231-4c1c-aef3-bdd917776198";
const EXPERIENCE_NONE = "0fd8124e-edf2-459d-9986-7fb2167dd3da";
const EXPERIENCE_SOME = "a2dc822c-1eea-4201-bf2e-bcd61077ca05";
const GOAL_FIND_JOB = "03c6bc26-0b80-42c0-95aa-d001c6e9c5e2";
const GOAL_APPLY = "cb90945e-a2c4-4a50-8dcb-438c1fe69764";

function term(id: string, name: string, weight: number): TaxonomyTerm {
    return { id, name, weight };
}

function createClient(
    responses: Partial<Record<TaxonomyVocabulary, SharedContentResult<readonly TaxonomyTerm[]>>>,
): SharedContentClient {
    return {
        getCollection: vi.fn(),
        getArticle: vi.fn(),
        getWebformYaml: vi.fn(),
        apiUrl: "https://cms.staging.karriereveiledning.no",
        getTaxonomyTerms: vi.fn(async (vocabulary: TaxonomyVocabulary) => {
            return (responses[vocabulary] ?? { ok: true, data: [] }) as SharedContentResult<readonly TaxonomyTerm[]>;
        }),
    };
}

describe("buildOnboardingModule", () => {
    afterEach(() => {
        delete process.env[ENV_KEY];
    });

    it("gir konfigurasjonsfeil når ankeret for mål mangler", async () => {
        const client = createClient({});

        const result = await buildOnboardingModule(client);

        expect(result).toMatchObject({ ok: false, error: { type: "configuration" } });
        expect(client.getTaxonomyTerms).not.toHaveBeenCalled();
    });

    it("setter inn valg sortert etter weight, og sender ankeret for mål som parentId", async () => {
        process.env[ENV_KEY] = GOALS_PARENT_ID;
        const client = createClient({
            shared_content_age: {
                ok: true,
                data: [term(AGE_18_OR_OLDER, "18 år eller eldre", 2), term(AGE_UNDER_18, "Under 18 år", 1)],
            },
            shared_content_experience: {
                ok: true,
                data: [term(EXPERIENCE_SOME, "Litt erfaring", 2), term(EXPERIENCE_NONE, "Ingen erfaring", 1)],
            },
            situations: {
                ok: true,
                data: [term(GOAL_APPLY, "Søke på en stilling", 2), term(GOAL_FIND_JOB, "Finne en jobb", 1)],
            },
        });

        const result = await buildOnboardingModule(client);

        expect(result.ok).toBe(true);
        if (!result.ok) {
            return;
        }
        const ageQuestion = result.data.module.questions.find((question) => question.id === "question-age");
        expect(ageQuestion?.options).toEqual([
            { id: AGE_UNDER_18, label: "Under 18 år" },
            { id: AGE_18_OR_OLDER, label: "18 år eller eldre" },
        ]);
        expect(result.data.filterDimensionByQuestionId.get("question-age")).toBe("age");
        expect(result.data.filterDimensionByQuestionId.get("question-situation")).toBe("experience");
        expect(result.data.filterDimensionByQuestionId.get("question-goals")).toBe("audiences");

        expect(client.getTaxonomyTerms).toHaveBeenCalledWith("situations", { parentId: GOALS_PARENT_ID });
    });

    it("skjuler spørsmål uten valg og logger en advarsel", async () => {
        process.env[ENV_KEY] = GOALS_PARENT_ID;
        const warnSpy = vi.spyOn(appLogger, "warn").mockImplementation(() => {});
        const client = createClient({
            shared_content_age: { ok: true, data: [term(AGE_UNDER_18, "Under 18 år", 1)] },
            shared_content_experience: { ok: true, data: [] },
            situations: { ok: true, data: [term(GOAL_FIND_JOB, "Finne en jobb", 1)] },
        });

        const result = await buildOnboardingModule(client);

        expect(result.ok).toBe(true);
        if (!result.ok) {
            return;
        }
        expect(result.data.module.questions.map((question) => question.id)).toEqual(["question-age", "question-goals"]);
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining("Skjuler"),
            expect.objectContaining({ questionId: "question-situation" }),
        );
        warnSpy.mockRestore();
    });

    it("gir feil når alle tre vokabularene er tomme", async () => {
        process.env[ENV_KEY] = GOALS_PARENT_ID;
        vi.spyOn(appLogger, "warn").mockImplementation(() => {});
        const client = createClient({
            shared_content_age: { ok: true, data: [] },
            shared_content_experience: { ok: true, data: [] },
            situations: { ok: true, data: [] },
        });

        const result = await buildOnboardingModule(client);

        expect(result).toMatchObject({ ok: false, error: { type: "invalid-response" } });
    });

    it("gir videre feilen fra ett av taxonomy-kallene", async () => {
        process.env[ENV_KEY] = GOALS_PARENT_ID;
        const client = createClient({
            shared_content_age: { ok: true, data: [term(AGE_UNDER_18, "Under 18 år", 1)] },
            shared_content_experience: { ok: false, error: { type: "http", message: "Feil", status: 500 } },
            situations: { ok: true, data: [term(GOAL_FIND_JOB, "Finne en jobb", 1)] },
        });

        const result = await buildOnboardingModule(client);

        expect(result).toMatchObject({ ok: false, error: { type: "http", status: 500 } });
    });
});

describe("buildCollectionFilter", () => {
    async function buildModule(): Promise<Awaited<ReturnType<typeof buildOnboardingModule>>> {
        process.env[ENV_KEY] = GOALS_PARENT_ID;
        const client = createClient({
            shared_content_age: {
                ok: true,
                data: [term(AGE_UNDER_18, "Under 18 år", 1), term(AGE_18_OR_OLDER, "18+", 2)],
            },
            shared_content_experience: {
                ok: true,
                data: [term(EXPERIENCE_NONE, "Ingen", 1), term(EXPERIENCE_SOME, "Litt", 2)],
            },
            situations: {
                ok: true,
                data: [term(GOAL_FIND_JOB, "Finne jobb", 1), term(GOAL_APPLY, "Søke", 2)],
            },
        });
        return buildOnboardingModule(client);
    }

    afterEach(() => {
        delete process.env[ENV_KEY];
    });

    it("grupperer valgte svar-ID-er etter filterfelt", async () => {
        const built = await buildModule();
        if (!built.ok) {
            throw new Error("Forventet gyldig modul");
        }
        const selection: Selection = { answerIds: [AGE_UNDER_18, GOAL_FIND_JOB, GOAL_APPLY] };

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

        expect(buildCollectionFilter(built.data, { answerIds: [] })).toEqual({});
    });

    it("ignorerer svar-ID-er som ikke finnes i modulen", async () => {
        const built = await buildModule();
        if (!built.ok) {
            throw new Error("Forventet gyldig modul");
        }

        expect(buildCollectionFilter(built.data, { answerIds: ["ukjent-id"] })).toEqual({});
    });
});
