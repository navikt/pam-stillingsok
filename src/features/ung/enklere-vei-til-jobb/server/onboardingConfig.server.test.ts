import { afterEach, describe, expect, it, vi } from "vitest";
import {
    getJobQuizArticleId,
    isOnboardingEnabled,
} from "@/features/ung/enklere-vei-til-jobb/server/onboardingConfig.server";

describe("isOnboardingEnabled", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("respekterer eksplisitt aktivert flagg", () => {
        vi.stubEnv("NODE_ENV", "production");
        vi.stubEnv("ENKLERE_VEI_TIL_JOBB_ENABLED", "true");

        expect(isOnboardingEnabled()).toBe(true);
    });

    it("respekterer eksplisitt deaktivert flagg", () => {
        vi.stubEnv("NODE_ENV", "development");
        vi.stubEnv("ENKLERE_VEI_TIL_JOBB_ENABLED", "false");

        expect(isOnboardingEnabled()).toBe(false);
    });

    it("er deaktivert som standard i produksjon", () => {
        vi.stubEnv("NODE_ENV", "production");
        vi.stubEnv("ENKLERE_VEI_TIL_JOBB_ENABLED", "");

        expect(isOnboardingEnabled()).toBe(false);
    });
});

describe("getJobQuizArticleId", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("returnerer konfigurert UUID", () => {
        vi.stubEnv("JOB_QUIZ_ARTICLE_ID", "e8cbb6a9-8db5-487b-8738-02245a1e9a30");

        expect(getJobQuizArticleId()).toEqual({
            ok: true,
            data: "e8cbb6a9-8db5-487b-8738-02245a1e9a30",
        });
    });

    it("returnerer undefined når variabelen mangler", () => {
        vi.stubEnv("JOB_QUIZ_ARTICLE_ID", "");

        expect(getJobQuizArticleId()).toEqual({ ok: true, data: undefined });
    });

    it("avviser ugyldig UUID", () => {
        vi.stubEnv("JOB_QUIZ_ARTICLE_ID", "ikke-en-uuid");

        expect(getJobQuizArticleId()).toMatchObject({
            ok: false,
            error: { type: "configuration" },
        });
    });
});
