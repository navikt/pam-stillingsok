import "server-only";
import { appLogger } from "@/app/_common/logging/appLogger";
import type { Selection } from "@/features/ung/onboarding/domain/onboarding";
import type { ResultSection } from "@/features/ung/onboarding/domain/results";
import { mapArticle, mapArticleCollection } from "@/features/ung/onboarding/server/drupal/articleMapper.server";
import {
    getSharedContentClient,
    type SharedContentClient,
    type SharedContentOperation,
} from "@/features/ung/onboarding/server/drupal/drupalClient.server";
import { parseWebformQuiz } from "@/features/ung/onboarding/server/drupal/webformQuiz.server";
import { jobQuiz } from "@/features/ung/onboarding/server/local/jobQuiz";
import { onboardingModule } from "@/features/ung/onboarding/server/local/onboardingModule";
import type { SharedContentError, SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";
import type { SharedContentSource } from "@/features/ung/onboarding/server/sharedContentSource.server";

/**
 * Hybridkilde: onboarding og jobbquiz er lokale (server/local/), mens samling, artikkel og Webform-quiz
 * hentes live. Feil faller aldri tilbake til mock.
 */
export function createLiveSharedContentSource(
    clientOverride?: SharedContentClient,
): SharedContentResult<SharedContentSource> {
    let client = clientOverride;
    if (!client) {
        const clientResult = getSharedContentClient();
        if (!clientResult.ok) {
            return { ok: false, error: clientResult.error };
        }
        client = clientResult.data;
    }
    const liveClient = client;

    return {
        ok: true,
        data: {
            async getOnboardingModule() {
                return { ok: true, data: onboardingModule };
            },

            async getJobQuiz() {
                return { ok: true, data: jobQuiz };
            },

            async getResults(selection: Selection) {
                const collection = await liveClient.getCollection();
                if (!collection.ok) {
                    return failed("collection", collection.error);
                }

                const articles = mapArticleCollection(collection.data, selection);
                if (!articles.ok) {
                    return failed("collection", articles.error);
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
                        title: onboardingModule.resultTitle,
                        intro: onboardingModule.resultIntro,
                        sections,
                    },
                };
            },

            async getArticle(articleId: string) {
                const document = await liveClient.getArticle(articleId);
                if (!document.ok) {
                    return failed("article", document.error);
                }

                const article = mapArticle(document.data, liveClient.apiUrl);
                if (!article.ok) {
                    return failed("article", article.error);
                }
                return article;
            },

            async getArticleQuiz(webformId: string) {
                const yaml = await liveClient.getWebformYaml(webformId);
                if (!yaml.ok) {
                    return failed("webform", yaml.error);
                }

                const quiz = parseWebformQuiz(yaml.data);
                if (!quiz.ok) {
                    return failed("webform", quiz.error);
                }
                return quiz;
            },
        },
    };
}

function statusClass(status: number): string {
    return `${Math.floor(status / 100)}xx`;
}

function failed(operation: SharedContentOperation, error: SharedContentError): SharedContentResult<never> {
    appLogger.warn("Shared Content-kall feilet", {
        operation,
        errorType: error.type,
        ...(error.type === "http" ? { statusClass: statusClass(error.status) } : {}),
    });
    return { ok: false, error };
}
