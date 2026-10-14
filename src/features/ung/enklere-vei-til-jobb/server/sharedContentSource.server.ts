import "server-only";
import type { Article, ArticleQuiz } from "@/features/ung/enklere-vei-til-jobb/domain/article";
import type { JobQuiz } from "@/features/ung/enklere-vei-til-jobb/domain/jobQuiz";
import type { OnboardingModule, Selection } from "@/features/ung/enklere-vei-til-jobb/domain/onboarding";
import type { OnboardingResult } from "@/features/ung/enklere-vei-til-jobb/domain/results";
import { createLiveSharedContentSource } from "@/features/ung/enklere-vei-til-jobb/server/liveSharedContentSource.server";
import { mockSharedContentSource } from "@/features/ung/enklere-vei-til-jobb/server/mock/mockSharedContentSource.server";
import type { SharedContentResult } from "@/features/ung/enklere-vei-til-jobb/server/sharedContentResult";

export type SharedContentSource = Readonly<{
    getOnboardingModule: () => Promise<SharedContentResult<OnboardingModule>>;
    getResults: (selection: Selection) => Promise<SharedContentResult<OnboardingResult>>;
    getJobQuiz: () => Promise<SharedContentResult<JobQuiz>>;
    isArticlePublished: (articleId: string) => Promise<SharedContentResult<boolean>>;
    getArticle: (articleId: string) => Promise<SharedContentResult<Article>>;
    getArticleQuiz: (webformId: string) => Promise<SharedContentResult<ArticleQuiz>>;
}>;

export function getSharedContentSource(): SharedContentResult<SharedContentSource> {
    const sourceName =
        process.env.SHARED_CONTENT_SOURCE ?? (process.env.NODE_ENV === "production" ? undefined : "mock");

    if (sourceName === "mock") {
        return { ok: true, data: mockSharedContentSource };
    }
    if (sourceName === "live") {
        // Hybrid: onboarding-struktur og jobbquiz er lokale, mens taxonomy og innhold hentes live.
        return createLiveSharedContentSource();
    }
    return {
        ok: false,
        error: {
            type: "configuration",
            message: sourceName
                ? `Ukjent SHARED_CONTENT_SOURCE: ${sourceName}`
                : "SHARED_CONTENT_SOURCE mangler i produksjonsmiljøet",
        },
    };
}
