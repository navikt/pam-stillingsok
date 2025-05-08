import joinStringWithSeparator from "@/app/stillinger/_common/utils/joinStringWithSeparator";

describe("joinStringWithSeparator", () => {
    it("should join array of strings into one string, seperated by comma and 'og'", () => {
        expect(joinStringWithSeparator(["Apple", "Tomato", "Grapes"])).toBe("Apple, tomato og grapes");
    });

    it("should join 2 words by 'og'", () => {
        expect(joinStringWithSeparator(["Apple", "Tomato"])).toBe("Apple og tomato");
    });

    it("should not join 1 word", () => {
        expect(joinStringWithSeparator(["Apple"])).toBe("Apple");
    });

    it("should join words seperated by comma and custom separator 'eller'", () => {
        expect(joinStringWithSeparator(["Apple", "Tomato", "Grapes"], "eller")).toBe("Apple, tomato eller grapes");
    });

    it("should use lowercase on all words, expect first one", () => {
        expect(joinStringWithSeparator(["Apple", "Tomato", "Grapes"])).toBe("Apple, tomato og grapes");
    });

    it("should keep letter case on any words", () => {
        expect(joinStringWithSeparator(["Apple", "Tomato", "Grapes"], "og", false)).toBe("Apple, Tomato og Grapes");
    });

    it("should use comma as last separator", () => {
        expect(joinStringWithSeparator(["Apple", "Tomato", "Grapes"], ", ", true, false)).toBe("Apple, tomato, grapes");
    });
});
