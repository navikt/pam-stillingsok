import { afterEach, describe, expect, it, vi } from "vitest";
import { isOnboardingEnabled } from "@/features/ung/onboarding/server/onboardingConfig.server";

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
