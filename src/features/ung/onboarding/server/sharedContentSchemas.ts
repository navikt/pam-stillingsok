import { z } from "zod";
import type { JsonApiDocument } from "@/features/ung/onboarding/server/jsonApiTypes";

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

const jsonApiDocumentSchema = z.object({
    jsonapi: z
        .object({
            version: z.string().min(1),
        })
        .optional(),
    data: resourceSchema,
    included: z.array(resourceSchema).default([]),
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
