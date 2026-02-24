"use client";

export const aduserUserPath = "/min-side/api/aduser/api/v1/user" as const;

type IsoDateTimeString = string;

type ApiUserResponse = Readonly<{
    id: number;
    uuid: string;
    acceptedTerms: string;
    email: string | null;
    verifiedEmail: boolean;
    name: string | null;
    created: IsoDateTimeString;
    updated: IsoDateTimeString;
}>;

type PutUserRequest = Readonly<{
    email?: string | null;
    name?: string | null;
    acceptedTerms?: "true";
    uuid: string | null;
}>;

type PostUserRequest = Readonly<{
    email: string;
    name: string;
    acceptedTerms: "true";
}>;

type Result<T> = Readonly<{ ok: true; data: T }> | Readonly<{ ok: false; status: number; bodyText: string }>;

function redirectToLogin(): void {
    const current = `${window.location.pathname}${window.location.search}`;
    window.location.assign(`/oauth2/login?redirect=${encodeURIComponent(current)}`);
}

async function safeText(response: Response): Promise<string> {
    try {
        return await response.text();
    } catch {
        return "";
    }
}

async function requestJson<TResponse>(input: Readonly<{ url: string; init: RequestInit }>): Promise<Result<TResponse>> {
    const response = await fetch(input.url, {
        credentials: "same-origin",
        cache: "no-store",
        ...input.init,
    });

    if (response.status === 401) {
        redirectToLogin();
        return { ok: false, status: 401, bodyText: "" };
    }

    if (!response.ok) {
        return { ok: false, status: response.status, bodyText: await safeText(response) };
    }

    if (response.status === 204) {
        return { ok: true, data: undefined as unknown as TResponse };
    }

    const data = (await response.json()) as TResponse;
    return { ok: true, data };
}

/**
 * For endepunkter som ikke returnerer JSON (typisk DELETE / 204 / tekst).
 * - 401 -> redirect
 * - 404 -> ok (idempotent delete)
 */
async function requestNoJson(
    input: Readonly<{ url: string; init: RequestInit }>,
): Promise<Result<Readonly<Record<string, never>>>> {
    const response = await fetch(input.url, {
        credentials: "same-origin",
        cache: "no-store",
        ...input.init,
    });

    if (response.status === 401) {
        redirectToLogin();
        return { ok: false, status: 401, bodyText: "" };
    }

    // Idempotent: ressurs finnes ikke => allerede “slettet”
    if (response.status === 404 && input.init.method === "DELETE") {
        return { ok: true, data: {} };
    }

    if (!response.ok) {
        return { ok: false, status: response.status, bodyText: await safeText(response) };
    }

    return { ok: true, data: {} };
}

export async function getUser(): Promise<Result<ApiUserResponse>> {
    return requestJson<ApiUserResponse>({
        url: aduserUserPath,
        init: { method: "GET", headers: { Accept: "application/json" } },
    });
}

export async function createUser(payload: PostUserRequest): Promise<Result<ApiUserResponse>> {
    return requestJson<ApiUserResponse>({
        url: aduserUserPath,
        init: {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
        },
    });
}

export async function updateUser(payload: PutUserRequest): Promise<Result<ApiUserResponse>> {
    return requestJson<ApiUserResponse>({
        url: aduserUserPath,
        init: {
            method: "PUT",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
        },
    });
}

export async function deleteUser(): Promise<Result<Readonly<Record<string, never>>>> {
    return requestNoJson({
        url: aduserUserPath,
        init: { method: "DELETE" },
    });
}
