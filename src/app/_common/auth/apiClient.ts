export type AuthStatusClientResult = Readonly<{ ok: true; isAuthenticated: boolean }> | Readonly<{ ok: false }>;
// TODO: zod validering her
export async function fetchAuthStatus(): Promise<AuthStatusClientResult> {
    const res = await fetch("/api/auth/status", { method: "GET", cache: "no-store" }).catch(() => null);
    if (!res) {
        return { ok: false };
    }

    if (!res.ok) {
        return { ok: false };
    }

    const json: unknown = await res.json().catch(() => null);

    if (!json || typeof json !== "object") {
        return { ok: false };
    }

    const ok = Boolean((json as { ok?: unknown }).ok);
    if (!ok) {
        return { ok: false };
    }

    const isAuthenticated = Boolean((json as { isAuthenticated?: unknown }).isAuthenticated);
    return { ok: true, isAuthenticated };
}
