import "server-only";
import {
    mapJobQuiz,
    mapOnboardingModule,
    mapOnboardingResult,
    SharedContentMappingError,
} from "@/features/ung/onboarding/server/mock/mockSharedContentAdapter";
import {
    type SharedContentContractResult,
    safeParseSharedContentDocument,
} from "@/features/ung/onboarding/server/sharedContentSchemas";
import type {
    SharedContentResult,
    SharedContentSource,
} from "@/features/ung/onboarding/server/sharedContentSource.server";
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

function mappingError(error: unknown): SharedContentResult<never> {
    if (error instanceof SharedContentMappingError) {
        return {
            ok: false,
            error: {
                type: "mapping",
                message: error.message,
            },
        };
    }
    throw error;
}

export const mockSharedContentSource: SharedContentSource = {
    async getOnboardingModule() {
        if (!parsedOnboardingFixture.ok) {
            return contractError(parsedOnboardingFixture);
        }

        try {
            return {
                ok: true,
                data: mapOnboardingModule(parsedOnboardingFixture.data),
            };
        } catch (error) {
            return mappingError(error);
        }
    },

    async getResults(selection) {
        if (!parsedOnboardingFixture.ok) {
            return contractError(parsedOnboardingFixture);
        }

        try {
            return {
                ok: true,
                data: mapOnboardingResult(parsedOnboardingFixture.data, selection),
            };
        } catch (error) {
            return mappingError(error);
        }
    },

    async getJobQuiz() {
        if (!parsedJobQuizFixture.ok) {
            return contractError(parsedJobQuizFixture);
        }

        try {
            return {
                ok: true,
                data: mapJobQuiz(parsedJobQuizFixture.data),
            };
        } catch (error) {
            return mappingError(error);
        }
    },

    async getArticle() {
        return { ok: false, error: { type: "not-found", message: "Artikler er ikke tilgjengelige i mockkilden" } };
    },

    async getArticleQuiz() {
        return { ok: false, error: { type: "not-found", message: "Artikkelquiz er ikke tilgjengelig i mockkilden" } };
    },
};
