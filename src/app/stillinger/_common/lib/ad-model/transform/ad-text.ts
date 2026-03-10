import { sanitizeHtml } from "@/app/_common/utils/htmlSanitizer";
import { linkifyEmailAddressesInHtml } from "@/app/stillinger/_common/lib/ad-model/transform/linkifyEmailAddressesInHtml";

/** Sanitiserer annonsetekst og linkifiserer e-postadresser. */
export function sanitizeAdText(html: unknown): string | null {
    if (typeof html !== "string") return null;
    const trimmed = html.trim();
    if (!trimmed) return null;

    const linked = linkifyEmailAddressesInHtml(trimmed);
    return sanitizeHtml(linked);
}
