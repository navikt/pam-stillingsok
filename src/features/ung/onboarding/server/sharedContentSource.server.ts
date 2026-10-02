import "server-only";
import type {
    ArticleQuiz,
    JobQuiz,
    OnboardingModule,
    OnboardingResult,
    Selection,
    SharedContentArticle,
} from "@/features/ung/onboarding/domain/types";
import { createLiveSharedContentSource } from "@/features/ung/onboarding/server/live/liveSharedContentSource.server";
import { mockSharedContentSource } from "@/features/ung/onboarding/server/mock/mockSharedContentSource.server";
import type { SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";

export type SharedContentSource = Readonly<{
    getOnboardingModule: () => Promise<SharedContentResult<OnboardingModule>>;
    getResults: (selection: Selection) => Promise<SharedContentResult<OnboardingResult>>;
    getJobQuiz: () => Promise<SharedContentResult<JobQuiz>>;
    getArticle: (articleId: string) => Promise<SharedContentResult<SharedContentArticle>>;
    getArticleQuiz: (webformId: string) => Promise<SharedContentResult<ArticleQuiz>>;
}>;

export function getSharedContentSource(): SharedContentResult<SharedContentSource> {
    const sourceName =
        process.env.SHARED_CONTENT_SOURCE ?? (process.env.NODE_ENV === "production" ? undefined : "mock");

    if (sourceName === "mock") {
        return { ok: true, data: mockSharedContentSource };
    }
    if (sourceName === "live") {
        // Hybrid: onboarding og jobbquiz er fortsatt lokale, mens samling, artikkel og Webform hentes live.
        return createLiveSharedContentSource(mockSharedContentSource);
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
