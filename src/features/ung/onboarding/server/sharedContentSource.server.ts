import "server-only";
import type { JobQuiz, OnboardingModule, OnboardingResult, Selection } from "@/features/ung/onboarding/domain/types";
import { mockSharedContentSource } from "@/features/ung/onboarding/server/mock/mockSharedContentSource.server";

export type SharedContentError =
    | Readonly<{
          type: "configuration";
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
}>;

export function getSharedContentSource(): SharedContentResult<SharedContentSource> {
    const sourceName =
        process.env.SHARED_CONTENT_SOURCE ?? (process.env.NODE_ENV === "production" ? undefined : "mock");

    if (sourceName === "mock") {
        return { ok: true, data: mockSharedContentSource };
    }
    if (sourceName === "live") {
        return {
            ok: false,
            error: {
                type: "configuration",
                message:
                    "Live Shared Content-kilde kan ikke aktiveres før onboarding- og quizressursene finnes i staging",
            },
        };
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
