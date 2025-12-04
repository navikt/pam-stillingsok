import { z } from "zod";
import type { AdDTO } from "../schemas/ad.dto";
import { err, type Result } from "@/app/stillinger/_common/lib/ad-model/core/result";
import { type ParseError, summarizeZodIssues } from "@/app/stillinger/_common/lib/ad-model/core/error-types";
import { LegacyAdSchema } from "../schemas/legacy.schemas";
import { transformAdDataLegacy } from "@/app/stillinger/_common/lib/ad-model/transform/transform";

export type ElasticDocHit<TSource> = Readonly<{
    _index: string;
    _id: string;
    _version?: number;
    _seq_no?: number;
    _primary_term?: number;
    found?: boolean;
    _source: TSource;
}>;

const ElasticHitSchema = z.object({
    _index: z.string(),
    _id: z.union([z.string(), z.number()]).transform(String),
    _source: LegacyAdSchema,
});

export function elasticHitToAdDTOResult(hit: unknown): Result<AdDTO, ParseError> {
    const safeParse = ElasticHitSchema.safeParse(hit);
    if (!safeParse.success) {
        const { summary, lite } = summarizeZodIssues(safeParse.error.issues);
        return err({ kind: "SchemaMismatch", summary, issues: lite });
    }

    const { _index, _id, _source } = safeParse.data;
    const legacy = { ..._source, id: _id };

    const result = transformAdDataLegacy(legacy); // Result<AdDTO, ParseError>
    if (result.ok) return result;
    return err({ ...result.error, index: _index, id: _id });
}
