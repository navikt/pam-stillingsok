import { type ZodType, z } from "zod";
import type { SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";

/*
 * Drupal JSON:API i korte trekk:
 * - `data` er ressursen (eller lista) vi ba om, f.eks. en artikkel (`node--shared_content`).
 * - `relationships` på en ressurs peker til andre ressurser med `{ type, id }`.
 * - `included` inneholder ressursene relasjonene peker på, når vi ber om dem med `include`.
 * Zod-schemaene under er kontrakten mot API-et, og typene utledes fra dem. Zod fjerner ukjente felt,
 * så bare feltene vi bruker blir med videre. Hjelperne nederst slår opp relasjoner i `included`.
 */

const MAX_HREF_LENGTH = 2048;

const resourceIdentifierSchema = z.object({
    type: z.string().min(1),
    id: z.string().min(1),
    // Drupal legger alt/title/width/height i meta på identifikatoren for bilde-felt
    // (f.eks. media--image sin field_media_image).
    meta: z.record(z.string(), z.unknown()).optional(),
});

const relationshipSchema = z.object({
    data: z.union([resourceIdentifierSchema, z.array(resourceIdentifierSchema), z.null()]),
});

const resourceSchema = z.object({
    type: z.string().min(1),
    id: z.string().min(1),
    attributes: z.record(z.string(), z.unknown()),
    relationships: z.record(z.string(), relationshipSchema.optional()).optional(),
});

// Drupal JSON:API kan returnere `included: null` i stedet for en tom liste, typisk når
// forespørselen faller tilbake til en consumer uten tilgang (manglende eller ugyldig api-key).
const includedSchema = z
    .array(resourceSchema)
    .nullish()
    .transform((value) => value ?? []);

const jsonApiDocumentSchema = z.object({
    data: resourceSchema,
    included: includedSchema,
});

const jsonApiCollectionSchema = z.object({
    data: z.array(resourceSchema),
    included: includedSchema,
    links: z
        .object({
            next: z.object({ href: z.string().min(1).max(MAX_HREF_LENGTH) }).optional(),
        })
        .optional(),
});

// Webform-quizen ligger som YAML i elements_combined (eller elements i eldre svar).
const webformYamlSchema = z
    .object({
        data: z.object({
            attributes: z.object({
                elements_combined: z.string().optional(),
                elements: z.string().optional(),
            }),
        }),
    })
    .transform(({ data: { attributes } }, context) => {
        const yaml = attributes.elements_combined ?? attributes.elements;
        if (yaml === undefined) {
            context.addIssue({
                code: "custom",
                message: "Mangler elementer",
                path: ["data", "attributes", "elements_combined"],
            });
            return z.NEVER;
        }
        return yaml;
    });

/** Peker fra en relasjon til en ressurs i `data` eller `included`. */
export type JsonApiResourceIdentifier = z.infer<typeof resourceIdentifierSchema>;
/** Én Drupal-entitet, f.eks. en artikkel (`node--shared_content`) eller en blokk (`paragraph--*`). */
export type JsonApiResource = z.infer<typeof resourceSchema>;
/** Svar med én ressurs i `data` og relaterte ressurser i `included`. */
export type JsonApiDocument = z.infer<typeof jsonApiDocumentSchema>;
/** Svar med en liste ressurser i `data`. `links.next` peker på neste side. */
export type JsonApiCollectionDocument = z.infer<typeof jsonApiCollectionSchema>;

export function safeParseSharedContentDocument(input: unknown): SharedContentResult<JsonApiDocument> {
    return safeParseContract(jsonApiDocumentSchema, input);
}

export function safeParseSharedContentCollection(input: unknown): SharedContentResult<JsonApiCollectionDocument> {
    return safeParseContract(jsonApiCollectionSchema, input);
}

export function safeParseWebformYaml(input: unknown): SharedContentResult<string> {
    return safeParseContract(webformYamlSchema, input);
}

function safeParseContract<T>(schema: z.ZodType<T>, input: unknown): SharedContentResult<T> {
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
        return {
            ok: false,
            error: {
                type: "invalid-contract",
                message: "Shared Content-svaret følger ikke JSON:API-kontrakten",
                issuePaths: parsed.error.issues.map((issue) => (issue.path.length > 0 ? issue.path.join(".") : "$")),
            },
        };
    }
    return { ok: true, data: parsed.data };
}

// --- Oppslag i JSON:API-dokumenter ---

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
