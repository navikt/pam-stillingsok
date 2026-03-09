import { z } from "zod";

const authStatusOkSchema = z.object({
    ok: z.literal(true),
    isAuthenticated: z.boolean(),
});

export type AuthStatusClientResult =
    | Readonly<{ ok: true; isAuthenticated: boolean }>
    | Readonly<{ ok: false; status?: number }>;

async function fetchAuthStatus(): Promise<AuthStatusClientResult> {
    const res = await fetch("/api/auth/status", { method: "GET", cache: "no-store" }).catch(() => null);

    if (!res) {
        return { ok: false };
    }

    if (!res.ok) {
        return { ok: false, status: res.status };
    }

    const json: unknown = await res.json().catch(() => null);
    const parsed = authStatusOkSchema.safeParse(json);

    if (!parsed.success) {
        return { ok: false };
    }

    return { ok: true, isAuthenticated: parsed.data.isAuthenticated };
}

type AuthGuardResult = AuthStatusClientResult;

let inFlight: Promise<AuthGuardResult> | null = null;
let lastFetchedAtMs = 0;
let lastResult: AuthGuardResult = { ok: false };
let cooldownMs = 30_000;

export function resetAuthStatusCache(): void {
    inFlight = null;
    lastFetchedAtMs = 0;
    lastResult = { ok: false };
    cooldownMs = 30_000;
}

export async function fetchAuthStatusWithGuards(): Promise<AuthGuardResult> {
    const now = Date.now();

    if (now - lastFetchedAtMs < cooldownMs) {
        return lastResult;
    }

    if (inFlight) {
        return inFlight;
    }

    inFlight = (async () => {
        const result = await fetchAuthStatus();

        lastFetchedAtMs = Date.now();
        lastResult = result;

        // Backoff ved limiter / serverfeil
        if (!result.ok && result.status === 429) {
            cooldownMs = 120_000;
        } else if (!result.ok && typeof result.status === "number" && result.status >= 500) {
            cooldownMs = 60_000;
        } else {
            cooldownMs = 30_000;
        }

        return result;
    })().finally(() => {
        inFlight = null;
    });

    return inFlight;
}
