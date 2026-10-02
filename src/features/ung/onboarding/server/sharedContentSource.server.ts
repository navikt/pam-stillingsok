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

export type SharedContentError =
    | Readonly<{
          type: "configuration";
          message: string;
      }>
    | Readonly<{
          type: "invalid-request";
          message: string;
      }>
    | Readonly<{
          type: "network";
          message: string;
      }>
    | Readonly<{
          type: "http";
          message: string;
          status: number;
      }>
    | Readonly<{
          type: "not-found";
          message: string;
      }>
    | Readonly<{
          type: "invalid-response";
          message: string;
      }>
    | Readonly<{
          type: "invalid-contract";
          message: string;
          issuePaths: readonly string[];
      }>
    | Readonly<{
          type: "mapping";
          message: string;
      }>;

export type SharedContentResult<T> =
    | Readonly<{
          ok: true;
          data: T;
      }>
    | Readonly<{
          ok: false;
          error: SharedContentError;
      }>;

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
