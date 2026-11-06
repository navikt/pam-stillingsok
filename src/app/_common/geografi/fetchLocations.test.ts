import { afterEach, describe, expect, it, vi } from "vitest";
import { FETCH_PARSE_ERROR, fetchLocations } from "./fetchLocations";

vi.mock("@/app/_common/logging/appLogger", () => ({
    appLogger: { error: vi.fn(), httpError: vi.fn() },
}));

describe("fetchLocations", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.unstubAllEnvs();
    });

    it("returnerer parse-feil i stedet for å kaste når svaret ikke er gyldig JSON", async () => {
        vi.stubEnv("PAM_GEOGRAFI_API_URL", "http://geografi");
        vi.stubGlobal(
            "fetch",
            vi.fn().mockImplementation(() => Promise.resolve(new Response("{ikke json", { status: 200 }))),
        );

        const result = await fetchLocations();

        expect(result.data).toEqual([]);
        expect(result.errors).toEqual([{ type: FETCH_PARSE_ERROR, endpoint: "kommuner" }]);
    });
});
