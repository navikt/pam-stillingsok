import { z } from "zod";

const HasMuligheterAccessSchema = z.object({
    hasMuligheterAccess: z.boolean(),
    failure: z.boolean(),
});

export type HasMuligheterAccess = z.infer<typeof HasMuligheterAccessSchema>;

export async function fetchMuligheterAccessStatus(): Promise<HasMuligheterAccess> {
    const res = await fetch("/api/muligheter/checkAccess", { method: "GET", cache: "no-store" }).catch(() => null);
    if (!res || !res.ok) {
        return { hasMuligheterAccess: false, failure: true };
    }

    const json: HasMuligheterAccess = await res.json().catch(() => null);

    if (!json || typeof json !== "object" || !HasMuligheterAccessSchema.safeParse(json).success) {
        return { hasMuligheterAccess: false, failure: true };
    }

    return json;
}
