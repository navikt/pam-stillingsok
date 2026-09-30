import { afterEach, describe, expect, it, vi } from "vitest";
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

    it("feiler eksplisitt når livekilden mangler onboarding- og quizressurser", () => {
        vi.stubEnv("SHARED_CONTENT_SOURCE", "live");

        expect(getSharedContentSource()).toEqual({
            ok: false,
            error: {
                type: "configuration",
                message:
                    "Live Shared Content-kilde kan ikke aktiveres før onboarding- og quizressursene finnes i staging",
            },
        });
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
