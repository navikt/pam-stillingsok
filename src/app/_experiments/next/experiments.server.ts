import { getConsentValues } from "@navikt/arbeidsplassen-react";
import { appLogger } from "@/app/_common/logging/appLogger";
import { experiments, retiredCookieNames } from "../config";
import {
    type ExperimentDefinition,
    type ExperimentVariant,
    evaluateExperiment,
    isExperimentActive,
    isValidBucketingId,
} from "../core/experiments";

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

export const MARKER_HEADER = "x-ab-new";

export type ExperimentAssignment = Readonly<{
    key: string;
    variant: ExperimentVariant;
    assignmentVersion: number;
    isNew: boolean;
}>;

export function isPrefetchRequest(headers: Headers): boolean {
    return (
        headers.has("next-router-prefetch") ||
        headers.has("next-router-segment-prefetch") ||
        headers.get("purpose") === "prefetch"
    );
}

function hasFileExtension(pathname: string): boolean {
    return /\.[a-z0-9]+$/i.test(pathname.slice(pathname.lastIndexOf("/") + 1));
}

function cookiePartName(part: string): string {
    const separator = part.indexOf("=");
    return (separator === -1 ? part : part.slice(0, separator)).trim();
}

function stripCookies(cookieHeader: string, names: ReadonlySet<string>): string {
    return cookieHeader
        .split(";")
        .filter((part) => part.trim() !== "" && !names.has(cookiePartName(part)))
        .join("; ")
        .trim();
}

function toAssignmentCookieValue(assignmentVersion: number, variant: ExperimentVariant): string {
    return `${assignmentVersion}.${variant}`;
}

function isValidAssignmentCookie(
    values: ReadonlyArray<string>,
    assignmentVersion: number,
    variant: ExperimentVariant,
): boolean {
    const expected = toAssignmentCookieValue(assignmentVersion, variant);
    return values.length > 0 && values.every((value) => value === expected);
}

function isInScope(definition: ExperimentDefinition, pathname: string): boolean {
    return definition.eligiblePathPrefixes.some((prefix) => pathname.startsWith(prefix));
}

function errorName(error: unknown): string {
    return error instanceof Error ? error.name : "unknown";
}

type ExperimentRequestInput = Readonly<{
    method: string;
    /** Endres: innkommende `x-ab-*` fjernes, cookie-headeren bygges på nytt og markør-headeren settes. */
    requestHeaders: Headers;
    pathname: string;
    isRsc: boolean;
    isDocumentRequest: boolean;
}>;

/**
 * Kalles fra proxy. Tildeler varianter, bygger videresendt cookie-header og returnerer cookie-endringer
 * for responsen. Fail-open: en feil gir ingen endringer, aldri 500.
 */
export async function resolveExperimentRequest(
    input: ExperimentRequestInput,
    registry: ReadonlyArray<ExperimentDefinition> = experiments,
    now: Date = new Date(),
): Promise<CookieChange[]> {
    const { requestHeaders, pathname } = input;

    // Samle navnene først: Headers hopper over entries når man sletter under iterasjon.
    const inboundAbHeaders = [...requestHeaders.keys()].filter((name) => name.toLowerCase().startsWith("x-ab-"));
    for (const name of inboundAbHeaders) {
        requestHeaders.delete(name);
    }

    try {
        // Next normaliserer bort RSC-headere før proxyen. Matcheren må derfor
        // filtrere prefetch før vi behandler GET til registrerte eksperimentsider.
        const isPage =
            input.isDocumentRequest || input.isRsc || registry.some((definition) => isInScope(definition, pathname));
        if (input.method !== "GET" || !isPage || isPrefetchRequest(requestHeaders) || hasFileExtension(pathname)) {
            return [];
        }

        const cookieHeader = requestHeaders.get("cookie");
        const owned = new Set(ownedCookieNames(registry));
        const presentOwned = new Set(
            (cookieHeader ?? "")
                .split(";")
                .map(cookiePartName)
                .filter((name) => owned.has(name)),
        );
        const isDocument = input.isDocumentRequest && !input.isRsc;
        const mayCreateId = isDocument && hasActiveExperiment(registry, now);
        if (presentOwned.size === 0 && !mayCreateId) {
            return [];
        }

        const changes: CookieChange[] = [];
        const forwarded: string[] = [];
        const markers: string[] = [];
        const deleteIfPresent = (name: string): void => {
            if (presentOwned.has(name)) {
                changes.push({ action: "delete", name });
            }
        };

        const consent = hasAnalyticsConsent(cookieHeader);
        const bucketingId = consent ? readBucketingId(cookieHeader) : null;

        if (bucketingId === null) {
            for (const name of presentOwned) {
                changes.push({ action: "delete", name });
            }
            // Gyldig ID opprettes uten tildeling i samme request.
            if (consent && mayCreateId) {
                changes.push({ action: "set", name: BUCKETING_COOKIE, value: generateBucketingId() });
            }
        } else {
            forwarded.push(`${BUCKETING_COOKIE}=${bucketingId}`);
            for (const name of retiredCookieNames) {
                deleteIfPresent(name);
            }

            for (const definition of registry) {
                const name = assignmentCookieName(definition.key);
                const evaluation = await evaluateExperiment(definition, bucketingId, now);

                if (evaluation.state !== "assigned") {
                    deleteIfPresent(name);
                    continue;
                }

                const { variant, assignmentVersion } = evaluation;
                if (isValidAssignmentCookie(readCookieValues(cookieHeader, name), assignmentVersion, variant)) {
                    forwarded.push(`${name}=${toAssignmentCookieValue(assignmentVersion, variant)}`);
                } else if (isInScope(definition, pathname)) {
                    const value = toAssignmentCookieValue(assignmentVersion, variant);
                    changes.push({ action: "set", name, value });
                    forwarded.push(`${name}=${value}`);
                    markers.push(`${definition.key}.${assignmentVersion}.${variant}`);
                } else {
                    deleteIfPresent(name);
                }
            }
        }

        const rebuilt = [stripCookies(cookieHeader ?? "", owned), ...forwarded]
            .filter((part) => part !== "")
            .join("; ");
        if (rebuilt === "") {
            requestHeaders.delete("cookie");
        } else {
            requestHeaders.set("cookie", rebuilt);
        }
        if (markers.length > 0) {
            requestHeaders.set(MARKER_HEADER, markers.join(","));
        }

        return changes;
    } catch (error) {
        appLogger.warn("A/B-tildeling feilet, bruker standard", { errorName: errorName(error) });
        return [];
    }
}

const MARKER_PATTERN = /^([a-z][a-z0-9-]{2,39})\.([1-9]\d{0,15})\.(standard|test)$/;

/**
 * Leser tildelinger fra en videresendt request. Stoler ikke på proxy: samtykke, ID, cookie og markør
 * valideres mot registeret og varianten kjernen beregner. Markøren ignoreres på prefetch.
 */
export async function readExperimentAssignments(
    headers: Headers,
    registry: ReadonlyArray<ExperimentDefinition> = experiments,
    now: Date = new Date(),
): Promise<ExperimentAssignment[]> {
    try {
        const cookieHeader = headers.get("cookie");
        if (registry.length === 0 || !hasAnalyticsConsent(cookieHeader)) {
            return [];
        }
        const bucketingId = readBucketingId(cookieHeader);
        if (bucketingId === null) {
            return [];
        }

        const markers = new Set(
            isPrefetchRequest(headers)
                ? []
                : (headers.get(MARKER_HEADER) ?? "").split(",").filter((m) => MARKER_PATTERN.test(m)),
        );

        const assignments: ExperimentAssignment[] = [];
        for (const definition of registry) {
            const evaluation = await evaluateExperiment(definition, bucketingId, now);
            if (evaluation.state !== "assigned") {
                continue;
            }
            const { variant, assignmentVersion } = evaluation;
            const cookieValues = readCookieValues(cookieHeader, assignmentCookieName(definition.key));
            if (!isValidAssignmentCookie(cookieValues, assignmentVersion, variant)) {
                continue;
            }
            assignments.push({
                key: definition.key,
                variant,
                assignmentVersion,
                isNew: markers.has(`${definition.key}.${assignmentVersion}.${variant}`),
            });
        }
        return assignments;
    } catch (error) {
        appLogger.warn("Kunne ikke lese A/B-tildelinger", { errorName: errorName(error) });
        return [];
    }
}
