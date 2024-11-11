import { z } from "zod";

const LocationSchema = z.object({
    country: z.string(),
    address: z.string().nullable(),
    city: z.string().nullable(),
    postalCode: z.string().nullable(),
    county: z.string().nullable(),
    municipal: z.string().nullable(),
});

const CategorySchema = z.object({
    id: z.number().optional(),
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

const PropertySchema = z.object({
    workLanguage: z.array(z.string()).optional(),
    applicationdue: z.string().optional(),
    jobtitle: z.string().optional(),
    searchtags: z
        .array(
            z.object({
                score: z.number(),
                label: z.string(),
            }),
        )
        .optional(),
    adtextFormat: z.string().optional(),
    employer: z.string().optional(),
    remote: z.string().optional(),
    needDriversLicense: z.array(z.string()).optional(),
    hasInterestform: z.string().optional(),
});
const SourceSchema = z.object({
    uuid: z.string(),
    source: z.string(),
    medium: z.string(),
    expires: z.string(),
    businessName: z.string(),
    published: z.string(),
    title: z.string(),
    reference: z.string(),
    locationList: z.array(LocationSchema),
    categoryList: z.array(CategorySchema).optional(),
    occupationList: z.array(OccupationSchema),
    properties: PropertySchema.optional(),
    status: z.string(),
});
const ExplanationSchema = z.object({
    value: z.number(),
    description: z.string(),
    details: z.array(
        z.object({
            value: z.number(),
            description: z.string(),
            details: z.array(
                z.object({
                    value: z.number(),
                    description: z.string(),
                    details: z.array(z.any()),
                }),
            ),
        }),
    ),
});
const HitSchema = z.object({
    _shard: z.string(),
    _node: z.string(),
    _index: z.string(),
    _id: z.string(),
    _score: z.number(),
    _source: SourceSchema,
    sort: z.array(z.union([z.number(), z.string()])),
    _explanation: ExplanationSchema,
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
    meta: z.object({}).passthrough(),
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
        meta: z.object({}).passthrough(),
        doc_count: z.number(),
        sum: z.object({
            value: z.number(),
        }),
    }),
    engagementType: AggregationSchema,
    countries: z.object({
        meta: z.object({}).passthrough(),
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
        meta: z.object({}).passthrough(),
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
        meta: z.object({}).passthrough(),
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
        meta: z.object({}).passthrough(),
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

export const StillingSoekResponseSchema = z.object({
    took: z.number(),
    timed_out: z.boolean(),
    _shards: z.object({
        total: z.number(),
        successful: z.number(),
        skipped: z.number(),
        failed: z.number(),
    }),
    hits: z.object({
        total: z.object({
            value: z.number(),
            relation: z.string(),
        }),
        max_score: z.number().nullable(),
        hits: z.array(HitSchema),
    }),
    aggregations: AggregationsSchema,
});

export type StillingSoekResponse = z.infer<typeof StillingSoekResponseSchema>;
export type StillingSoekResponseSource = z.infer<typeof SourceSchema>;
export type StillingSoekResponseExplanation = z.infer<typeof ExplanationSchema>;
export type StillingSoekResponseAggregationsSchema = z.infer<typeof AggregationsSchema>;
