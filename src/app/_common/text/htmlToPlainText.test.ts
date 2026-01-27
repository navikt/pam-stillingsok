import { describe, expect, it } from "vitest";
import { htmlToPlainText } from "./htmlToPlainText";

describe("htmlToPlainText", () => {
    it("hindrer at tekst kleber seg ved <br>", () => {
        expect(htmlToPlainText("Hei,<br>Jeg trenger hjelp")).toBe("Hei, Jeg trenger hjelp");
    });

    it("normaliserer &nbsp; og whitespace", () => {
        expect(htmlToPlainText("Hei,&nbsp;Jeg")).toBe("Hei, Jeg");
    });
});
