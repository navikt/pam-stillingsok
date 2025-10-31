import { describe, it, expect } from "vitest";
import { EmailString } from "@/app/stillinger/_common/lib/ad-model/schemas/primitives";

describe('"EmailString (unicode)', () => {
    it("godtar ø i lokal-del", () => {
        const res = EmailString.safeParse("stig,høgset@epost.no");
        expect(res.success).toBe(true);
        if (res.success) {
            expect(res.data).toBe("stig,høgset@epost.no");
        }
    });
});
