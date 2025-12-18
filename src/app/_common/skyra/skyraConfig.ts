import { z } from "zod";

export const SkyraConfigSchema = z.object({
    org: z.string().min(1).max(100),
    cookieConsent: z.boolean(),
});

export const escapeJsonForInlineScript = (json: string): string => {
    return json
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");
};

export const createSkyraInlineConfig = (input: unknown): string => {
    const parsed = SkyraConfigSchema.safeParse(input);

    if (!parsed.success) {
        // Fail-safe: sett en “tom” config fremfor å injisere ukjent innhold.
        return 'window.SKYRA_CONFIG = { org: "", cookieConsent: false };';
    }

    const json = JSON.stringify(parsed.data);
    const safeJson = escapeJsonForInlineScript(json);

    return `window.SKYRA_CONFIG = ${safeJson};`;
};
