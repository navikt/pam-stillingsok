import "server-only";
import { appLogger } from "@/app/_common/logging/appLogger";
import type { ResultSection, Selection } from "@/features/ung/onboarding/domain/types";
import { mapArticle, mapArticleCollection } from "@/features/ung/onboarding/server/live/liveSharedContentAdapter";
import { parseWebformQuiz } from "@/features/ung/onboarding/server/live/webformQuizParser.server";
import {
    getSharedContentClient,
    type SharedContentClient,
    type SharedContentClientError,
    type SharedContentOperation,
} from "@/features/ung/onboarding/server/sharedContentClient.server";
import type {
    SharedContentError,
    SharedContentResult,
    SharedContentSource,
} from "@/features/ung/onboarding/server/sharedContentSource.server";

const ARTICLE_INCLUDE = [
    "field_sc_content",
    "field_sc_content.field_accordion_items",
    "field_sc_content.field_video_media",
] as const;

type LocalSource = Pick<SharedContentSource, "getOnboardingModule" | "getJobQuiz">;

/**
 * Hybridkilde: onboarding og jobbquiz kommer fra den lokale kilden, mens samling, artikkel og Webform-quiz
 * hentes live. Feil faller aldri tilbake til mock.
 */
export function createLiveSharedContentSource(
    local: LocalSource,
    clientOverride?: SharedContentClient,
): SharedContentResult<SharedContentSource> {
    let client = clientOverride;
    if (!client) {
        const clientResult = getSharedContentClient();
        if (!clientResult.ok) {
            return { ok: false, error: { type: "configuration", message: clientResult.error.message } };
        }
        client = clientResult.data;
    }
    const liveClient = client;

    return {
        ok: true,
        data: {
            getOnboardingModule: local.getOnboardingModule,
            getJobQuiz: local.getJobQuiz,

            async getResults(selection: Selection) {
                const moduleResult = await local.getOnboardingModule();
                if (!moduleResult.ok) {
                    return moduleResult;
                }

                const collection = await liveClient.getCollection();
                if (!collection.ok) {
                    return failure("collection", collection.error);
                }

                const articles = mapArticleCollection(collection.data, selection);
                if (!articles.ok) {
                    return adapterFailure("collection", articles.error);
                }

                const sections: ResultSection[] =
                    articles.data.length > 0
                        ? [
                              {
                                  id: "articles",
                                  title: "Artikler",
                                  content: articles.data.map((article) => ({
                                      id: article.id,
                                      type: "article" as const,
                                      title: article.title,
                                      description: article.description,
                                      href: article.href,
                                  })),
                              },
                          ]
                        : [];

                return {
                    ok: true,
                    data: {
                        title: moduleResult.data.resultTitle,
                        intro: moduleResult.data.resultIntro,
                        sections,
                    },
                };
            },

            async getArticle(articleId: string) {
                const document = await liveClient.getArticle({
                    resourceId: articleId,
                    include: ARTICLE_INCLUDE,
                });
                if (!document.ok) {
                    return failure("article", document.error);
                }

                const article = mapArticle(document.data);
                if (!article.ok) {
                    return adapterFailure("article", article.error);
                }
                return article;
            },

            async getArticleQuiz(webformId: string) {
                const webform = await liveClient.getWebform({ webformId });
                if (!webform.ok) {
                    return failure("webform", webform.error);
                }

                const quiz = parseWebformQuiz(webform.data);
                if (!quiz.ok) {
                    return adapterFailure("webform", quiz.error);
                }
                return quiz;
            },
        },
    };
}

function statusClass(status: number): string {
    return `${Math.floor(status / 100)}xx`;
}

function failure(operation: SharedContentOperation, error: SharedContentClientError): SharedContentResult<never> {
    appLogger.warn("Shared Content-kall feilet", {
        operation,
        errorType: error.type,
        ...(error.type === "http" ? { statusClass: statusClass(error.status) } : {}),
    });

    if (error.type === "http" && error.status === 404) {
        return { ok: false, error: { type: "not-found", message: "Fant ikke ressursen i Shared Content" } };
    }
    const mapped: SharedContentError =
        error.type === "invalid-contract"
            ? { type: "invalid-contract", message: error.message, issuePaths: error.issuePaths }
            : error.type === "http"
              ? { type: "http", message: error.message, status: error.status }
              : { type: error.type, message: error.message };
    return { ok: false, error: mapped };
}

function adapterFailure(
    operation: SharedContentOperation,
    error: Readonly<{ type: "invalid-contract" | "mapping"; message: string; issuePaths?: readonly string[] }>,
): SharedContentResult<never> {
    appLogger.warn("Shared Content-svar kunne ikke mappes", { operation, errorType: error.type });
    return {
        ok: false,
        error:
            error.type === "mapping"
                ? { type: "mapping", message: error.message }
                : { type: "invalid-contract", message: error.message, issuePaths: error.issuePaths ?? [] },
    };
}
