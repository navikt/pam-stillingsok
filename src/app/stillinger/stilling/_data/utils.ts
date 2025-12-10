import { containsEmail, extractEmail, isValidEmail, mailtoInString } from "@/app/stillinger/_common/utils/utils";
import { sanitizeHtml } from "@/server/utils/htmlSanitizer";

export function getDate(date: unknown): Date | undefined {
    return isIsoString(date) ? new Date(date) : undefined;
}

export function getExtent(extent: string | string[] | undefined): string | string[] | undefined {
    return typeof extent === "string" || Array.isArray(extent) ? extent : undefined;
}

export function addPercentageAtEnd(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }

    return value.endsWith("%") ? value : `${value}%`;
}

export function getAdText(adText: string | undefined): string | undefined {
    if (!adText) {
        return undefined;
    }
    let processedAdText = adText;
    if (containsEmail(adText)) {
        try {
            const extractedEmails = [...extractEmail(adText)];
            let preprocessedAd = processedAdText.replace(/&#64;/g, "@");
            extractedEmails.forEach((it) => {
                if (isValidEmail(it) && !mailtoInString(preprocessedAd, it)) {
                    preprocessedAd = preprocessedAd.replace(it, `<a rel="nofollow" href="mailto:${it}">${it}</a>`);
                }
            });
            processedAdText = preprocessedAd;
        } catch {
            processedAdText = adText;
        }
    }
    // TODO: double check that sanitizing doesn't remove <section>
    return sanitizeHtml(processedAdText);
}

export function getWorktime(worktime: string | string[] | undefined): string | undefined {
    // Can be one of multiple inputs:
    // "Ukedager Søndag"
    // "Turnus"
    // ["Natt"]
    // ["Ukedager","Søndag"]

    if (!worktime) {
        return undefined;
    }
    if (Array.isArray(worktime)) {
        return worktime.filter((e) => typeof e === "string").join(", ");
    }

    try {
        const parsed = JSON.parse(worktime);

        // Return empty string if the parsed value is an object (not an array or string)
        if (typeof parsed === "object" && !Array.isArray(parsed)) {
            return "";
        }

        // If it's an array, filter strings and join
        if (Array.isArray(parsed)) {
            return parsed.filter((e) => typeof e === "string").join(", ");
        }

        // Return original worktime if it's not an object or array
        return worktime;
    } catch {
        // Return original worktime if parsing fails
        return worktime;
    }
}

export function isIsoString(value: unknown): value is string {
    return typeof value === "string" && !Number.isNaN(Date.parse(value));
}
