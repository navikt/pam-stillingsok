import "server-only";
import { z } from "zod";
import type {
    JsonApiCollectionDocument,
    JsonApiDocument,
    JsonApiResource,
    WebformDocument,
} from "@/features/ung/onboarding/server/jsonApiTypes";
import type { SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";
import {
    type SharedContentContractIssue,
    safeParseSharedContentCollection,
    safeParseSharedContentDocument,
    safeParseWebformDocument,
} from "@/features/ung/onboarding/server/sharedContentSchemas";
import { recordSharedContentRequest } from "@/metrics";

const DEFAULT_TIMEOUT_MS = 5_000;
const MAX_TIMEOUT_MS = 30_000;
const MAX_INCLUDE_RELATIONSHIPS = 30;
const COLLECTION_PATH = "/jsonapi/node/shared_content";
const COLLECTION_PAGE_LIMIT = 50;
const MAX_COLLECTION_PAGES = 5;
const MAX_COLLECTION_RESOURCES = 100;
const COLLECTION_FIELDS = "title,field_sc_intro,field_sc_age,field_sc_experience,field_sc_audiences";
const WEBFORM_FIELDS = "title,elements_combined,elements";

const clientConfigSchema = z.object({
    apiUrl: z.string().min(1),
    apiKey: z.string().min(1),
    timeoutMs: z.number().int().positive().max(MAX_TIMEOUT_MS),
});

const documentRequestSchema = z.object({
    resourceId: z.uuid(),
    include: z.array(z.string().regex(/^field_[a-z0-9_]+(?:\.field_[a-z0-9_]+)*$/)).max(MAX_INCLUDE_RELATIONSHIPS),
});

const webformRequestSchema = z.object({
    webformId: z.uuid(),
});

export type SharedContentOperation = "collection" | "article" | "webform";

export type SharedContentClient = Readonly<{
    getArticle: (
        request: Readonly<{
            resourceId: string;
            include: readonly string[];
        }>,
    ) => Promise<SharedContentResult<JsonApiDocument>>;
    getCollection: () => Promise<SharedContentResult<JsonApiCollectionDocument>>;
    getWebform: (request: Readonly<{ webformId: string }>) => Promise<SharedContentResult<WebformDocument>>;
    /** HTTPS-origin til Shared Content-API-et. Brukes til å gjøre relative bilde-URL-er absolutte. */
    apiUrl: string;
}>;

type SharedContentClientConfig = Readonly<{
    apiUrl: string;
    apiKey: string;
    timeoutMs?: number;
}>;

type ClientFailure = Extract<SharedContentResult<never>, { ok: false }>;

type ContractParseResult<T> =
    | Readonly<{ ok: true; data: T }>
    | Readonly<{ ok: false; issues: readonly SharedContentContractIssue[] }>;

type FetchImplementation = (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>;

export function getSharedContentClient(): SharedContentResult<SharedContentClient> {
    return createSharedContentClient({
        apiUrl: process.env.SHARED_CONTENT_API_URL ?? "",
        apiKey: process.env.SHARED_CONTENT_API_KEY ?? "",
        timeoutMs: parseTimeout(process.env.SHARED_CONTENT_TIMEOUT_MS),
    });
}

export function createSharedContentClient(
    config: SharedContentClientConfig,
    fetchImplementation: FetchImplementation = fetch,
): SharedContentResult<SharedContentClient> {
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
            },
        };
    }

    const apiUrl = parseApiUrl(parsedConfig.data.apiUrl);
    if (!apiUrl.ok) {
        return apiUrl;
    }
    const baseUrl = apiUrl.data;
    const { apiKey, timeoutMs } = parsedConfig.data;

    // Felles transport: API-nøkkelen settes kun som header, og URL-en bygges alltid av klienten selv.
    async function fetchJson(requestUrl: URL): Promise<SharedContentResult<unknown>> {
        let response: Response;
        try {
            response = await fetchImplementation(requestUrl, {
                method: "GET",
                headers: {
                    Accept: "application/vnd.api+json",
                    "api-key": apiKey,
                },
                cache: "no-store",
                redirect: "error",
                signal: AbortSignal.timeout(timeoutMs),
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

        if (response.status === 404) {
            return {
                ok: false,
                error: {
                    type: "not-found",
                    message: "Shared Content fant ikke ressursen",
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

        try {
            return { ok: true, data: await response.json() };
        } catch {
            return {
                ok: false,
                error: {
                    type: "invalid-response",
                    message: "Shared Content svarte med ugyldig JSON",
                },
            };
        }
    }

    async function instrument<T>(
        operation: SharedContentOperation,
        run: () => Promise<SharedContentResult<T>>,
    ): Promise<SharedContentResult<T>> {
        const startedAt = performance.now();
        const result = await run();
        recordSharedContentRequest(
            operation,
            result.ok ? "success" : result.error.type,
            (performance.now() - startedAt) / 1000,
        );
        return result;
    }

    async function fetchAndParse<T>(
        requestUrl: URL,
        safeParse: (input: unknown) => ContractParseResult<T>,
    ): Promise<SharedContentResult<T>> {
        const payload = await fetchJson(requestUrl);
        if (!payload.ok) {
            return payload;
        }
        const parsed = safeParse(payload.data);
        if (!parsed.ok) {
            return contractError(parsed.issues);
        }
        return { ok: true, data: parsed.data };
    }

    async function getArticle(request: {
        resourceId: string;
        include: readonly string[];
    }): Promise<SharedContentResult<JsonApiDocument>> {
        const parsedRequest = documentRequestSchema.safeParse(request);
        if (!parsedRequest.success) {
            return invalidRequest();
        }

        return instrument<JsonApiDocument>("article", async () => {
            const requestUrl = new URL(`${COLLECTION_PATH}/${parsedRequest.data.resourceId}`, baseUrl);
            if (parsedRequest.data.include.length > 0) {
                requestUrl.searchParams.set("include", parsedRequest.data.include.join(","));
            }

            return fetchAndParse(requestUrl, safeParseSharedContentDocument);
        });
    }

    async function getWebform(request: { webformId: string }): Promise<SharedContentResult<WebformDocument>> {
        const parsedRequest = webformRequestSchema.safeParse(request);
        if (!parsedRequest.success) {
            return invalidRequest();
        }

        return instrument<WebformDocument>("webform", async () => {
            const requestUrl = new URL(`/jsonapi/webform/webform/${parsedRequest.data.webformId}`, baseUrl);
            requestUrl.searchParams.set("fields[webform--webform]", WEBFORM_FIELDS);
            return fetchAndParse(requestUrl, safeParseWebformDocument);
        });
    }

    // Følger bare kontrollerte neste-lenker, med grenser for antall sider og ressurser.
    async function fetchCollectionPages(): Promise<SharedContentResult<JsonApiCollectionDocument>> {
        const firstUrl = new URL(COLLECTION_PATH, baseUrl);
        firstUrl.searchParams.set("fields[node--shared_content]", COLLECTION_FIELDS);
        firstUrl.searchParams.set("page[limit]", `${COLLECTION_PAGE_LIMIT}`);

        const visited = new Set<string>();
        const data: JsonApiResource[] = [];
        const included: JsonApiResource[] = [];
        let nextUrl: URL | undefined = firstUrl;

        while (nextUrl) {
            if (visited.size >= MAX_COLLECTION_PAGES) {
                return invalidResponse("Shared Content-samlingen har for mange sider");
            }
            if (visited.has(nextUrl.href)) {
                return invalidResponse("Shared Content-samlingen har en løkke i paginering");
            }
            visited.add(nextUrl.href);

            const page = await fetchAndParse(nextUrl, safeParseSharedContentCollection);
            if (!page.ok) {
                return page;
            }

            data.push(...page.data.data);
            included.push(...page.data.included);
            if (data.length > MAX_COLLECTION_RESOURCES) {
                return invalidResponse("Shared Content-samlingen har for mange ressurser");
            }

            const nextHref = page.data.links?.next;
            if (nextHref === undefined) {
                break;
            }
            nextUrl = validateNextUrl(nextHref, baseUrl);
            if (!nextUrl) {
                return invalidResponse("Shared Content-samlingen har en ugyldig neste-lenke");
            }
        }

        return { ok: true, data: { data, included } };
    }

    return {
        ok: true,
        data: {
            getArticle,
            getCollection: () => instrument("collection", fetchCollectionPages),
            getWebform,
            apiUrl: baseUrl.origin,
        },
    };
}

function invalidRequest(): ClientFailure {
    return {
        ok: false,
        error: {
            type: "invalid-request",
            message: "Shared Content-kallet har ugyldige parametre",
        },
    };
}

function invalidResponse(message: string): ClientFailure {
    return { ok: false, error: { type: "invalid-response", message } };
}

function contractError(issues: readonly Readonly<{ path: string }>[]): ClientFailure {
    return {
        ok: false,
        error: {
            type: "invalid-contract",
            message: "Shared Content-svaret følger ikke JSON:API-kontrakten",
            issuePaths: issues.map((issue) => issue.path),
        },
    };
}

// Neste side må ligge på samme HTTPS-origin og samme samlingssti, og må aldri bære API-nøkkel i URL-en.
function validateNextUrl(href: string, baseUrl: URL): URL | undefined {
    let nextUrl: URL;
    try {
        nextUrl = new URL(href);
    } catch {
        return undefined;
    }

    if (
        nextUrl.origin !== baseUrl.origin ||
        nextUrl.pathname !== COLLECTION_PATH ||
        nextUrl.username !== "" ||
        nextUrl.password !== "" ||
        nextUrl.hash !== "" ||
        [...nextUrl.searchParams.keys()].some((key) => key.toLowerCase() === "api-key")
    ) {
        return undefined;
    }
    return nextUrl;
}

function parseTimeout(value: string | undefined): number {
    if (value === undefined || value === "") {
        return DEFAULT_TIMEOUT_MS;
    }
    return Number(value);
}

function parseApiUrl(apiUrl: string): SharedContentResult<URL> {
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

function invalidApiUrl(): SharedContentResult<URL> {
    return {
        ok: false,
        error: {
            type: "configuration",
            message: "SHARED_CONTENT_API_URL må være en HTTPS-origin uten sti, query eller credentials",
        },
    };
}

function isJsonContentType(contentType: string | null): boolean {
    const mediaType = contentType?.split(";", 1)[0]?.trim().toLowerCase();
    return mediaType === "application/vnd.api+json" || mediaType === "application/json";
}
