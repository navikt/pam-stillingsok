import { z } from "zod";
import type { AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import { UrlString } from "@/app/stillinger/_common/lib/ad-model/schemas/primitives";

// Minimal form av elastic search hit vi trenger for best-effort
const BestEffortSource = z.object({
    title: z.string().nullable(),
    businessName: z.string().nullable(),
    status: z.string().nullable(),
    isZodError: z.boolean().optional(),
    employer: z
        .object({
            name: z.string().nullable(),
            orgnr: z.string().nullable(),
            sector: z.string().nullable(),
            homepage: UrlString.nullable(),
            linkedinPage: UrlString.nullable(),
            twitterAddress: UrlString.nullable(),
            facebookPage: UrlString.nullable(),
            descriptionHtml: z.string().nullable(),
        })
        .nullable(),
});

const BestEffortHit = z.object({
    _id: z.union([z.string(), z.number()]).optional(),
    _source: BestEffortSource.optional(),
});

export function bestEffortFromHit(hit: unknown) {
    const parsed = BestEffortHit.safeParse(hit);
    if (!parsed.success) {
        return null;
    }

    const data = parsed.data;
    const id = data._id != null ? String(data._id) : crypto.randomUUID();

    const title = data._source?.title ?? null;
    const employer = data._source?.employer ?? {
        name: data._source?.employer?.name ?? null,
        orgnr: data._source?.employer?.orgnr ?? null,
        sector: data._source?.employer?.sector ?? null,
        homepage: data._source?.employer?.homepage ?? null,
        linkedinPage: data._source?.employer?.linkedinPage ?? null,
        twitterAddress: data._source?.employer?.twitterAddress ?? null,
        facebookPage: data._source?.employer?.facebookPage ?? null,
        descriptionHtml: data._source?.employer?.descriptionHtml ?? null,
    };
    const status = data._source?.status ?? null;

    return {
        id,
        title,
        employer,
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
