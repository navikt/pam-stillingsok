import { afterEach, describe, expect, it, vi } from "vitest";
import { appLogger } from "@/app/_common/logging/appLogger";
import type { Selection } from "@/features/ung/onboarding/domain/onboarding";
import {
    AGE_18_OR_OLDER,
    AGE_UNDER_18,
    EXPERIENCE_NONE,
    EXPERIENCE_SOME,
    GOAL_APPLY,
    GOAL_FIND_JOB,
    ONBOARDING_WEBFORM_YAML,
} from "@/features/ung/onboarding/server/drupal/__fixtures__/onboardingWebform";
import {
    buildCollectionFilter,
    buildOnboardingModule,
} from "@/features/ung/onboarding/server/drupal/buildOnboardingModule.server";
import type {
    SharedContentClient,
    TaxonomyTerm,
    TaxonomyVocabulary,
} from "@/features/ung/onboarding/server/drupal/drupalClient.server";
import { type JsonApiDocument, safeParseSharedContentDocument } from "@/features/ung/onboarding/server/drupal/jsonApi";
import type { SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";
import onItsOwnFixture from "./__fixtures__/on_its_own.json";

const ENV_KEY = "SHARED_CONTENT_GOALS_PARENT_ID";
const GOALS_PARENT_ID = "813d0e38-b09b-4362-bd0c-6b978cc16ecb";
const ARTICLE_ID = "cf446cee-9e2e-46cd-9e1b-09dc4cb1abbb";

function term(id: string, name: string, weight: number): TaxonomyTerm {
    return { id, name, weight };
}

function getArticleDocument(): JsonApiDocument {
    const parsed = safeParseSharedContentDocument(onItsOwnFixture);
    if (!parsed.ok) {
        throw new Error("on_its_own-fixturen følger ikke kontrakten");
    }
    return parsed.data;
}

type ClientOverrides = Readonly<{
    webformYaml?: string;
    taxonomy?: Partial<Record<TaxonomyVocabulary, SharedContentResult<readonly TaxonomyTerm[]>>>;
}>;

function createClient(overrides: ClientOverrides = {}): SharedContentClient {
    const taxonomy = overrides.taxonomy ?? {};
    return {
        getCollection: vi.fn(),
        apiUrl: "https://cms.staging.karriereveiledning.no",
        async getArticle() {
            return { ok: true, data: getArticleDocument() };
        },
        async getWebformYaml() {
            return { ok: true, data: overrides.webformYaml ?? ONBOARDING_WEBFORM_YAML };
        },
        getTaxonomyTerms: vi.fn(async (vocabulary: TaxonomyVocabulary) => {
            return (taxonomy[vocabulary] ?? { ok: true, data: [] }) as SharedContentResult<readonly TaxonomyTerm[]>;
        }),
    };
}

const FULL_TAXONOMY: Required<ClientOverrides>["taxonomy"] = {
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
};

describe("buildOnboardingModule", () => {
    afterEach(() => {
        delete process.env[ENV_KEY];
    });

    it("gir konfigurasjonsfeil når ankeret for mål mangler", async () => {
        const client = createClient({ taxonomy: FULL_TAXONOMY });

        const result = await buildOnboardingModule(client, ARTICLE_ID);

        expect(result).toMatchObject({ ok: false, error: { type: "configuration" } });
    });

    it("bygger steg og spørsmål fra artikkel, Webform og taxonomy, med etiketter fra gjeldende taxonomy", async () => {
        process.env[ENV_KEY] = GOALS_PARENT_ID;
        const client = createClient({ taxonomy: FULL_TAXONOMY });

        const result = await buildOnboardingModule(client, ARTICLE_ID);

        expect(result.ok).toBe(true);
        if (!result.ok) {
            return;
        }
        expect(result.data.module.id).toBe(ARTICLE_ID);
        expect(result.data.module.steps.map((step) => step.id)).toEqual(["step_about_you", "step_goals"]);

        const ageQuestion = result.data.module.steps[0]?.questions.find((question) => question.id === "age");
        expect(ageQuestion?.options).toEqual([
            { id: AGE_UNDER_18, label: "Under 18 år" },
            { id: AGE_18_OR_OLDER, label: "18 år eller eldre" },
        ]);
        expect(result.data.filterDimensionByQuestionId.get("age")).toBe("age");
        expect(result.data.filterDimensionByQuestionId.get("experience")).toBe("experience");
        expect(result.data.filterDimensionByQuestionId.get("goals")).toBe("audiences");

        expect(client.getTaxonomyTerms).toHaveBeenCalledWith("situations", { parentId: GOALS_PARENT_ID });
    });

    it("gir videre feil når artikkelen mangler webformId", async () => {
        process.env[ENV_KEY] = GOALS_PARENT_ID;
        const noWebformDocument = getArticleDocument();
        const { field_sc_webform, ...relationshipsWithoutWebform } = noWebformDocument.data.relationships ?? {};
        const client: SharedContentClient = {
            ...createClient({ taxonomy: FULL_TAXONOMY }),
            getArticle: async () => ({
                ok: true,
                data: {
                    ...noWebformDocument,
                    data: { ...noWebformDocument.data, relationships: relationshipsWithoutWebform },
                },
            }),
        };

        const result = await buildOnboardingModule(client, ARTICLE_ID);

        expect(result).toMatchObject({ ok: false, error: { type: "invalid-response" } });
    });

    it("skjuler spørsmål uten svaralternativer fra taxonomy og logger en advarsel", async () => {
        process.env[ENV_KEY] = GOALS_PARENT_ID;
        const warnSpy = vi.spyOn(appLogger, "warn").mockImplementation(() => {});
        const client = createClient({
            taxonomy: {
                shared_content_age: { ok: true, data: [term(AGE_UNDER_18, "Under 18 år", 1)] },
                shared_content_experience: { ok: true, data: [] },
                situations: FULL_TAXONOMY.situations,
            },
        });

        const result = await buildOnboardingModule(client, ARTICLE_ID);

        expect(result.ok).toBe(true);
        if (!result.ok) {
            return;
        }
        const questionIds = result.data.module.steps.flatMap((step) => step.questions.map((question) => question.id));
        expect(questionIds).toEqual(["age", "goals"]);
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining("Skjuler"),
            expect.objectContaining({ questionId: "experience" }),
        );
        warnSpy.mockRestore();
    });

    it("gir feil når ingen steg har spørsmål med svaralternativer", async () => {
        process.env[ENV_KEY] = GOALS_PARENT_ID;
        vi.spyOn(appLogger, "warn").mockImplementation(() => {});
        const client = createClient({
            taxonomy: {
                shared_content_age: { ok: true, data: [] },
                shared_content_experience: { ok: true, data: [] },
                situations: { ok: true, data: [] },
            },
        });

        const result = await buildOnboardingModule(client, ARTICLE_ID);

        expect(result).toMatchObject({ ok: false, error: { type: "invalid-response" } });
    });

    it("gir videre feilen fra ett av taxonomy-kallene", async () => {
        process.env[ENV_KEY] = GOALS_PARENT_ID;
        const client = createClient({
            taxonomy: {
                shared_content_age: { ok: true, data: [term(AGE_UNDER_18, "Under 18 år", 1)] },
                shared_content_experience: { ok: false, error: { type: "http", message: "Feil", status: 500 } },
                situations: FULL_TAXONOMY.situations,
            },
        });

        const result = await buildOnboardingModule(client, ARTICLE_ID);

        expect(result).toMatchObject({ ok: false, error: { type: "http", status: 500 } });
    });
});

describe("buildCollectionFilter", () => {
    afterEach(() => {
        delete process.env[ENV_KEY];
    });

    async function buildModule() {
        process.env[ENV_KEY] = GOALS_PARENT_ID;
        const client = createClient({ taxonomy: FULL_TAXONOMY });
        return buildOnboardingModule(client, ARTICLE_ID);
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

    it("ignorerer svar-ID-er som ikke finnes blant spørsmålets gyldige valg, og stoler aldri på dimension-feltet i Selection", async () => {
        const built = await buildModule();
        if (!built.ok) {
            throw new Error("Forventet gyldig modul");
        }

        // dimension er forfalsket til "audiences" selv om "age" er feltets faktiske, validerte dimensjon.
        const selection: Selection = {
            age: { dimension: "audiences", optionIds: ["ukjent-id"] },
        };

        expect(buildCollectionFilter(built.data, selection)).toEqual({});
    });
});
