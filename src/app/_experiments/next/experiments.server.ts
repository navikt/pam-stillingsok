import { getConsentValues } from "@navikt/arbeidsplassen-react";
import { appLogger } from "@/app/_common/logging/appLogger";
import { experiments, retiredCookieNames } from "../config";
import { type ExperimentDefinition, isExperimentActive, isValidBucketingId } from "../core/experiments";

// Brukes i proxy: ikke importer `server-only` her.

export const BUCKETING_COOKIE = "ab_uid";
export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

export type CookieChange =
    | Readonly<{ action: "set"; name: string; value: string }>
    | Readonly<{ action: "delete"; name: string }>;

export function assignmentCookieName(key: string): string {
    return `ab_${key}`;
}

/** Navnene appen eier. Ingen wildcard `ab_*`: andre apper på samme host kan eie cookies med det prefikset. */
export function ownedCookieNames(registry: ReadonlyArray<ExperimentDefinition> = experiments): string[] {
    return [
        BUCKETING_COOKIE,
        ...registry.map((definition) => assignmentCookieName(definition.key)),
        ...retiredCookieNames,
    ];
}

export function cookieAttributes(): { httpOnly: true; sameSite: "lax"; secure: boolean; path: "/" } {
    return { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" };
}

/** Fail-closed: ugyldig cookie-header tolkes som at samtykke mangler. */
export function hasAnalyticsConsent(cookieHeader: string | null): boolean {
    if (!cookieHeader) {
        return false;
    }
    try {
        return getConsentValues(cookieHeader).analyticsConsent === true;
    } catch (error) {
        appLogger.warn("Kunne ikke lese samtykke-cookie", {
            errorName: error instanceof Error ? error.name : "unknown",
        });
        return false;
    }
}

export function hasActiveExperiment(registry: ReadonlyArray<ExperimentDefinition>, now: Date): boolean {
    return registry.some((definition) => isExperimentActive(definition, now));
}

/** Alle verdier for et cookienavn, ellers tom liste. Et par uten `=` regnes ikke som verdi. */
export function readCookieValues(cookieHeader: string | null, name: string): string[] {
    if (!cookieHeader) {
        return [];
    }
    const values: string[] = [];
    for (const part of cookieHeader.split(";")) {
        const separator = part.indexOf("=");
        if (separator === -1) {
            continue;
        }
        if (part.slice(0, separator).trim() === name) {
            values.push(part.slice(separator + 1).trim());
        }
    }
    return values;
}

/** Gyldig bare når alle forekomster er like og gyldige. Next og samtykkebiblioteket leser duplikater ulikt. */
export function readBucketingId(cookieHeader: string | null): string | null {
    const values = readCookieValues(cookieHeader, BUCKETING_COOKIE);
    const [first] = values;
    if (first === undefined || !isValidBucketingId(first) || values.some((value) => value !== first)) {
        return null;
    }
    return first;
}

export function generateBucketingId(): string {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Cookie-endringer ved samtykkeendring. */
export function planConsentCookieChanges(
    cookieHeader: string | null,
    registry: ReadonlyArray<ExperimentDefinition> = experiments,
    now: Date = new Date(),
): CookieChange[] {
    if (!hasAnalyticsConsent(cookieHeader)) {
        return ownedCookieNames(registry).map((name) => ({ action: "delete", name }));
    }

    const changes: CookieChange[] = retiredCookieNames.map((name) => ({ action: "delete", name }));
    if (hasActiveExperiment(registry, now) && readBucketingId(cookieHeader) === null) {
        changes.push({ action: "set", name: BUCKETING_COOKIE, value: generateBucketingId() });
    }
    return changes;
}

export function applyCookieChanges(
    cookies: { set: (name: string, value: string, options: Record<string, unknown>) => unknown },
    changes: ReadonlyArray<CookieChange>,
): void {
    for (const change of changes) {
        if (change.action === "set") {
            cookies.set(change.name, change.value, { ...cookieAttributes(), maxAge: COOKIE_MAX_AGE_SECONDS });
        } else {
            cookies.set(change.name, "", { ...cookieAttributes(), maxAge: 0 });
        }
    }
}
