export type ExperimentVariant = "standard" | "test";
export type ExperimentStatus = "on" | "off";

export type ExperimentDefinition<K extends string = string> = Readonly<{
    key: K;
    status: ExperimentStatus;
    assignmentVersion: number;
    owner: string;
    endsAt: string;
    eligiblePathPrefixes: ReadonlyArray<string>;
}>;

export const EXPERIMENT_KEY_PATTERN = /^[a-z][a-z0-9-]{2,39}$/;

// Nøkkelen `uid` ville gitt cookienavnet `ab_uid`, som er bucketing-ID-en.
const RESERVED_KEYS: ReadonlyArray<string> = ["uid"];

export function isValidAssignmentVersion(version: unknown): version is number {
    return typeof version === "number" && Number.isSafeInteger(version) && version > 0;
}

export function isExperimentActive(definition: ExperimentDefinition, now: Date): boolean {
    const endsAt = Date.parse(definition.endsAt);
    return definition.status === "on" && Number.isFinite(endsAt) && now.getTime() < endsAt;
}

const ISO_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

/** Returnerer en liste med feilmeldinger. Tom liste betyr gyldig register. */
export function validateExperimentRegistry(definitions: ReadonlyArray<ExperimentDefinition>, now: Date): string[] {
    const errors: string[] = [];
    const seen = new Set<string>();

    for (const definition of definitions) {
        const label = `Eksperiment "${definition.key}"`;

        if (!EXPERIMENT_KEY_PATTERN.test(definition.key) || RESERVED_KEYS.includes(definition.key)) {
            errors.push(`${label}: ugyldig nøkkel`);
        }
        if (seen.has(definition.key)) {
            errors.push(`${label}: duplisert nøkkel`);
        }
        seen.add(definition.key);

        if (definition.status !== "on" && definition.status !== "off") {
            errors.push(`${label}: ugyldig status`);
        }
        if (!isValidAssignmentVersion(definition.assignmentVersion)) {
            errors.push(`${label}: assignmentVersion må være et positivt heltall`);
        }
        if (definition.owner.trim() === "") {
            errors.push(`${label}: mangler eier`);
        }

        const endsAt = Date.parse(definition.endsAt);
        if (!ISO_WITH_OFFSET.test(definition.endsAt) || !Number.isFinite(endsAt)) {
            errors.push(`${label}: endsAt må være ISO 8601 med tidssone`);
        } else if (definition.status === "on" && endsAt <= now.getTime()) {
            errors.push(`${label}: aktivt eksperiment er utløpt`);
        }

        if (definition.eligiblePathPrefixes.length === 0) {
            errors.push(`${label}: eligiblePathPrefixes kan ikke være tom`);
        }
        for (const prefix of definition.eligiblePathPrefixes) {
            if (!prefix.startsWith("/")) {
                errors.push(`${label}: path-prefix må starte med "/"`);
            }
        }
    }

    return errors;
}

// Endres algoritmen, må versjonen under økes. Da får alle brukere ny fordeling.
export const ALGORITHM_VERSION = "v1";

const BUCKETING_ID_PATTERN = /^[0-9a-f]{32}$/;

export function isValidBucketingId(value: unknown): value is string {
    return typeof value === "string" && BUCKETING_ID_PATTERN.test(value);
}

export function buildHashInput(key: string, assignmentVersion: number, bucketingId: string): string {
    return JSON.stringify([ALGORITHM_VERSION, key, assignmentVersion, bucketingId]);
}

/** Øverste bit i første byte av SHA-256: 0 gir `standard`, 1 gir `test`. */
export async function computeVariant(
    key: string,
    assignmentVersion: number,
    bucketingId: string,
): Promise<ExperimentVariant> {
    if (!isValidAssignmentVersion(assignmentVersion) || !isValidBucketingId(bucketingId)) {
        throw new RangeError("Ugyldig assignmentVersion eller bucketingId");
    }

    const input = new TextEncoder().encode(buildHashInput(key, assignmentVersion, bucketingId));
    const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", input));
    return (digest[0] & 0x80) === 0 ? "standard" : "test";
}

export type ExperimentEvaluation =
    | Readonly<{ state: "assigned"; variant: ExperimentVariant; assignmentVersion: number }>
    | Readonly<{ state: "off" | "expired" | "invalid"; variant: "standard" }>;

export async function evaluateExperiment(
    definition: ExperimentDefinition,
    bucketingId: string,
    now: Date,
): Promise<ExperimentEvaluation> {
    if (definition.status === "off") {
        return { state: "off", variant: "standard" };
    }
    if (!isExperimentActive(definition, now)) {
        return { state: "expired", variant: "standard" };
    }
    if (!isValidAssignmentVersion(definition.assignmentVersion) || !isValidBucketingId(bucketingId)) {
        return { state: "invalid", variant: "standard" };
    }

    const variant = await computeVariant(definition.key, definition.assignmentVersion, bucketingId);
    return { state: "assigned", variant, assignmentVersion: definition.assignmentVersion };
}
