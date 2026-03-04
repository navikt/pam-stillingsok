import { z } from "zod";

const ADUSER_ENDPOINT_BASE = "/api/aduser/v1";
const personaliaSchema = z.object({
    success: z.literal(true),
    data: z.object({
        navn: z.string().min(1),
        kanLoggePaa: z.boolean(),
        erUnderFemten: z.boolean(),
    }),
});

const personaliaFailSchema = z.object({
    success: z.literal(false),
});

export type PersonaliaResult =
    | Readonly<z.infer<typeof personaliaSchema>>
    | Readonly<z.infer<typeof personaliaFailSchema>>;

export async function fetchPersonalia(): Promise<PersonaliaResult> {
    const res = await fetch(`${ADUSER_ENDPOINT_BASE}/personalia`, {
        method: "GET",
        cache: "no-store",
        headers: { accept: "application/json" },
    }).catch(() => null);

    if (!res || !res.ok) {
        return { success: false };
    }

    const json: unknown = await res.json().catch(() => null);

    const okParsed = personaliaSchema.safeParse(json);
    if (okParsed.success) {
        return okParsed.data;
    }

    const failParsed = personaliaFailSchema.safeParse(json);
    if (failParsed.success) {
        return failParsed.data;
    }

    return { success: false };
}

const adUserSchema = z.object({
    id: z.number(),
    uuid: z.string(),
    email: z.string().nullish(),
    name: z.string().optional(),
    verifiedEmail: z.boolean().optional(),
    acceptedTerms: z.string().optional(),
});

export type AdUser = Readonly<z.infer<typeof adUserSchema>>;

export type FetchAdUserResult =
    | Readonly<{ ok: true; data: AdUser }>
    | Readonly<{
          ok: false;
          reason: "unauthorized" | "not-found" | "invalid-json" | "http-error" | "network-error" | "forbidden";
          status?: number;
      }>;

export async function fetchAdUser(): Promise<FetchAdUserResult> {
    const res = await fetch(`${ADUSER_ENDPOINT_BASE}/user`, {
        method: "GET",
        cache: "no-store",
        headers: {
            accept: "application/json",
        },
    }).catch(() => null);

    if (!res) {
        return { ok: false, reason: "network-error" };
    }

    if (res.status === 401) {
        return { ok: false, reason: "unauthorized", status: 401 };
    }

    if (res.status === 403) {
        return { ok: false, reason: "forbidden", status: 403 };
    }

    if (res.status === 404) {
        return { ok: false, reason: "not-found", status: 404 };
    }

    if (!res.ok) {
        return { ok: false, reason: "http-error", status: res.status };
    }

    const json: unknown = await res.json().catch(() => null);
    const parsed = adUserSchema.safeParse(json);

    if (!parsed.success) {
        return { ok: false, reason: "invalid-json" };
    }

    return { ok: true, data: parsed.data };
}
