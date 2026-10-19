import { afterEach, describe, expect, it, vi } from "vitest";
import { isXmasJobFilterVisible } from "./xmasJobFilterConfig.server";

describe("isXmasJobFilterVisible", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("viser filteret når flagget eksplisitt er true", () => {
        vi.stubEnv("XMAS_JOB_FILTER_VISIBLE", "true");

        expect(isXmasJobFilterVisible()).toBe(true);
    });

    it("skjuler filteret når flagget eksplisitt er false", () => {
        vi.stubEnv("XMAS_JOB_FILTER_VISIBLE", "false");

        expect(isXmasJobFilterVisible()).toBe(false);
    });

    it("skjuler filteret som standard i production", () => {
        vi.stubEnv("NODE_ENV", "production");
        vi.stubEnv("XMAS_JOB_FILTER_VISIBLE", undefined);

        expect(isXmasJobFilterVisible()).toBe(false);
    });

    it("viser filteret som standard utenfor production", () => {
        vi.stubEnv("NODE_ENV", "development");
        vi.stubEnv("XMAS_JOB_FILTER_VISIBLE", undefined);

        expect(isXmasJobFilterVisible()).toBe(true);
    });
});
