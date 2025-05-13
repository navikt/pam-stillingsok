import { describe, expect, it } from "vitest";
import deadlineText from "@/app/stillinger/_common/utils/deadlineText";

describe("deadlineText", () => {
    const christmasIsoDate = "2025-12-24T12:00:00.000Z"; // will be on wednesday

    it("should return 'Søk snarest mulig' of deadline contains 'asap'", () => {
        const deadline = "Søk ASAP";
        expect(deadlineText(deadline, new Date("2025-12-24"), "")).toBe("Søk snarest mulig");
    });

    it("should return 'Søk snarest mulig' of deadline contains 'snarest'", () => {
        const deadline = "Du må søke snarest";
        expect(deadlineText(deadline, new Date("2025-12-24"), "")).toBe("Søk snarest mulig");
    });

    it("should return 'Søk senest i dag' of deadline is today'", () => {
        expect(deadlineText("", new Date("2025-12-24"), christmasIsoDate)).toBe("Søk senest i dag");
    });

    it("should return 'Søk senest i morgen' of deadline is tomorrow'", () => {
        expect(deadlineText("", new Date("2025-12-23"), christmasIsoDate)).toBe("Søk senest i morgen");
    });

    it("should return 'Søk senest i overmorgen' of deadline is 2 days'", () => {
        expect(deadlineText("", new Date("2025-12-22"), christmasIsoDate)).toBe("Søk senest i overmorgen");
    });

    it("should return 'Søk senest onsdag 24. desember' of deadline is in 3 days or more'", () => {
        expect(deadlineText("", new Date("2025-12-21"), christmasIsoDate)).toBe("Søk senest onsdag 24. desember");
    });

    it("should parse dates with format dd.MM.yyyy", () => {
        expect(deadlineText("", new Date("2025-12-21"), "24.12.2025")).toBe("Søk senest onsdag 24. desember");
    });

    it("should return deadline text if date parse fails'", () => {
        expect(deadlineText("24. desember", new Date("2025-12-21"), "24.des.2025")).toBe("Frist: 24. desember");
    });
});
