import { describe, expect, it } from "vitest";
import { sanitizeSharedContentHtml } from "@/features/ung/onboarding/server/sanitizeSharedContentHtml.server";

describe("sanitizeSharedContentHtml", () => {
    it("beholder avtalt markup og HTTPS-lenker", () => {
        const html = sanitizeSharedContentHtml(
            '<p>Les <strong>mer</strong> på <a href="https://www.nav.no">nav.no</a>.</p>',
        );

        expect(html).toBe('<p>Les <strong>mer</strong> på <a href="https://www.nav.no">nav.no</a>.</p>');
    });

    it("fjerner script, event-attributter og usikre URL-er", () => {
        const html = sanitizeSharedContentHtml(
            '<p onclick="alert(1)">Tekst<script>alert(1)</script><a href="javascript:alert(1)">lenke</a></p>',
        );

        expect(html).toBe("<p>Tekst<a>lenke</a></p>");
    });
});
