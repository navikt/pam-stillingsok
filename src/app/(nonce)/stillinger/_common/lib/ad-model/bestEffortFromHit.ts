import { z } from "zod";
import type { Employer, AdDTO } from "@/app/(nonce)/stillinger/_common/lib/ad-model/index";
import { EmployerSchema } from "@/app/(nonce)/stillinger/_common/lib/ad-model/schemas/ad.dto";

const BestEffortSource = z.object({
    title: z.string().nullable().optional(),
    businessName: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    isZodError: z.boolean().optional(),
    employer: EmployerSchema.partial().nullable().optional(),
});

const BestEffortHit = z.object({
    _id: z.union([z.string(), z.number()]).optional(),
    _source: BestEffortSource.optional(),
});

function normalizeEmployerMinimal(raw: z.infer<typeof BestEffortSource>["employer"] | undefined): Employer {
    const name = raw?.name?.trim();
    return {
        name: name && name.length > 0 ? name : null,
        orgnr: null,
        sector: null,
        homepage: null,
        linkedinPage: null,
        twitterAddress: null,
        facebookPage: null,
        descriptionHtml: null,
    } as const;
}

export function bestEffortFromHit(hit: unknown) {
    const parsed = BestEffortHit.safeParse(hit);
    if (!parsed.success) {
        return null;
    }

    const src = parsed.data._source;
    const id = String(parsed.data._id);

    const title = src?.title ?? null;

    const status = src?.status ?? null;

    return {
        id,
        title,
        employer: normalizeEmployerMinimal(src?.employer),
        status,
        application: {
            applicationDueDate: null,
            applicationDueLabel: null,
            hasSuperraskSoknad: null,
            applicationEmail: null,
            applicationUrl: null,
        },
        isZodError: true,
    } satisfies Partial<AdDTO>;
}
