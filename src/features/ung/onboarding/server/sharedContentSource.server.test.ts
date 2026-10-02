import { afterEach, describe, expect, it, vi } from "vitest";
import { mockSharedContentSource } from "@/features/ung/onboarding/server/mock/mockSharedContentSource.server";
import { getSharedContentSource } from "@/features/ung/onboarding/server/sharedContentSource.server";

describe("getSharedContentSource", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("velger mockkilden eksplisitt", () => {
        vi.stubEnv("NODE_ENV", "development");
        vi.stubEnv("SHARED_CONTENT_SOURCE", "mock");

        expect(getSharedContentSource().ok).toBe(true);
    });

    it("returnerer konfigurasjonsfeil for live uten API-konfigurasjon", () => {
        vi.stubEnv("SHARED_CONTENT_SOURCE", "live");
        vi.stubEnv("SHARED_CONTENT_API_URL", "");
        vi.stubEnv("SHARED_CONTENT_API_KEY", "");

        expect(getSharedContentSource()).toMatchObject({ ok: false, error: { type: "configuration" } });
    });

    it("velger hybrid livekilde når API er konfigurert", () => {
        vi.stubEnv("SHARED_CONTENT_SOURCE", "live");
        vi.stubEnv("SHARED_CONTENT_API_URL", "https://cms.staging.karriereveiledning.no");
        vi.stubEnv("SHARED_CONTENT_API_KEY", "test-key");

        const source = getSharedContentSource();

        expect(source.ok).toBe(true);
        if (source.ok) {
            expect(source.data.getOnboardingModule).toBe(mockSharedContentSource.getOnboardingModule);
            expect(source.data.getJobQuiz).toBe(mockSharedContentSource.getJobQuiz);
            expect(source.data.getResults).not.toBe(mockSharedContentSource.getResults);
        }
    });

    it("feiler eksplisitt for ukjent kilde", () => {
        vi.stubEnv("SHARED_CONTENT_SOURCE", "ukjent");

        expect(getSharedContentSource()).toMatchObject({ ok: false, error: { type: "configuration" } });
    });

    it("faller ikke tilbake til mock ved manglende produksjonskonfigurasjon", () => {
        vi.stubEnv("NODE_ENV", "production");
        vi.stubEnv("SHARED_CONTENT_SOURCE", "");

        expect(getSharedContentSource()).toEqual({
            ok: false,
            error: {
                type: "configuration",
                message: "SHARED_CONTENT_SOURCE mangler i produksjonsmiljøet",
            },
        });
    });
});
