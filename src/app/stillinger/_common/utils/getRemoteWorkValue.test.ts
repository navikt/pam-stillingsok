import { describe, expect, it } from "vitest";
import getRemoteWorkValue from "@/app/stillinger/_common/utils/getRemoteWorkValue";

describe("getRemoteWorkValue", () => {
    it("should return correct value", () => {
        expect(getRemoteWorkValue("Hjemmekontor")).toBe("Kun hjemmekontor");
    });
    it("should return correct value", () => {
        expect(getRemoteWorkValue("Hybridkontor")).toBe("Delvis hjemmekontor");
    });
    it("should return correct value", () => {
        expect(getRemoteWorkValue("Hjemmekontor ikke mulig")).toBe("Ingen mulighet for hjemmekontor");
    });
    it("should return input value if value is unknown", () => {
        expect(getRemoteWorkValue("Ukjent")).toBe("Ukjent");
    });
});
