import { isValidUrl } from "@/app/stillinger/_common/utils/utilsts";

export const toIsoDate = (value: unknown): string | null => {
    if (value == null) return null;
    const s = typeof value === "string" ? value : value instanceof Date ? value.toISOString() : String(value);
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

export const toUrl = (value: unknown): string | null => {
    if (value == null || typeof value !== "string") {
        return null;
    }

    if (isValidUrl(value)) {
        // Legg til https:// om protokollen mangler
        if (!/^https?:\/\//i.test(value)) {
            return `https://${value}`;
        }
        return value;
    } else {
        //logger.warn(`getUrl - Ugyldig url: ${value}`);
        return null;
    }
};

export const toEmail = (value: unknown): string | null => {
    if (typeof value !== "string") return null;
    const s = value.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : null;
};

export const toInt = (value: unknown): number | null => {
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    if (typeof value === "string") {
        const n = Number.parseInt(value, 10);
        return Number.isFinite(n) ? n : null;
    }
    return null;
};

export const toPercent = (value: unknown): string | null => {
    if (typeof value !== "string") return null;
    const d = value.replace(/\s|%/g, "");
    return /^\d{1,3}$/.test(d) ? `${d}%` : null;
};

export const toPercentRange = (value: unknown): string | null => {
    if (typeof value !== "string") return null;
    const m = value.match(/(\d{1,3})\s*%?\s*[-–]\s*(\d{1,3})\s*%?/);
    return m ? `${m[1]}% - ${m[2]}%` : null;
};

export const isNonEmptyString = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;

const splitCsv = (s: string): string[] =>
    s
        .split(/\s*,\s*/)
        .map((x) => x.trim())
        .filter((x): x is string => x.length > 0);

export const toStringArray = (value: unknown): string[] | null => {
    if (Array.isArray(value)) {
        return value.filter(isNonEmptyString).map((s) => s.trim());
    }

    if (typeof value !== "string") {
        return null;
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

export const cleanString = (value: unknown): string | null => {
    if (typeof value !== "string") return null;
    const s = value.trim();
    return s.length ? s : null;
};
