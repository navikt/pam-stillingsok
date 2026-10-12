import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Article, ArticleQuiz } from "@/features/ung/onboarding/domain/article";
import type { JobQuiz } from "@/features/ung/onboarding/domain/jobQuiz";
import type { OnboardingModule, Selection } from "@/features/ung/onboarding/domain/onboarding";
import type { OnboardingResult } from "@/features/ung/onboarding/domain/results";
import { mockSharedContentSource } from "@/features/ung/onboarding/server/mock/mockSharedContentSource.server";
import { isOnboardingEnabled } from "@/features/ung/onboarding/server/onboardingConfig.server";
import {
    loadArticlePage,
    loadJobQuizPage,
    loadResultsPage,
    loadStartPage,
} from "@/features/ung/onboarding/server/onboardingPageLoaders.server";
import type { SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";
import {
    getSharedContentSource,
    type SharedContentSource,
} from "@/features/ung/onboarding/server/sharedContentSource.server";

vi.mock("@/features/ung/onboarding/server/onboardingConfig.server", () => ({
    isOnboardingEnabled: vi.fn(),
}));

vi.mock("@/features/ung/onboarding/server/sharedContentSource.server", () => ({
    getSharedContentSource: vi.fn(),
}));

const moduleFixture = {
    id: "test-module",
    title: "Test",
    intro: "Intro",
    resultTitle: "Resultater",
    resultIntro: "Resultatintro",
    steps: [
        {
            id: "step",
            title: "Step",
            questions: [
                {
                    id: "age",
                    title: "Alder",
                    controlType: "radios",
                    required: true,
                    dimension: "age",
                    multiple: false,
                    options: [
                        { id: "11111111-1111-4111-8111-111111111111", label: "Ung" },
                        { id: "22222222-2222-4222-8222-222222222222", label: "Voksen" },
                    ],
                },
                {
                    id: "experience",
                    title: "Erfaring",
                    controlType: "radios",
                    required: false,
                    dimension: "experience",
                    multiple: true,
                    options: [
                        { id: "33333333-3333-4333-8333-333333333333", label: "Litt" },
                        { id: "44444444-4444-4444-8444-444444444444", label: "Mye" },
                    ],
                },
            ],
        },
    ],
} satisfies OnboardingModule;
const resultFixture = { title: "Resultater", intro: "Intro", sections: [] } satisfies OnboardingResult;
const articleFixture = {
    id: "55555555-5555-4555-8555-555555555555",
    title: "Artikkel",
    intro: "",
    blocks: [],
    webformId: "test-webform",
} satisfies Article;

function createSource(
    moduleResult: SharedContentResult<OnboardingModule> = { ok: true, data: moduleFixture },
    resultsResult: SharedContentResult<OnboardingResult> = { ok: true, data: resultFixture },
    quizResult: SharedContentResult<JobQuiz> = {
        ok: false,
        error: { type: "not-found", message: "Quiz unavailable" },
    },
    articleResult: SharedContentResult<Article> = { ok: true, data: articleFixture },
    articleQuizResult: SharedContentResult<ArticleQuiz> = {
        ok: false,
        error: { type: "not-found", message: "Article quiz unavailable" },
    },
) {
    const getOnboardingModule = vi.fn<SharedContentSource["getOnboardingModule"]>().mockResolvedValue(moduleResult);
    const getResults = vi.fn<SharedContentSource["getResults"]>().mockResolvedValue(resultsResult);
    const getJobQuiz = vi.fn<SharedContentSource["getJobQuiz"]>().mockResolvedValue(quizResult);
    const getArticle = vi.fn<SharedContentSource["getArticle"]>().mockResolvedValue(articleResult);
    const getArticleQuiz = vi.fn<SharedContentSource["getArticleQuiz"]>().mockResolvedValue(articleQuizResult);
    const source: SharedContentSource = {
        getOnboardingModule,
        getResults,
        getJobQuiz,
        getArticle,
        getArticleQuiz,
    };
    return { source, getOnboardingModule, getResults, getJobQuiz, getArticle, getArticleQuiz };
}

function useSource(source: SharedContentSource): void {
    useSourceResult({ ok: true, data: source });
}

function useSourceResult(result: SharedContentResult<SharedContentSource>): void {
    vi.mocked(isOnboardingEnabled).mockReturnValue(true);
    vi.mocked(getSharedContentSource).mockReturnValue(result);
}

async function jobQuizSuccessFixture(): Promise<Extract<SharedContentResult<JobQuiz>, { ok: true }>> {
    const result = await mockSharedContentSource.getJobQuiz();
    if (!result.ok) {
        throw new Error("Expected the mock Shared Content source to provide a job quiz");
    }
    return result;
}

async function articleQuizSuccessFixture(): Promise<Extract<SharedContentResult<ArticleQuiz>, { ok: true }>> {
    const result = await mockSharedContentSource.getArticleQuiz("test-webform");
    if (!result.ok) {
        throw new Error("Expected the mock Shared Content source to provide an article quiz");
    }
    return result;
}

describe("onboarding page loaders", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    describe("loadArticlePage", () => {
        it("returns not-found when onboarding is disabled", async () => {
            vi.mocked(isOnboardingEnabled).mockReturnValue(false);

            await expect(loadArticlePage({ id: articleFixture.id, query: new URLSearchParams() })).resolves.toEqual({
                type: "not-found",
            });
            expect(getSharedContentSource).not.toHaveBeenCalled();
        });

        it("returns not-found for an invalid UUID", async () => {
            vi.mocked(isOnboardingEnabled).mockReturnValue(true);

            await expect(loadArticlePage({ id: "not-a-uuid", query: new URLSearchParams() })).resolves.toEqual({
                type: "not-found",
            });
            expect(getSharedContentSource).not.toHaveBeenCalled();
        });

        it("returns a source error with its error type", async () => {
            useSourceResult({
                ok: false,
                error: { type: "configuration", message: "Not configured" },
            });

            await expect(loadArticlePage({ id: articleFixture.id, query: new URLSearchParams() })).resolves.toEqual({
                type: "source-error",
                errorType: "configuration",
                backHref: "/ung/enklere-vei-til-jobb",
            });
        });

        it("does not load the module for an empty query and uses the start href", async () => {
            const { source, getOnboardingModule, getArticle } = createSource();
            useSource(source);

            await expect(
                loadArticlePage({ id: articleFixture.id, query: new URLSearchParams() }),
            ).resolves.toMatchObject({
                type: "success",
                article: articleFixture,
                backHref: "/ung/enklere-vei-til-jobb",
            });
            expect(getOnboardingModule).not.toHaveBeenCalled();
            expect(getArticle).toHaveBeenCalledWith(articleFixture.id);
        });

        it("loads and validates the module before fetching an article for a valid query", async () => {
            const { source, getOnboardingModule, getArticle } = createSource();
            useSource(source);
            const query = new URLSearchParams("age=age%3A22222222-2222-4222-8222-222222222222");

            await expect(loadArticlePage({ id: articleFixture.id, query })).resolves.toMatchObject({
                type: "success",
                backHref: "/ung/enklere-vei-til-jobb/resultat?age=age%3A22222222-2222-4222-8222-222222222222",
            });
            expect(getOnboardingModule).toHaveBeenCalledTimes(1);
            expect(getArticle).toHaveBeenCalledTimes(1);
            expect(getOnboardingModule.mock.invocationCallOrder[0]).toBeLessThan(
                getArticle.mock.invocationCallOrder[0],
            );
        });

        it("returns a module error before fetching the article", async () => {
            const { source, getArticle } = createSource({
                ok: false,
                error: { type: "network", message: "Module unavailable" },
            });
            useSource(source);

            await expect(
                loadArticlePage({ id: articleFixture.id, query: new URLSearchParams("age=value") }),
            ).resolves.toEqual({
                type: "module-error",
                errorType: "network",
                backHref: "/ung/enklere-vei-til-jobb",
            });
            expect(getArticle).not.toHaveBeenCalled();
        });

        it("returns invalid-selection before fetching the article", async () => {
            const { source, getArticle } = createSource();
            useSource(source);

            await expect(
                loadArticlePage({ id: articleFixture.id, query: new URLSearchParams("age=invalid") }),
            ).resolves.toMatchObject({
                type: "invalid-selection",
                reason: "malformed-value",
                backHref: "/ung/enklere-vei-til-jobb",
            });
            expect(getArticle).not.toHaveBeenCalled();
        });

        it("returns not-found for a missing article", async () => {
            const { source } = createSource(undefined, undefined, undefined, {
                ok: false,
                error: { type: "not-found", message: "Article unavailable" },
            });
            useSource(source);

            await expect(loadArticlePage({ id: articleFixture.id, query: new URLSearchParams() })).resolves.toEqual({
                type: "not-found",
            });
        });

        it("returns a typed error for other article failures", async () => {
            const { source } = createSource(undefined, undefined, undefined, {
                ok: false,
                error: { type: "network", message: "Article unavailable" },
            });
            useSource(source);

            await expect(loadArticlePage({ id: articleFixture.id, query: new URLSearchParams() })).resolves.toEqual({
                type: "article-error",
                errorType: "network",
                backHref: "/ung/enklere-vei-til-jobb",
            });
        });

        it("returns success without a quiz when the article has no webform", async () => {
            const articleWithoutQuiz = {
                id: articleFixture.id,
                title: "Artikkel",
                intro: "",
                blocks: [],
            } satisfies Article;
            const { source, getArticleQuiz } = createSource(undefined, undefined, undefined, {
                ok: true,
                data: articleWithoutQuiz,
            });
            useSource(source);

            await expect(loadArticlePage({ id: articleFixture.id, query: new URLSearchParams() })).resolves.toEqual({
                type: "success",
                article: articleWithoutQuiz,
                backHref: "/ung/enklere-vei-til-jobb",
                quiz: { type: "absent" },
            });
            expect(getArticleQuiz).not.toHaveBeenCalled();
        });

        it("returns a successful article quiz", async () => {
            const quizResult = await articleQuizSuccessFixture();
            const { source } = createSource(undefined, undefined, undefined, undefined, quizResult);
            useSource(source);

            await expect(loadArticlePage({ id: articleFixture.id, query: new URLSearchParams() })).resolves.toEqual({
                type: "success",
                article: articleFixture,
                backHref: "/ung/enklere-vei-til-jobb",
                quiz: { type: "success", quiz: quizResult.data },
            });
        });

        it("keeps an article quiz failure non-fatal and exposes its error type", async () => {
            const { source } = createSource(undefined, undefined, undefined, undefined, {
                ok: false,
                error: { type: "network", message: "Quiz unavailable" },
            });
            useSource(source);

            await expect(loadArticlePage({ id: articleFixture.id, query: new URLSearchParams() })).resolves.toEqual({
                type: "success",
                article: articleFixture,
                backHref: "/ung/enklere-vei-til-jobb",
                quiz: { type: "error", errorType: "network" },
            });
        });
    });

    describe("loadStartPage", () => {
        it("returns not-found when onboarding is disabled", async () => {
            vi.mocked(isOnboardingEnabled).mockReturnValue(false);

            await expect(loadStartPage()).resolves.toEqual({ type: "not-found" });
            expect(getSharedContentSource).not.toHaveBeenCalled();
        });

        it("returns a source error with its error type", async () => {
            useSourceResult({
                ok: false,
                error: { type: "configuration", message: "Not configured" },
            });

            await expect(loadStartPage()).resolves.toEqual({ type: "source-error", errorType: "configuration" });
        });

        it("returns a module error with its error type", async () => {
            const { source } = createSource({
                ok: false,
                error: { type: "not-found", message: "Module unavailable" },
            });
            useSource(source);

            await expect(loadStartPage()).resolves.toEqual({ type: "module-error", errorType: "not-found" });
        });

        it("returns the loaded module on success", async () => {
            const { source } = createSource();
            useSource(source);

            await expect(loadStartPage()).resolves.toEqual({ type: "success", module: moduleFixture });
        });
    });

    describe("loadJobQuizPage", () => {
        it("returns not-found when onboarding is disabled", async () => {
            vi.mocked(isOnboardingEnabled).mockReturnValue(false);

            await expect(loadJobQuizPage(new URLSearchParams())).resolves.toEqual({ type: "not-found" });
            expect(getSharedContentSource).not.toHaveBeenCalled();
        });

        it("returns a source error", async () => {
            useSourceResult({
                ok: false,
                error: { type: "configuration", message: "Not configured" },
            });

            await expect(loadJobQuizPage(new URLSearchParams())).resolves.toEqual({
                type: "source-error",
                errorType: "configuration",
                backHref: "/ung/enklere-vei-til-jobb/resultat",
            });
        });

        it("returns a module error", async () => {
            const { source } = createSource({
                ok: false,
                error: { type: "not-found", message: "Module unavailable" },
            });
            useSource(source);

            await expect(loadJobQuizPage(new URLSearchParams())).resolves.toEqual({
                type: "module-error",
                errorType: "not-found",
                backHref: "/ung/enklere-vei-til-jobb/resultat",
            });
        });

        it("returns a quiz error", async () => {
            const { source } = createSource(moduleSuccess(), undefined, {
                ok: false,
                error: { type: "network", message: "Quiz unavailable" },
            });
            useSource(source);

            await expect(loadJobQuizPage(new URLSearchParams())).resolves.toEqual({
                type: "quiz-error",
                errorType: "network",
                backHref: "/ung/enklere-vei-til-jobb/resultat",
            });
        });

        it("returns an empty selection and keeps the trailing question mark in the back href", async () => {
            const quizResult = await jobQuizSuccessFixture();
            const { source, getOnboardingModule, getJobQuiz } = createSource(moduleSuccess(), undefined, quizResult);
            useSource(source);

            await expect(loadJobQuizPage(new URLSearchParams())).resolves.toEqual({
                type: "success",
                quiz: quizResult.data,
                backHref: "/ung/enklere-vei-til-jobb/resultat?",
            });
            expect(getSharedContentSource).toHaveBeenCalledTimes(1);
            expect(getOnboardingModule).toHaveBeenCalledTimes(1);
            expect(getJobQuiz).toHaveBeenCalledTimes(1);
        });

        it("returns the quiz and correct back href for a valid query", async () => {
            const quizResult = await jobQuizSuccessFixture();
            const { source } = createSource(moduleSuccess(), undefined, quizResult);
            useSource(source);
            const query = new URLSearchParams("age=age%3A22222222-2222-4222-8222-222222222222");

            const result = await loadJobQuizPage(query);

            expect(result).toEqual({
                type: "success",
                quiz: quizResult.data,
                backHref: "/ung/enklere-vei-til-jobb/resultat?age=age%3A22222222-2222-4222-8222-222222222222",
            });
            if (result.type === "success") {
                expect(Object.keys(result).sort()).toEqual(["backHref", "quiz", "type"]);
            }
        });

        it("returns an invalid-selection outcome for malformed values", async () => {
            const quizResult = await jobQuizSuccessFixture();
            const { source, getJobQuiz } = createSource(moduleSuccess(), undefined, quizResult);
            useSource(source);

            await expect(loadJobQuizPage(new URLSearchParams("age=invalid"))).resolves.toMatchObject({
                type: "invalid-selection",
                reason: "malformed-value",
                backHref: "/ung/enklere-vei-til-jobb/resultat",
            });
            expect(getJobQuiz).toHaveBeenCalledTimes(1);
        });

        it("starts loading the module and quiz in parallel", async () => {
            let resolveModule: (value: SharedContentResult<OnboardingModule>) => void = () => {};
            let resolveQuiz: (value: SharedContentResult<JobQuiz>) => void = () => {};
            const modulePromise = new Promise<SharedContentResult<OnboardingModule>>((resolve) => {
                resolveModule = resolve;
            });
            const quizPromise = new Promise<SharedContentResult<JobQuiz>>((resolve) => {
                resolveQuiz = resolve;
            });
            const { source, getOnboardingModule, getJobQuiz } = createSource();
            getOnboardingModule.mockReturnValue(modulePromise);
            getJobQuiz.mockReturnValue(quizPromise);
            useSource(source);

            const loadResult = loadJobQuizPage(new URLSearchParams());

            expect(getOnboardingModule).toHaveBeenCalledTimes(1);
            expect(getJobQuiz).toHaveBeenCalledTimes(1);
            const quizResult = await jobQuizSuccessFixture();
            resolveModule(moduleSuccess());
            resolveQuiz(quizResult);
            await expect(loadResult).resolves.toMatchObject({ type: "success" });
        });
    });

    describe("loadResultsPage", () => {
        it("returns not-found when onboarding is disabled", async () => {
            vi.mocked(isOnboardingEnabled).mockReturnValue(false);

            await expect(loadResultsPage(new URLSearchParams())).resolves.toEqual({ type: "not-found" });
            expect(getSharedContentSource).not.toHaveBeenCalled();
        });

        it("returns a source error", async () => {
            useSourceResult({
                ok: false,
                error: { type: "configuration", message: "Not configured" },
            });

            await expect(loadResultsPage(new URLSearchParams())).resolves.toEqual({
                type: "source-error",
                errorType: "configuration",
            });
        });

        it("returns a module error", async () => {
            const { source } = createSource({
                ok: false,
                error: { type: "not-found", message: "Module unavailable" },
            });
            useSource(source);

            await expect(loadResultsPage(new URLSearchParams())).resolves.toEqual({
                type: "module-error",
                errorType: "not-found",
            });
        });

        it("returns defaults for an empty query and reuses the same source for results", async () => {
            const { source, getOnboardingModule, getResults } = createSource();
            useSource(source);

            await expect(loadResultsPage(new URLSearchParams())).resolves.toEqual({
                type: "success",
                module: moduleFixture,
                selection: {
                    age: { dimension: "age", optionIds: ["11111111-1111-4111-8111-111111111111"] },
                },
                result: resultFixture,
                jobQuizHref: "/ung/enklere-vei-til-jobb/jobbquiz?age=age%3A11111111-1111-4111-8111-111111111111",
            });
            expect(getSharedContentSource).toHaveBeenCalledTimes(1);
            expect(getOnboardingModule).toHaveBeenCalledTimes(1);
            expect(getResults).toHaveBeenCalledWith({
                age: { dimension: "age", optionIds: ["11111111-1111-4111-8111-111111111111"] },
            });
        });

        it("returns an invalid-selection outcome for malformed values", async () => {
            const { source, getResults } = createSource();
            useSource(source);

            await expect(loadResultsPage(new URLSearchParams("age=invalid"))).resolves.toMatchObject({
                type: "invalid-selection",
                reason: "malformed-value",
            });
            expect(getResults).not.toHaveBeenCalled();
        });

        it("decodes valid single- and multiple-choice selections", async () => {
            const { source, getResults } = createSource();
            useSource(source);
            const selection: Selection = {
                age: { dimension: "age", optionIds: ["22222222-2222-4222-8222-222222222222"] },
                experience: {
                    dimension: "experience",
                    optionIds: ["33333333-3333-4333-8333-333333333333", "44444444-4444-4444-8444-444444444444"],
                },
            };
            const query = new URLSearchParams();
            query.append("age", "age:22222222-2222-4222-8222-222222222222");
            query.append("experience", "experience:33333333-3333-4333-8333-333333333333");
            query.append("experience", "experience:44444444-4444-4444-8444-444444444444");

            await expect(loadResultsPage(query)).resolves.toMatchObject({
                type: "success",
                selection,
                jobQuizHref:
                    "/ung/enklere-vei-til-jobb/jobbquiz?age=age%3A22222222-2222-4222-8222-222222222222&experience=experience%3A33333333-3333-4333-8333-333333333333&experience=experience%3A44444444-4444-4444-8444-444444444444",
            });
            expect(getResults).toHaveBeenCalledWith(selection);
        });

        it("rejects values with a dimension that does not match their question", async () => {
            const { source } = createSource();
            useSource(source);

            await expect(
                loadResultsPage(new URLSearchParams("age=experience%3A33333333-3333-4333-8333-333333333333")),
            ).resolves.toMatchObject({ type: "invalid-selection", reason: "malformed-value" });
        });

        it("returns a results error", async () => {
            const { source } = createSource(moduleSuccess(), {
                ok: false,
                error: { type: "network", message: "Results unavailable" },
            });
            useSource(source);

            await expect(loadResultsPage(new URLSearchParams())).resolves.toEqual({
                type: "results-error",
                errorType: "network",
            });
        });
    });
});

function moduleSuccess(): SharedContentResult<OnboardingModule> {
    return { ok: true, data: moduleFixture };
}
