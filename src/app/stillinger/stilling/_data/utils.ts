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
