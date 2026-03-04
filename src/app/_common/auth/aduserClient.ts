import { z } from "zod";

const ADUSER_ENDPOINT_BASE = "/api/aduser/v1";
export type PersonaliaResult =
    | {
          readonly success: true;
          readonly data: { readonly navn: string; readonly kanLoggePaa: boolean; readonly erUnderFemten: boolean };
      }
    | { readonly success: false };

export async function fetchPersonalia(): Promise<PersonaliaResult> {
    const res = await fetch(`${ADUSER_ENDPOINT_BASE}/personalia`, { method: "GET", cache: "no-store" }).catch(
        () => null,
    );
    if (!res || !res.ok) {
        return { success: false };
    }
    // TODO: parse med zod ??
    const json: unknown = await res.json().catch(() => null);
    if (!json || typeof json !== "object") {
        return { success: false };
    }

    return json as PersonaliaResult;
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
