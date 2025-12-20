import { describe, expect, it } from "vitest";
import getDeadlineMessage from "@/app/(nonce)/stillinger/_common/utils/getDeadlineMessage";

describe("getDeadlineMessage", () => {
    const christmasIsoDate = "2025-12-24T12:00:00.000Z"; // will be on wednesday

    it("should return 'Søk snarest mulig' of deadline contains 'asap'", () => {
        const deadline = "Søk ASAP";
        expect(
            getDeadlineMessage({
                dueDateIso: undefined,
                dueLabel: deadline,
                now: new Date("2025-12-24"),
            }),
        ).toBe("Søk snarest mulig");
    });

    it("should return 'Søk snarest mulig' of deadline contains 'snarest'", () => {
        const deadline = "Du må søke snarest";
        expect(
            getDeadlineMessage({
                dueDateIso: undefined,
                dueLabel: deadline,
                now: new Date("2025-12-24"),
            }),
        ).toBe("Søk snarest mulig");
    });

    it("should return 'Søk senest i dag' of deadline is today'", () => {
        expect(
            getDeadlineMessage({
                dueDateIso: christmasIsoDate,
                dueLabel: undefined,
                now: new Date("2025-12-24"),
            }),
        ).toBe("Søk senest i dag");
    });

    it("should return 'Søk senest i morgen' of deadline is tomorrow'", () => {
        expect(
            getDeadlineMessage({
                dueDateIso: christmasIsoDate,
                dueLabel: undefined,
                now: new Date("2025-12-23"),
            }),
        ).toBe("Søk senest i morgen");
    });

    it("should return 'Søk senest i overmorgen' of deadline is 2 days'", () => {
        expect(
            getDeadlineMessage({
                dueDateIso: christmasIsoDate,
                dueLabel: undefined,
                now: new Date("2025-12-22"),
            }),
        ).toBe("Søk senest i overmorgen");
    });

    it("should return 'Søk senest onsdag 24. desember' of deadline is in 3 days or more'", () => {
        expect(
            getDeadlineMessage({
                dueDateIso: christmasIsoDate,
                dueLabel: undefined,
                now: new Date("2025-12-21"),
            }),
        ).toBe("Søk senest onsdag 24. desember");
    });

    it("should return 'Frist: {dueLabel}' if dueLabel has value and dueDateIso is null/undefined", () => {
        expect(
            getDeadlineMessage({
                dueDateIso: undefined,
                dueLabel: "21. des 2025",
                now: new Date("2025-12-21"),
            }),
        ).toBe("Frist: 21. des 2025");
    });
});
