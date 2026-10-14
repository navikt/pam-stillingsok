import "server-only";
import { z } from "zod";
import type { Article, ArticleQuiz } from "@/features/ung/enklere-vei-til-jobb/domain/article";
import type { JobQuiz } from "@/features/ung/enklere-vei-til-jobb/domain/jobQuiz";
import type { OnboardingModule, Selection } from "@/features/ung/enklere-vei-til-jobb/domain/onboarding";
import type { OnboardingResult } from "@/features/ung/enklere-vei-til-jobb/domain/results";
import {
    buildArticleHref,
    buildResultHref,
    decodeSelectionParams,
    type SelectionParamsErrorReason,
} from "@/features/ung/enklere-vei-til-jobb/domain/selectionParams";
import { onboardingDefinition } from "@/features/ung/enklere-vei-til-jobb/server/local/onboardingDefinition";
import {
    getJobQuizArticleId,
    isOnboardingEnabled,
} from "@/features/ung/enklere-vei-til-jobb/server/onboardingConfig.server";
import type { SharedContentError } from "@/features/ung/enklere-vei-til-jobb/server/sharedContentResult";
import {
    getSharedContentSource,
    type SharedContentSource,
} from "@/features/ung/enklere-vei-til-jobb/server/sharedContentSource.server";

type SharedContentErrorType = SharedContentError["type"];
type JobQuizArticle =
    | { type: "available"; href: string }
    | { type: "unavailable" }
    | { type: "error"; errorType: SharedContentErrorType };
type StartPageLoadResult =
    | { type: "not-found" }
    | { type: "source-error"; errorType: SharedContentErrorType }
    | { type: "module-error"; errorType: SharedContentErrorType }
    | { type: "success"; module: OnboardingModule };

type ResultsPageLoadResult =
    | { type: "not-found" }
    | { type: "source-error"; errorType: SharedContentErrorType }
    | { type: "module-error"; errorType: SharedContentErrorType }
    | { type: "invalid-selection"; reason: SelectionParamsErrorReason }
    | { type: "results-error"; errorType: SharedContentErrorType }
    | {
          type: "success";
          module: OnboardingModule;
          selection: Selection;
          result: OnboardingResult;
          jobQuizArticle: JobQuizArticle;
      };

type JobQuizPageLoadResult =
    | { type: "not-found" }
    | { type: "source-error"; errorType: SharedContentErrorType; backHref: string }
    | { type: "module-error"; errorType: SharedContentErrorType; backHref: string }
    | { type: "quiz-error"; errorType: SharedContentErrorType; backHref: string }
    | { type: "invalid-selection"; reason: SelectionParamsErrorReason; backHref: string }
    | { type: "success"; quiz: JobQuiz; backHref: string };

type ArticlePageLoadResult =
    | { type: "not-found" }
    | { type: "source-error"; errorType: SharedContentErrorType; backHref: string }
    | { type: "module-error"; errorType: SharedContentErrorType; backHref: string }
    | { type: "invalid-selection"; reason: SelectionParamsErrorReason; backHref: string }
    | { type: "article-error"; errorType: SharedContentErrorType; backHref: string }
    | {
          type: "success";
          article: Article;
          backHref: string;
          quiz:
              | { type: "absent" }
              | { type: "success"; quiz: ArticleQuiz }
              | { type: "error"; errorType: SharedContentErrorType };
      };

const START_PATH = "/ung/enklere-vei-til-jobb";
const RESULT_PATH = `${START_PATH}/resultat`;
const selectionParamNames = new Set(
    onboardingDefinition.steps.flatMap((step) => step.questions.map((question) => question.id)),
);

function hasSelectionParams(query: URLSearchParams): boolean {
    return [...query.keys()].some((key) => selectionParamNames.has(key));
}

type SourceUnavailable = { type: "not-found" } | { type: "source-error"; errorType: SharedContentErrorType };

type SourceUnavailableWithBackHref =
    | { type: "not-found" }
    | { type: "source-error"; errorType: SharedContentErrorType; backHref: string };

function withEnabledSource<T>(load: (source: SharedContentSource) => Promise<T>): Promise<T | SourceUnavailable>;
function withEnabledSource<T>(
    load: (source: SharedContentSource) => Promise<T>,
    sourceErrorBackHref: string,
): Promise<T | SourceUnavailableWithBackHref>;
async function withEnabledSource<T>(
    load: (source: SharedContentSource) => Promise<T>,
    sourceErrorBackHref?: string,
): Promise<T | SourceUnavailable | SourceUnavailableWithBackHref> {
    if (!isOnboardingEnabled()) {
        return { type: "not-found" };
    }

    const source = getSharedContentSource();
    if (!source.ok) {
        return sourceErrorBackHref === undefined
            ? { type: "source-error", errorType: source.error.type }
            : { type: "source-error", errorType: source.error.type, backHref: sourceErrorBackHref };
    }

    return load(source.data);
}

export async function loadArticlePage({
    id,
    query,
}: {
    id: string;
    query: URLSearchParams;
}): Promise<ArticlePageLoadResult> {
    if (!z.uuid().safeParse(id).success) {
        return { type: "not-found" };
    }

    return withEnabledSource(async (source) => {
        let backHref = START_PATH;
        if (hasSelectionParams(query)) {
            const moduleResult = await source.getOnboardingModule();
            if (!moduleResult.ok) {
                return { type: "module-error" as const, errorType: moduleResult.error.type, backHref: START_PATH };
            }

            const parsedSelection = decodeSelectionParams(query, moduleResult.data);
            if (!parsedSelection.ok) {
                return { type: "invalid-selection" as const, reason: parsedSelection.reason, backHref: START_PATH };
            }
            backHref = buildResultHref(parsedSelection.selection, moduleResult.data);
        }

        const articleResult = await source.getArticle(id);
        if (!articleResult.ok) {
            if (articleResult.error.type === "not-found") {
                return { type: "not-found" as const };
            }
            return { type: "article-error" as const, errorType: articleResult.error.type, backHref };
        }

        if (!articleResult.data.webformId) {
            return {
                type: "success" as const,
                article: articleResult.data,
                backHref,
                quiz: { type: "absent" as const },
            };
        }

        const quizResult = await source.getArticleQuiz(articleResult.data.webformId);
        if (!quizResult.ok) {
            return {
                type: "success" as const,
                article: articleResult.data,
                backHref,
                quiz: { type: "error" as const, errorType: quizResult.error.type },
            };
        }

        return {
            type: "success" as const,
            article: articleResult.data,
            backHref,
            quiz: { type: "success" as const, quiz: quizResult.data },
        };
    }, START_PATH);
}

export async function loadStartPage(): Promise<StartPageLoadResult> {
    return withEnabledSource(async (source) => {
        const moduleResult = await source.getOnboardingModule();
        return moduleResult.ok
            ? { type: "success" as const, module: moduleResult.data }
            : { type: "module-error" as const, errorType: moduleResult.error.type };
    });
}

export async function loadJobQuizPage(query: URLSearchParams): Promise<JobQuizPageLoadResult> {
    return withEnabledSource(async (source) => {
        const quizResult = await source.getJobQuiz();
        if (!quizResult.ok) {
            return { type: "quiz-error" as const, errorType: quizResult.error.type, backHref: RESULT_PATH };
        }
        if (!hasSelectionParams(query)) {
            return { type: "success" as const, quiz: quizResult.data, backHref: RESULT_PATH };
        }

        const moduleResult = await source.getOnboardingModule();
        if (!moduleResult.ok) {
            return { type: "module-error" as const, errorType: moduleResult.error.type, backHref: RESULT_PATH };
        }

        const parsedSelection = decodeSelectionParams(query, moduleResult.data);
        if (!parsedSelection.ok) {
            return { type: "invalid-selection" as const, reason: parsedSelection.reason, backHref: RESULT_PATH };
        }

        return {
            type: "success" as const,
            quiz: quizResult.data,
            backHref: buildResultHref(parsedSelection.selection, moduleResult.data),
        };
    }, RESULT_PATH);
}

export async function loadResultsPage(query: URLSearchParams): Promise<ResultsPageLoadResult> {
    return withEnabledSource(async (source) => {
        const moduleResult = await source.getOnboardingModule();
        if (!moduleResult.ok) {
            return { type: "module-error" as const, errorType: moduleResult.error.type };
        }

        const parsedSelection = decodeSelectionParams(query, moduleResult.data);
        if (!parsedSelection.ok) {
            return { type: "invalid-selection" as const, reason: parsedSelection.reason };
        }

        const [result, jobQuizArticle] = await Promise.all([
            source.getResults(parsedSelection.selection),
            loadJobQuizArticle(source, parsedSelection.selection, moduleResult.data),
        ]);
        if (!result.ok) {
            return { type: "results-error" as const, errorType: result.error.type };
        }

        return {
            type: "success" as const,
            module: moduleResult.data,
            selection: parsedSelection.selection,
            result: result.data,
            jobQuizArticle,
        };
    });
}

async function loadJobQuizArticle(
    source: SharedContentSource,
    selection: Selection,
    module: OnboardingModule,
): Promise<JobQuizArticle> {
    const articleId = getJobQuizArticleId();
    if (!articleId.ok) {
        return { type: "error", errorType: articleId.error.type };
    }
    if (!articleId.data) {
        return { type: "unavailable" };
    }

    const availability = await source.isArticlePublished(articleId.data);
    if (!availability.ok) {
        return { type: "error", errorType: availability.error.type };
    }
    return availability.data
        ? { type: "available", href: buildArticleHref(articleId.data, selection, module) }
        : { type: "unavailable" };
}
