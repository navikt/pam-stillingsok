import { isValidUrl } from "@/app/stillinger/_common/utils/utilsts";

export const toIsoDate = (value: unknown): string | undefined => {
    if (value == null) return undefined;
    const s = typeof value === "string" ? value : value instanceof Date ? value.toISOString() : String(value);
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
};

export const toUrl = (value: unknown): string | undefined => {
    if (value == null || typeof value !== "string") {
        return undefined;
    }

    if (isValidUrl(value)) {
        // Legg til https:// om protokollen mangler
        if (!/^https?:\/\//i.test(value)) {
            return `https://${value}`;
        }
        return value;
    } else {
        //logger.warn(`getUrl - Ugyldig url: ${value}`);
        return undefined;
    }
};

export const toEmail = (value: unknown): string | undefined => {
    if (typeof value !== "string") return undefined;
    const s = value.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : undefined;
};

export const toInt = (value: unknown): number | undefined => {
    if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
    if (typeof value === "string") {
        const n = Number.parseInt(value, 10);
        return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
};

export const toPercent = (value: unknown): string | undefined => {
    if (typeof value !== "string") return undefined;
    const d = value.replace(/\s|%/g, "");
    return /^\d{1,3}$/.test(d) ? `${d}%` : undefined;
};

export const toPercentRange = (value: unknown): string | undefined => {
    if (typeof value !== "string") return undefined;
    const m = value.match(/(\d{1,3})\s*%?\s*[-–]\s*(\d{1,3})\s*%?/);
    return m ? `${m[1]}% - ${m[2]}%` : undefined;
};

export const isNonEmptyString = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;

const splitCsv = (s: string): string[] =>
    s
        .split(/\s*,\s*/)
        .map((x) => x.trim())
        .filter((x): x is string => x.length > 0);

export const toStringArray = (value: unknown): string[] | undefined => {
    if (Array.isArray(value)) {
        return value.filter(isNonEmptyString).map((s) => s.trim());
    }

    if (typeof value !== "string") {
        return undefined;
    }

    const t = value.trim();

    if (t.startsWith("[")) {
        try {
            const parsed: unknown = JSON.parse(t);
            return Array.isArray(parsed) ? parsed.filter(isNonEmptyString).map((s) => s.trim()) : [t];
        } catch {
            // fall gjennom til CSV-splitting under
        }
    }

    return splitCsv(t);
};

export const cleanString = (value: unknown): string | undefined => {
    if (typeof value !== "string") return undefined;
    const s = value.trim();
    return s.length ? s : undefined;
};
