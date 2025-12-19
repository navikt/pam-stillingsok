import { z } from "zod";

export const SkyraConfigSchema = z.object({
    org: z.string().min(1).max(100),
    cookieConsent: z.boolean(),
});

/**
 * Gjør JSON trygt å sette inn i en inline <script>-tag.
 *
 * Hvorfor: JSON.stringify() escaper ikke "<" / ">" / "&". Hvis en strengverdi
 * inneholder f.eks. "</script>", kan den i verste fall terminere script-taggen
 * og injisere ny JS (klassisk "script-breakout" XSS) når innholdet settes inn i HTML.
 *
 * Løsning: Escaper tegn som kan påvirke HTML-parseren (<, >, &) til \uXXXX.
 * I tillegg escaper vi U+2028/U+2029, som kan gi parse-feil i JS når JSON brukes i script-kontekst.
 */
export const escapeJsonForInlineScript = (json: string): string => {
    return json
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");
};

export const createSkyraInlineConfig = (input: unknown): string => {
    /**
     * Validerer runtime-config før vi serialiserer den inn i en script-tag.
     *
     * Hvorfor: Verdier som kommer fra runtime (cookies/headers/env) kan være uventede,
     * og vi ønsker å:
     *  - sikre at vi kun skriver ut feltene vi forventer (org + cookieConsent)
     *  - sikre riktige typer (cookieConsent må være boolean)
     *  - ha en fail-safe oppførsel (ikke injiser ukjent innhold i en "trusted" script-tag)
     */
    const parsed = SkyraConfigSchema.safeParse(input);

    if (!parsed.success) {
        // Fail-safe: sett en “tom” config fremfor å injisere ukjent innhold.
        return 'window.SKYRA_CONFIG = { org: "", cookieConsent: false };';
    }

    const json = JSON.stringify(parsed.data);
    const safeJson = escapeJsonForInlineScript(json);

    return `window.SKYRA_CONFIG = ${safeJson};`;
};
