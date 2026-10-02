import "server-only";
import { runMapping } from "@/features/ung/onboarding/server/jsonApiMapping";
import {
    mapJobQuiz,
    mapOnboardingModule,
    mapOnboardingResult,
} from "@/features/ung/onboarding/server/mock/mockSharedContentAdapter";
import type { SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";
import {
    type SharedContentContractResult,
    safeParseSharedContentDocument,
} from "@/features/ung/onboarding/server/sharedContentSchemas";
import type { SharedContentSource } from "@/features/ung/onboarding/server/sharedContentSource.server";
import jobQuizFixture from "./jobQuiz.fixture.json";
import onboardingFixture from "./onboarding.fixture.json";

const parsedOnboardingFixture = safeParseSharedContentDocument(onboardingFixture);
const parsedJobQuizFixture = safeParseSharedContentDocument(jobQuizFixture);

function contractError(parsed: Extract<SharedContentContractResult, { ok: false }>): SharedContentResult<never> {
    return {
        ok: false,
        error: {
            type: "invalid-contract",
            message: "Mockdata følger ikke Shared Content-kontrakten",
            issuePaths: parsed.issues.map((issue) => issue.path),
        },
    };
}

export const mockSharedContentSource: SharedContentSource = {
    async getOnboardingModule() {
        if (!parsedOnboardingFixture.ok) {
            return contractError(parsedOnboardingFixture);
        }

        return runMapping(() => mapOnboardingModule(parsedOnboardingFixture.data));
    },

    async getResults(selection) {
        if (!parsedOnboardingFixture.ok) {
            return contractError(parsedOnboardingFixture);
        }

        return runMapping(() => mapOnboardingResult(parsedOnboardingFixture.data, selection));
    },

    async getJobQuiz() {
        if (!parsedJobQuizFixture.ok) {
            return contractError(parsedJobQuizFixture);
        }

        return runMapping(() => mapJobQuiz(parsedJobQuizFixture.data));
    },

    async getArticle() {
        return { ok: false, error: { type: "not-found", message: "Artikler er ikke tilgjengelige i mockkilden" } };
    },

    async getArticleQuiz() {
        return { ok: false, error: { type: "not-found", message: "Artikkelquiz er ikke tilgjengelig i mockkilden" } };
    },
};
