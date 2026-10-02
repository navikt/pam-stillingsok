import "server-only";
import { runMapping, safeParseSharedContentDocument } from "@/features/ung/onboarding/server/drupal/jsonApi";
import {
    mapJobQuiz,
    mapOnboardingModule,
    mapOnboardingResult,
} from "@/features/ung/onboarding/server/mock/mockSharedContentAdapter";
import type { SharedContentSource } from "@/features/ung/onboarding/server/sharedContentSource.server";
import jobQuizFixture from "./jobQuiz.fixture.json";
import onboardingFixture from "./onboarding.fixture.json";

const parsedOnboardingFixture = safeParseSharedContentDocument(onboardingFixture);
const parsedJobQuizFixture = safeParseSharedContentDocument(jobQuizFixture);

export const mockSharedContentSource: SharedContentSource = {
    async getOnboardingModule() {
        if (!parsedOnboardingFixture.ok) {
            return parsedOnboardingFixture;
        }

        return runMapping(() => mapOnboardingModule(parsedOnboardingFixture.data));
    },

    async getResults(selection) {
        if (!parsedOnboardingFixture.ok) {
            return parsedOnboardingFixture;
        }

        return runMapping(() => mapOnboardingResult(parsedOnboardingFixture.data, selection));
    },

    async getJobQuiz() {
        if (!parsedJobQuizFixture.ok) {
            return parsedJobQuizFixture;
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
