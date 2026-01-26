import { z } from "zod";
import { sanitizeHtml } from "@/server/utils/htmlSanitizer";

const LocationSchema = z.object({
    country: z.string(),
    address: z.string().nullable(),
    city: z.string().nullable(),
    postalCode: z.string().nullable(),
    county: z.string().nullable(),
    municipal: z.string().nullable(),
});

const CategorySchema = z.object({
    code: z.string().optional(),
    categoryType: z.string(),
    name: z.string(),
    description: z.string().optional().nullable(),
    parentId: z.number().optional().nullable(),
});

const OccupationSchema = z.object({
    level1: z.string(),
    level2: z.string(),
});

export const SearchTagSchema = z.object({
    label: z.string(),
    score: z.number(),
});

const PropertySchema = z.object({
    workLanguage: z.array(z.string()).optional(),
    applicationdue: z.string().optional(),
    jobtitle: z.string().optional(),
    searchtags: z.array(SearchTagSchema).optional(),
    searchtagsai: z.array(z.string()).optional(),
    keywords: z.string().optional(),
    adtext: z.string().optional(),
    adtextFormat: z.string().optional(),
    employer: z.string().optional(),
    remote: z.string().optional(),
    needDriversLicense: z.array(z.string()).optional(),
    hasInterestform: z.string().optional(),
});

const SummerJobMetadataSchema = z.object({
    isSummerJob: z.boolean(),
    reason: z.string(),
});

const GeneratedSearchMetadataSchema = z.object({
    summerJobMetadata: SummerJobMetadataSchema.optional(),
    isUnder18: z.boolean().optional(),
    isUnder18Reason: z.string().optional(),
});

const SourceSchema = z.object({
    uuid: z.string(),
    score: z.number().optional(),
    source: z.string(),
    medium: z.string(),
    expires: z.string(),
    businessName: z.string(),
    employer: z.object({ name: z.string() }).optional(),
    published: z.string(),
    title: z.string(),
    reference: z.string(),
    locationList: z.array(LocationSchema).optional(),
    categoryList: z.array(CategorySchema).optional(),
    occupationList: z.array(OccupationSchema),
    properties: PropertySchema.passthrough().optional(),
    status: z.string().optional(),
    generatedSearchMetadata: GeneratedSearchMetadataSchema.optional(),
});

const explanationBaseSchema = z.object({
    description: z.string(),
    value: z.number(),
});

type explanationDetails = z.infer<typeof explanationBaseSchema> & {
    details: explanationDetails[];
};
const ExplanationSchema: z.ZodType<explanationDetails> = explanationBaseSchema.extend({
    details: z.lazy(() => ExplanationSchema.array()),
});

const HitSchema = z.object({
    _shard: z.string().optional(),
    _node: z.string().optional(),
    _index: z.string(),
    _id: z.string(),
    _score: z.number().nullable(),
    _source: SourceSchema,
    sort: z.array(z.union([z.number(), z.string()])).optional(),
    _explanation: ExplanationSchema.optional(),
});

const AggregationBucketSchema = z.object({
    key: z.string(),
    doc_count: z.number(),
});

const AggregationSchema = z.object({
    meta: z.object({}).passthrough().optional(),
    doc_count: z.number(),
    values: z
        .object({
            doc_count_error_upper_bound: z.number().optional(),
            sum_other_doc_count: z.number().optional(),
            buckets: z.array(AggregationBucketSchema).optional(),
        })
        .optional(),
});
const categorySchema = z.object({
    doc_count: z.number(),
});

const categoriesSchema = z.record(z.string(), categorySchema);

const AggregationSchemaWithRecordBuckets = z.object({
    meta: z.object({}).passthrough().optional(),
    doc_count: z.number(),
    values: z
        .object({
            doc_count_error_upper_bound: z.number().optional(),
            sum_other_doc_count: z.number().optional(),
            buckets: categoriesSchema.optional(),
        })
        .optional(),
});

export const AggregationsSchema = z.object({
    totalInternational: z.number().optional(),
    extent: AggregationSchemaWithRecordBuckets,
    under18: AggregationSchema,
    education: AggregationSchema,
    positioncount: z.object({
        meta: z.object({}).passthrough().optional(),
        doc_count: z.number(),
        sum: z.object({
            value: z.number(),
        }),
    }),
    engagementType: AggregationSchema,
    countries: z.object({
        meta: z.object({}).passthrough().optional(),
        doc_count: z.number(),
        nestedLocations: z.object({
            doc_count: z.number(),
            values: z.object({
                doc_count_error_upper_bound: z.number(),
                sum_other_doc_count: z.number(),
                buckets: z.array(AggregationBucketSchema).optional(),
            }),
        }),
    }),
    published: z.object({
        meta: z.object({}).passthrough().optional(),
        doc_count: z.number(),
        range: z.object({
            buckets: z
                .array(
                    z.object({
                        key: z.string(),
                        from: z.number(),
                        from_as_string: z.string(),
                        doc_count: z.number(),
                    }),
                )
                .optional(),
        }),
    }),
    occupations: z.object({
        meta: z.object({}).passthrough().optional(),
        doc_count: z.number(),
        nestedOccupations: z.object({
            doc_count: z.number(),
            occupationFirstLevels: z.object({
                doc_count_error_upper_bound: z.number(),
                sum_other_doc_count: z.number(),
                buckets: z
                    .array(
                        z.object({
                            key: z.string(),
                            doc_count: z.number(),
                            occupationSecondLevels: z.object({
                                doc_count_error_upper_bound: z.number(),
                                sum_other_doc_count: z.number(),
                                buckets: z.array(
                                    z.object({
                                        key: z.string(),
                                        doc_count: z.number(),
                                        root_doc_count: z.object({
                                            doc_count: z.number(),
                                        }),
                                    }),
                                ),
                            }),
                            root_doc_count: z.object({
                                doc_count: z.number(),
                            }),
                        }),
                    )
                    .optional(),
            }),
        }),
    }),
    experience: AggregationSchema,
    remote: AggregationSchema,
    needDriversLicense: AggregationSchema,
    workLanguage: AggregationSchema.optional(),
    counties: z.object({
        meta: z.object({}).passthrough().optional(),
        doc_count: z.number(),
        nestedLocations: z.object({
            doc_count: z.number(),
            values: z.object({
                doc_count_error_upper_bound: z.number(),
                sum_other_doc_count: z.number(),
                buckets: z
                    .array(
                        z.object({
                            key: z.string(),
                            doc_count: z.number(),
                            municipals: z.object({
                                doc_count_error_upper_bound: z.number(),
                                sum_other_doc_count: z.number(),
                                buckets: z
                                    .array(
                                        z.object({
                                            key: z.string(),
                                            doc_count: z.number(),
                                        }),
                                    )
                                    .optional(),
                            }),
                            root_doc_count: z.object({
                                doc_count: z.number(),
                            }),
                        }),
                    )
                    .optional(),
            }),
        }),
    }),
    sector: AggregationSchema,
});
const _Stilling = HitSchema.transform(mapHits);
const ShardsSchema = z.object({
    total: z.number(),
    successful: z.number(),
    skipped: z.number(),
    failed: z.number(),
});
const HitsSchema = z.object({
    total: z.object({
        value: z.number(),
        relation: z.string(),
    }),
    max_score: z.number().nullable(),
    hits: z.array(HitSchema),
});
export const StillingSoekResponseSchema = z.object({
    took: z.number(),
    timed_out: z.boolean(),
    _shards: ShardsSchema,
    hits: HitsSchema,
    aggregations: AggregationsSchema,
});
export const SommerjobbSoekResponseSchema = z.object({
    took: z.number(),
    timed_out: z.boolean(),
    _shards: ShardsSchema,
    hits: HitsSchema,
});

export const LignenendeAnnonserResponseSchema = z.object({
    took: z.number(),
    timed_out: z.boolean(),
    _shards: ShardsSchema.optional(),
    hits: HitsSchema,
});

export type StillingSoekResponse = z.infer<typeof StillingSoekResponseSchema>;
export type HitRaw = z.infer<typeof HitSchema>;
export type StillingSoekResponseExplanation = z.infer<typeof ExplanationSchema>;
export type StillingSoekElement = z.infer<typeof _Stilling>;
export type SommerjobbSoekResponse = z.infer<typeof SommerjobbSoekResponseSchema>;
export type LignendeAnnonserResponse = z.infer<typeof LignenendeAnnonserResponseSchema>;

/**
 * TODO: Når vi er klar for å gi feilmelding når datamodell ikke stemmer med zod-schema, kan vi gjøre transformason
 * direkte her med zod så slipper vi å ha simplifySearchResponse.ts
 * @param data
 */
export function mapHits(data: HitRaw) {
    const rawDescription = data._source.properties?.adtext ?? "";
    return {
        uuid: data._source.uuid,
        score: data._score,
        source: data._source.source,
        keywords: data._source.properties?.keywords,
        published: data._source.published,
        jobTitle: data._source.properties?.jobtitle,
        title: data._source.title,
        description: sanitizeHtml(rawDescription), // brukt for sommerjobb, kan fjernes hvis sommerjobb er fjernet
        searchtags: data._source.properties?.searchtags,
        searchtagsai: data._source.properties?.searchtagsai,
        applicationDue: data._source.properties?.applicationdue,
        locationList: data._source.locationList,
        location: "",
        categoryList: data._source.categoryList,
        hasSuperraskSoknad: data._source.properties?.hasInterestform,
        employer: {
            name: getEmployerName(data),
        },
        explanation: data._explanation,
        reference: data._source.reference,
        status: data._source.status,
        expires: data._source.expires,
    };
}

export function getEmployerName(data: HitRaw): string | undefined {
    if (data._source.properties?.employer) {
        return data._source.properties.employer;
    }
    if (data._source.businessName) {
        return data._source.businessName;
    }
    if (data._source.employer) {
        return data._source.employer.name;
    }

    return undefined;
}
