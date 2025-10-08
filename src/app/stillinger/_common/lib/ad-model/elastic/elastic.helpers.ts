import { z } from "zod";
import type { AdDTO } from "../schemas/ad.dto";
import { err, type Result } from "@/app/stillinger/_common/lib/ad-model/core/result";
import { type ParseError, summarizeZodIssues } from "@/app/stillinger/_common/lib/ad-model/core/error-types";
import { LegacyAd as LegacyAdSchema } from "../schemas/legacy.schemas";
import { transformAdDataLegacy } from "@/app/stillinger/_common/lib/ad-model/transform/transform"; // Zod-schemaet

/** ES Get API / Search hit – minimal, sterktypet wrapper rundt _source */
export type ElasticDocHit<TSource> = Readonly<{
    _index: string;
    _id: string;
    _version?: number;
    _seq_no?: number;
    _primary_term?: number;
    found?: boolean; // finnes i Get API
    _source: TSource;
}>;

const ElasticHitSchema = z.object({
    _index: z.string(),
    _id: z.union([z.string(), z.number()]).transform(String),
    _source: LegacyAdSchema,
});

export function elasticHitToAdDTOResult(hit: unknown): Result<AdDTO, ParseError> {
    const p = ElasticHitSchema.safeParse(hit);
    if (!p.success) {
        const { summary, lite } = summarizeZodIssues(p.error.issues);
        return err({ kind: "SchemaMismatch", summary, issues: lite });
    }

    const { _index, _id, _source } = p.data;
    const legacy = { ..._source, id: _id };

    const r = transformAdDataLegacy(legacy); // Result<AdDTO, ParseError>
    if (r.ok) return r;
    return err({ ...r.error, index: _index, id: _id }); // id/index er optional i ParseError
}
