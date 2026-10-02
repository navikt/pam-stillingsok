import { z } from "zod";
import type { SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";

// Zod-schemaene er kontrakten mot Drupal JSON:API, og typene under utledes fra dem.
// Zod fjerner ukjente felt, så bare feltene vi bruker blir med videre.

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
