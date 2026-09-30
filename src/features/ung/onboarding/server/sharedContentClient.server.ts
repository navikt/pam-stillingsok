import "server-only";
import { z } from "zod";
import type { JsonApiDocument } from "@/features/ung/onboarding/server/jsonApiTypes";
import { safeParseSharedContentDocument } from "@/features/ung/onboarding/server/sharedContentSchemas";

const DEFAULT_TIMEOUT_MS = 5_000;
const MAX_TIMEOUT_MS = 30_000;
const MAX_INCLUDE_RELATIONSHIPS = 30;

const clientConfigSchema = z.object({
    apiUrl: z.string().min(1),
    apiKey: z.string().min(1),
    timeoutMs: z.number().int().positive().max(MAX_TIMEOUT_MS),
});

const documentRequestSchema = z.object({
    resourceId: z.uuid(),
    include: z.array(z.string().regex(/^field_[a-z0-9_]+(?:\.field_[a-z0-9_]+)*$/)).max(MAX_INCLUDE_RELATIONSHIPS),
});

export type SharedContentClientError =
    | Readonly<{
          type: "configuration";
          message: string;
          issuePaths: readonly string[];
      }>
    | Readonly<{
          type: "invalid-request";
          message: string;
          issuePaths: readonly string[];
      }>
    | Readonly<{
          type: "network";
          message: string;
      }>
    | Readonly<{
          type: "http";
          message: string;
          status: number;
      }>
    | Readonly<{
          type: "invalid-response";
          message: string;
      }>
    | Readonly<{
          type: "invalid-contract";
          message: string;
          issuePaths: readonly string[];
      }>;

export type SharedContentClientResult<T> =
    | Readonly<{
          ok: true;
          data: T;
      }>
    | Readonly<{
          ok: false;
          error: SharedContentClientError;
      }>;

export type SharedContentClient = Readonly<{
    getDocument: (
        request: Readonly<{
            resourceId: string;
            include: readonly string[];
        }>,
    ) => Promise<SharedContentClientResult<JsonApiDocument>>;
}>;

type SharedContentClientConfig = Readonly<{
    apiUrl: string;
    apiKey: string;
    timeoutMs?: number;
}>;

type FetchImplementation = (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>;

export function getSharedContentClient(): SharedContentClientResult<SharedContentClient> {
    return createSharedContentClient({
        apiUrl: process.env.SHARED_CONTENT_API_URL ?? "",
        apiKey: process.env.SHARED_CONTENT_API_KEY ?? "",
        timeoutMs: parseTimeout(process.env.SHARED_CONTENT_TIMEOUT_MS),
    });
}

export function createSharedContentClient(
    config: SharedContentClientConfig,
    fetchImplementation: FetchImplementation = fetch,
): SharedContentClientResult<SharedContentClient> {
    const parsedConfig = clientConfigSchema.safeParse({
        ...config,
        timeoutMs: config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    });
    if (!parsedConfig.success) {
        return {
            ok: false,
            error: {
                type: "configuration",
                message: "Shared Content-klienten mangler gyldig konfigurasjon",
                issuePaths: parsedConfig.error.issues.map((issue) => issue.path.join(".")),
            },
        };
    }

    const apiUrl = parseApiUrl(parsedConfig.data.apiUrl);
    if (!apiUrl.ok) {
        return apiUrl;
    }

    return {
        ok: true,
        data: {
            async getDocument(request) {
                const parsedRequest = documentRequestSchema.safeParse(request);
                if (!parsedRequest.success) {
                    return {
                        ok: false,
                        error: {
                            type: "invalid-request",
                            message: "Shared Content-kallet har ugyldige parametre",
                            issuePaths: parsedRequest.error.issues.map((issue) => issue.path.join(".")),
                        },
                    };
                }

                const requestUrl = new URL(
                    `/jsonapi/node/shared_content/${parsedRequest.data.resourceId}`,
                    apiUrl.data,
                );
                if (parsedRequest.data.include.length > 0) {
                    requestUrl.searchParams.set("include", parsedRequest.data.include.join(","));
                }

                let response: Response;
                try {
                    response = await fetchImplementation(requestUrl, {
                        method: "GET",
                        headers: {
                            Accept: "application/vnd.api+json",
                            "api-key": parsedConfig.data.apiKey,
                        },
                        cache: "no-store",
                        redirect: "error",
                        signal: AbortSignal.timeout(parsedConfig.data.timeoutMs),
                    });
                } catch {
                    return {
                        ok: false,
                        error: {
                            type: "network",
                            message: "Shared Content-kallet feilet før vi mottok et svar",
                        },
                    };
                }

                if (!response.ok) {
                    return {
                        ok: false,
                        error: {
                            type: "http",
                            message: "Shared Content svarte med en feilstatus",
                            status: response.status,
                        },
                    };
                }

                if (!isJsonContentType(response.headers.get("content-type"))) {
                    return {
                        ok: false,
                        error: {
                            type: "invalid-response",
                            message: "Shared Content svarte ikke med JSON",
                        },
                    };
                }

                let payload: unknown;
                try {
                    payload = await response.json();
                } catch {
                    return {
                        ok: false,
                        error: {
                            type: "invalid-response",
                            message: "Shared Content svarte med ugyldig JSON",
                        },
                    };
                }

                const parsedDocument = safeParseSharedContentDocument(payload);
                if (!parsedDocument.ok) {
                    return {
                        ok: false,
                        error: {
                            type: "invalid-contract",
                            message: "Shared Content-svaret følger ikke JSON:API-kontrakten",
                            issuePaths: parsedDocument.issues.map((issue) => issue.path),
                        },
                    };
                }

                return {
                    ok: true,
                    data: parsedDocument.data,
                };
            },
        },
    };
}

function parseTimeout(value: string | undefined): number {
    if (value === undefined || value === "") {
        return DEFAULT_TIMEOUT_MS;
    }
    return Number(value);
}

function parseApiUrl(apiUrl: string): SharedContentClientResult<URL> {
    let parsedUrl: URL;
    try {
        parsedUrl = new URL(apiUrl);
    } catch {
        return invalidApiUrl();
    }

    if (
        parsedUrl.protocol !== "https:" ||
        parsedUrl.username !== "" ||
        parsedUrl.password !== "" ||
        parsedUrl.search !== "" ||
        parsedUrl.hash !== "" ||
        !["", "/"].includes(parsedUrl.pathname)
    ) {
        return invalidApiUrl();
    }

    return {
        ok: true,
        data: parsedUrl,
    };
}

function invalidApiUrl(): SharedContentClientResult<URL> {
    return {
        ok: false,
        error: {
            type: "configuration",
            message: "SHARED_CONTENT_API_URL må være en HTTPS-origin uten sti, query eller credentials",
            issuePaths: ["apiUrl"],
        },
    };
}

function isJsonContentType(contentType: string | null): boolean {
    const mediaType = contentType?.split(";", 1)[0]?.trim().toLowerCase();
    return mediaType === "application/vnd.api+json" || mediaType === "application/json";
}
