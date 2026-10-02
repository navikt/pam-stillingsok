import { z } from "zod";
import type {
    JsonApiCollectionDocument,
    JsonApiDocument,
    WebformDocument,
} from "@/features/ung/onboarding/server/jsonApiTypes";

export type SharedContentContractIssue = Readonly<{
    path: string;
    message: string;
}>;

export type SharedContentContractResult =
    | Readonly<{
          ok: true;
          data: JsonApiDocument;
      }>
    | Readonly<{
          ok: false;
          issues: readonly SharedContentContractIssue[];
      }>;

const resourceIdentifierSchema = z.object({
    type: z.string().min(1),
    id: z.string().min(1),
});

const relationshipSchema = z.object({
    data: z.union([resourceIdentifierSchema, z.array(resourceIdentifierSchema), z.null()]),
});

const resourceSchema = z.object({
    type: z.string().min(1),
    id: z.string().min(1),
    attributes: z.record(z.string(), z.unknown()),
    relationships: z.record(z.string(), relationshipSchema).optional(),
});

// Drupal JSON:API kan returnere `included: null` i stedet for en tom liste, typisk når
// forespørselen faller tilbake til en consumer uten tilgang (manglende eller ugyldig api-key).
const includedSchema = z
    .array(resourceSchema)
    .nullish()
    .transform((value) => value ?? []);

const jsonApiDocumentSchema = z.object({
    jsonapi: z
        .object({
            version: z.string().min(1),
        })
        .optional(),
    data: resourceSchema,
    included: includedSchema,
});

export function safeParseSharedContentDocument(input: unknown): SharedContentContractResult {
    const parsed = jsonApiDocumentSchema.safeParse(input);

    if (!parsed.success) {
        return {
            ok: false,
            issues: parsed.error.issues.map((issue) => ({
                path: issue.path.length > 0 ? issue.path.join(".") : "$",
                message: issue.message,
            })),
        };
    }

    return {
        ok: true,
        data: parsed.data satisfies JsonApiDocument,
    };
}

export type SharedContentCollectionContractResult =
    | Readonly<{
          ok: true;
          data: JsonApiCollectionDocument;
      }>
    | Readonly<{
          ok: false;
          issues: readonly SharedContentContractIssue[];
      }>;

export type WebformContractResult =
    | Readonly<{
          ok: true;
          data: WebformDocument;
      }>
    | Readonly<{
          ok: false;
          issues: readonly SharedContentContractIssue[];
      }>;

const MAX_HREF_LENGTH = 2048;

const hrefLinkSchema = z.object({
    href: z.string().min(1).max(MAX_HREF_LENGTH),
});

const jsonApiCollectionSchema = z.object({
    jsonapi: z
        .object({
            version: z.string().min(1),
        })
        .optional(),
    data: z.array(resourceSchema),
    included: includedSchema,
    links: z
        .object({
            next: hrefLinkSchema.optional(),
        })
        .optional(),
    meta: z
        .object({
            count: z.number().int().nonnegative().optional(),
            omitted: z
                .object({
                    links: z.record(z.string(), z.unknown()).default({}),
                })
                .optional(),
        })
        .optional(),
});

const webformAttributesSchema = z.object({
    title: z.string().optional(),
    elements_combined: z.string().optional(),
    elements: z.string().optional(),
});

function toIssues(error: z.ZodError): SharedContentContractIssue[] {
    return error.issues.map((issue) => ({
        path: issue.path.length > 0 ? issue.path.join(".") : "$",
        message: issue.message,
    }));
}

export function safeParseSharedContentCollection(input: unknown): SharedContentCollectionContractResult {
    const parsed = jsonApiCollectionSchema.safeParse(input);
    if (!parsed.success) {
        return { ok: false, issues: toIssues(parsed.error) };
    }

    const { jsonapi, data, included, links, meta } = parsed.data;
    const omittedLinks = Object.fromEntries(
        Object.entries(meta?.omitted?.links ?? {}).flatMap(([key, value]) => {
            const link = hrefLinkSchema.safeParse(value);
            return link.success ? [[key, link.data.href] as const] : [];
        }),
    );

    return {
        ok: true,
        data: {
            ...(jsonapi ? { jsonapi } : {}),
            data,
            included,
            ...(links?.next ? { links: { next: links.next.href } } : {}),
            ...(meta
                ? {
                      meta: {
                          ...(meta.count === undefined ? {} : { count: meta.count }),
                          ...(meta.omitted ? { omitted: { links: omittedLinks } } : {}),
                      },
                  }
                : {}),
        },
    };
}

export function safeParseWebformDocument(input: unknown): WebformContractResult {
    const parsed = safeParseSharedContentDocument(input);
    if (!parsed.ok) {
        return parsed;
    }

    const attributes = webformAttributesSchema.safeParse(parsed.data.data.attributes);
    if (!attributes.success) {
        return { ok: false, issues: toIssues(attributes.error) };
    }

    const yaml = attributes.data.elements_combined ?? attributes.data.elements;
    if (yaml === undefined) {
        return { ok: false, issues: [{ path: "data.attributes.elements_combined", message: "Mangler elementer" }] };
    }

    return {
        ok: true,
        data: {
            id: parsed.data.data.id,
            ...(attributes.data.title === undefined ? {} : { title: attributes.data.title }),
            yaml,
        },
    };
}
