import { describe, it, expect } from "vitest";
import { SanitizedHtml, sanitizeHtml } from "@/server/utils/htmlSanitizer";

describe("sanitizeHtml", () => {
    it("fjerner script-tags og farlige attributter, men beholder trygg HTML", () => {
        const dirty = `
            <div onclick="alert('oops')">
                <script>alert("xss")</script>
                <p>Hei verden</p>
            </div>
        `;

        const result = sanitizeHtml(dirty);

        // Beholder trygg struktur
        expect(result).toContain("<p>Hei verden</p>");

        // Fjerner script
        expect(result.toLowerCase()).not.toContain("<script");

        // Fjerner event-handler-attributt
        expect(result.toLowerCase()).not.toContain("onclick=");
    });

    it("returnerer en branded SanitizedHtml-type", () => {
        const result = sanitizeHtml("<p>Tekst</p>");

        // Kan brukes som string
        const asString: string = result;
        expect(asString).toBe("<p>Tekst</p>");

        // Kan tilordnes til SanitizedHtml (compile-time sjekk)
        const asSanitized: SanitizedHtml = result;
        expect(asSanitized).toBe("<p>Tekst</p>");

        // Denne testen er kun for typesystemet – kjøres av TypeScript, ikke runtime:
        // @ts-expect-error Vanlig string skal *ikke* være direkte assignable til SanitizedHtml
        const _shouldFail: SanitizedHtml = "<p>Direkte string uten sanitering</p>";
    });
});
