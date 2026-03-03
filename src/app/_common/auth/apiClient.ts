export type AuthCheckResult = { readonly ok: true; readonly isAuthenticated: boolean } | { readonly ok: false };

export async function fetchAuthStatus(): Promise<AuthCheckResult> {
    const res = await fetch("/api/auth/status", { method: "GET", cache: "no-store" }).catch(() => null);
    if (!res) {
        return { ok: false };
    }
    const json: unknown = await res.json().catch(() => null);
    if (!json || typeof json !== "object") {
        return { ok: false };
    }

    const isAuthenticated = Boolean((json as { isAuthenticated?: unknown }).isAuthenticated);
    const ok = Boolean((json as { ok?: unknown }).ok);

    if (!ok) {
        return { ok: false };
    }
    return { ok: true, isAuthenticated };
}
