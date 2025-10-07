import { z } from "zod";
import type { AdDTO } from "@/app/stillinger/_common/lib/ad-model";

// Minimal form av elastic search hit vi trenger for best-effort
const BestEffortSource = z.object({
    title: z.string().optional(),
    businessName: z.string().optional(),
    status: z.string().optional(),
    isZodError: z.boolean().optional(),
    employer: z
        .object({
            name: z.string().optional(),
        })
        .partial()
        .optional(),
});

const BestEffortHit = z.object({
    _id: z.union([z.string(), z.number()]).optional(),
    _source: BestEffortSource.optional(),
});

export function bestEffortFromHit(hit: unknown): AdDTO | null {
    const parsed = BestEffortHit.safeParse(hit);
    if (!parsed.success) {
        return null;
    }

    const data = parsed.data;
    const id = data._id != null ? String(data._id) : crypto.randomUUID();

    const title = data._source?.title;
    const employer = data._source?.employer;
    const status = data._source?.status;

    return {
        id,
        title,
        employer,
        status,
        isZodError: true,
    } satisfies AdDTO;
}
