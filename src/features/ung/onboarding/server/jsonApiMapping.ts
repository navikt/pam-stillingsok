import type { ZodType } from "zod";
import type { SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";
import type {
    JsonApiDocument,
    JsonApiResource,
    JsonApiResourceIdentifier,
} from "@/features/ung/onboarding/server/sharedContentSchemas";

export type ResourceIndex = ReadonlyMap<string, JsonApiResource>;

/** Kastes av adapterne når Shared Content-data ikke følger kontrakten. Fanges av runMapping. */
export class SharedContentMappingError extends Error {
    readonly issuePaths: readonly string[];

    constructor(message: string, issuePaths: readonly string[] = []) {
        super(message);
        this.name = "SharedContentMappingError";
        this.issuePaths = issuePaths;
    }
}

export function runMapping<T>(mapper: () => T): SharedContentResult<T> {
    try {
        return { ok: true, data: mapper() };
    } catch (error) {
        if (error instanceof SharedContentMappingError) {
            return {
                ok: false,
                error: { type: "invalid-contract", message: error.message, issuePaths: error.issuePaths },
            };
        }
        throw error;
    }
}

export function buildResourceIndex(document: JsonApiDocument): ResourceIndex {
    const index = new Map<string, JsonApiResource>();
    for (const resource of [document.data, ...document.included]) {
        const key = resourceKey(resource);
        if (index.has(key)) {
            throw new SharedContentMappingError("Dokumentet har duplikate ressurser", ["included"]);
        }
        index.set(key, resource);
    }
    return index;
}

export function resourceKey(identifier: JsonApiResourceIdentifier): string {
    return `${identifier.type}:${identifier.id}`;
}

export function getResource(
    resources: ResourceIndex,
    identifier: JsonApiResourceIdentifier,
    expectedType?: string,
): JsonApiResource {
    if (expectedType !== undefined && identifier.type !== expectedType) {
        throw new SharedContentMappingError("Relasjonen peker på en uventet ressurstype", ["included"]);
    }
    const resource = resources.get(resourceKey(identifier));
    if (!resource) {
        throw new SharedContentMappingError("Relasjonen peker på en ressurs som mangler i included", ["included"]);
    }
    return resource;
}

export function getRelationshipList(resource: JsonApiResource, relationshipName: string): JsonApiResourceIdentifier[] {
    const data = resource.relationships?.[relationshipName]?.data;
    if (!Array.isArray(data)) {
        throw new SharedContentMappingError(`Mangler liste-relasjon ${relationshipName}`, [
            `relationships.${relationshipName}`,
        ]);
    }
    return data;
}

export function parseAttributes<T>(resource: JsonApiResource, schema: ZodType<T>): T {
    const parsed = schema.safeParse(resource.attributes);
    if (!parsed.success) {
        throw new SharedContentMappingError(
            `Ugyldige attributter for ${resource.type}`,
            parsed.error.issues.map((issue) => `attributes.${issue.path.join(".")}`),
        );
    }
    return parsed.data;
}
