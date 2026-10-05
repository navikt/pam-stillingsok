import "server-only";
import { z } from "zod";
import { appLogger } from "@/app/_common/logging/appLogger";
import {
    type JsonApiCollectionDocument,
    type JsonApiDocument,
    type JsonApiResource,
    safeParseSharedContentCollection,
    safeParseSharedContentDocument,
    safeParseSharedContentTaxonomy,
    safeParseWebformYaml,
} from "@/features/ung/onboarding/server/drupal/jsonApi";
import type { SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";
import { recordSharedContentRequest } from "@/metrics";

const DEFAULT_TIMEOUT_MS = 5_000;
const MAX_TIMEOUT_MS = 30_000;
const COLLECTION_PATH = "/jsonapi/node/shared_content";
const COLLECTION_PAGE_LIMIT = 50;
const MAX_COLLECTION_PAGES = 5;
const MAX_COLLECTION_RESOURCES = 100;
// `fields` begrenser hvilke attributter Drupal returnerer for artikkellista. Filtrering på
// metadata skjer nå hos Drupal (se getCollection-filteret), så metadata-feltene trengs ikke i lista.
const COLLECTION_FIELDS = "title,field_sc_intro";
const TAXONOMY_PATH_PREFIX = "/jsonapi/taxonomy_term";
const TAXONOMY_PAGE_LIMIT = 50;
const MAX_TAXONOMY_PAGES = 5;
const MAX_TAXONOMY_RESOURCES = 100;
// Taxonomy-termene endres sjelden. API-et cacher dem i 1 time (`max-age=3600, public`).
const TAXONOMY_REVALIDATE_SECONDS = 3600;
// `include` ber Drupal legge relaterte ressurser (blokker, bilder, termer) i `included`.
const ARTICLE_INCLUDE = [
    "field_sc_content",
    "field_sc_content.field_accordion_items",
    "field_sc_content.field_video_media",
    "field_sc_content.field_tti_image",
    "field_sc_content.field_tti_image.field_media_image",
    "field_sc_owner",
    "field_sc_available_to",
    "field_sc_audiences",
    "field_sc_age",
    "field_sc_experience",
].join(",");
const WEBFORM_FIELDS = "elements_combined,elements";

const clientConfigSchema = z.object({
    apiUrl: z.string().min(1),
    apiKey: z.string().min(1),
    timeoutMs: z.number().int().positive().max(MAX_TIMEOUT_MS),
});

const uuidSchema = z.uuid();
const goalsParentIdSchema = z.uuid();

export type SharedContentOperation = "collection" | "article" | "webform" | "taxonomy";

/** De tre taxonomy-vokabularene onboarding-valgene hentes fra. Maskinnavn, like i alle miljøer. */
export type TaxonomyVocabulary = "shared_content_age" | "shared_content_experience" | "situations";

export type TaxonomyTerm = Readonly<{
    id: string;
    name: string;
    weight: number;
}>;

/** Filter på Drupal-term-UUID-er. Bare UUID-er valideres og sendes videre. */
export type CollectionFilter = Readonly<{
    age?: readonly string[];
    experience?: readonly string[];
    audiences?: readonly string[];
}>;

export type SharedContentClient = Readonly<{
    /** Alle artikler, eventuelt filtrert på alder/erfaring/mål. Følger paginering. */
    getCollection: (filter?: CollectionFilter) => Promise<SharedContentResult<JsonApiCollectionDocument>>;
    /** Én artikkel med blokker, bilder og metadata i `included`. */
    getArticle: (articleId: string) => Promise<SharedContentResult<JsonApiDocument>>;
    /** YAML-definisjonen til en Drupal Webform (quiz). */
    getWebformYaml: (webformId: string) => Promise<SharedContentResult<string>>;
    /** Termene i et taxonomy-vokabular, sortert etter `weight`. Følger paginering. */
    getTaxonomyTerms: (
        vocabulary: TaxonomyVocabulary,
        options?: { parentId?: string },
    ) => Promise<SharedContentResult<readonly TaxonomyTerm[]>>;
    /** HTTPS-origin til Shared Content-API-et. Brukes til å gjøre relative bilde-URL-er absolutte. */
    apiUrl: string;
}>;

type SharedContentClientConfig = Readonly<{
    apiUrl: string;
    apiKey: string;
    timeoutMs?: number;
}>;

type ClientFailure = Extract<SharedContentResult<never>, { ok: false }>;

type FetchImplementation = (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>;

// `next.revalidate` finnes bare i Next.js' utvidede RequestInit, så vi typer den selv i stedet for
// å stole på de globale fetch-typene.
type CacheStrategy = Readonly<{ cache: "no-store" }> | Readonly<{ next: { revalidate: number } }>;

const NO_STORE_CACHE: CacheStrategy = { cache: "no-store" };
const TAXONOMY_CACHE: CacheStrategy = { next: { revalidate: TAXONOMY_REVALIDATE_SECONDS } };

export function getSharedContentClient(): SharedContentResult<SharedContentClient> {
    return createSharedContentClient({
        apiUrl: process.env.SHARED_CONTENT_API_URL ?? "",
        apiKey: process.env.SHARED_CONTENT_API_KEY ?? "",
        timeoutMs: parseTimeout(process.env.SHARED_CONTENT_TIMEOUT_MS),
    });
}

/**
 * Ankeret for mål-dimensjonen: UUID-en til «Jobbsøk for unge» i det delte `situations`-vokabularet.
 * Ulik per miljø, derfor en egen Nais-variabel i stedet for en konstant i koden (se
 * SHARED_CONTENT_GOALS_PARENT_ID i .nais/dev.yml). Leses og valideres på samme måte som resten
 * av klientkonfigurasjonen: mangler eller ugyldig UUID gir samme "configuration"-feil som en
 * manglende API-URL.
 */
export function getSharedContentGoalsParentId(): SharedContentResult<string> {
    const parsed = goalsParentIdSchema.safeParse(process.env.SHARED_CONTENT_GOALS_PARENT_ID ?? "");
    if (!parsed.success) {
        return {
            ok: false,
            error: {
                type: "configuration",
                message: "SHARED_CONTENT_GOALS_PARENT_ID må være en gyldig UUID",
            },
        };
    }
    return { ok: true, data: parsed.data };
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
    // `cacheStrategy` lar hvert kall velge mellom `no-store` (samlingen, artikkelen, Webform) og
    // Next.js sin data-cache med `revalidate` (taxonomy). De to kan ikke kombineres i samme kall.
    async function fetchJson(
        requestUrl: URL,
        cacheStrategy: CacheStrategy = NO_STORE_CACHE,
    ): Promise<SharedContentResult<unknown>> {
        let response: Response;
        try {
            response = await fetchImplementation(requestUrl, {
                method: "GET",
                headers: {
                    Accept: "application/vnd.api+json",
                    "api-key": apiKey,
                },
                ...cacheStrategy,
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
        safeParse: (input: unknown) => SharedContentResult<T>,
        cacheStrategy: CacheStrategy = NO_STORE_CACHE,
    ): Promise<SharedContentResult<T>> {
        const payload = await fetchJson(requestUrl, cacheStrategy);
        return payload.ok ? safeParse(payload.data) : payload;
    }

    async function getArticle(articleId: string): Promise<SharedContentResult<JsonApiDocument>> {
        if (!uuidSchema.safeParse(articleId).success) {
            return invalidRequest();
        }

        return instrument("article", async () => {
            const requestUrl = new URL(`${COLLECTION_PATH}/${articleId}`, baseUrl);
            requestUrl.searchParams.set("include", ARTICLE_INCLUDE);
            return fetchAndParse(requestUrl, safeParseSharedContentDocument);
        });
    }

    async function getWebformYaml(webformId: string): Promise<SharedContentResult<string>> {
        if (!uuidSchema.safeParse(webformId).success) {
            return invalidRequest();
        }

        return instrument("webform", async () => {
            const requestUrl = new URL(`/jsonapi/webform/webform/${webformId}`, baseUrl);
            requestUrl.searchParams.set("fields[webform--webform]", WEBFORM_FIELDS);
            return fetchAndParse(requestUrl, safeParseWebformYaml);
        });
    }

    // Følger bare kontrollerte neste-lenker, med grenser for antall sider og ressurser.
    async function fetchCollectionPages(
        filter?: CollectionFilter,
    ): Promise<SharedContentResult<JsonApiCollectionDocument>> {
        const firstUrl = new URL(COLLECTION_PATH, baseUrl);
        firstUrl.searchParams.set("fields[node--shared_content]", COLLECTION_FIELDS);
        firstUrl.searchParams.set("page[limit]", `${COLLECTION_PAGE_LIMIT}`);

        const filterError = applyCollectionFilter(firstUrl.searchParams, filter);
        if (filterError) {
            return filterError;
        }

        const visited = new Set<string>();
        const data: JsonApiResource[] = [];
        const included: JsonApiResource[] = [];
        let expectedCount: number | undefined;
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
            expectedCount ??= page.data.meta?.count;

            data.push(...page.data.data);
            included.push(...page.data.included);
            if (data.length > MAX_COLLECTION_RESOURCES) {
                return invalidResponse("Shared Content-samlingen har for mange ressurser");
            }

            const nextHref = page.data.links?.next?.href;
            if (nextHref === undefined) {
                break;
            }
            nextUrl = validateNextUrl(nextHref, baseUrl, COLLECTION_PATH);
            if (!nextUrl) {
                return invalidResponse("Shared Content-samlingen har en ugyldig neste-lenke");
            }
        }

        if (expectedCount !== undefined && expectedCount !== data.length) {
            appLogger.warn("Shared Content-samlingen har et avvik mellom meta.count og antall mottatte artikler", {
                expectedCount,
                receivedCount: data.length,
            });
        }

        return { ok: true, data: { data, included } };
    }

    // Følger bare kontrollerte neste-lenker, med grenser for antall sider og ressurser. Henter
    // alle attributtene vi trenger (name, weight) og lar Drupal sortere på weight.
    async function fetchTaxonomyPages(
        vocabulary: TaxonomyVocabulary,
        parentId: string | undefined,
    ): Promise<SharedContentResult<readonly TaxonomyTerm[]>> {
        const path = `${TAXONOMY_PATH_PREFIX}/${vocabulary}`;
        const firstUrl = new URL(path, baseUrl);
        firstUrl.searchParams.set(`fields[taxonomy_term--${vocabulary}]`, "name,weight");
        firstUrl.searchParams.set("sort", "weight");
        firstUrl.searchParams.set("page[limit]", `${TAXONOMY_PAGE_LIMIT}`);
        if (parentId !== undefined) {
            firstUrl.searchParams.set("filter[parent.id]", parentId);
        }

        const visited = new Set<string>();
        const terms: TaxonomyTerm[] = [];
        let nextUrl: URL | undefined = firstUrl;

        while (nextUrl) {
            if (visited.size >= MAX_TAXONOMY_PAGES) {
                return invalidResponse("Shared Content-taksonomien har for mange sider");
            }
            if (visited.has(nextUrl.href)) {
                return invalidResponse("Shared Content-taksonomien har en løkke i paginering");
            }
            visited.add(nextUrl.href);

            const page = await fetchAndParse(nextUrl, safeParseSharedContentTaxonomy, TAXONOMY_CACHE);
            if (!page.ok) {
                return page;
            }

            for (const resource of page.data.data) {
                terms.push({ id: resource.id, name: resource.attributes.name, weight: resource.attributes.weight });
            }
            if (terms.length > MAX_TAXONOMY_RESOURCES) {
                return invalidResponse("Shared Content-taksonomien har for mange ressurser");
            }

            const nextHref = page.data.links?.next?.href;
            if (nextHref === undefined) {
                break;
            }
            nextUrl = validateNextUrl(nextHref, baseUrl, path);
            if (!nextUrl) {
                return invalidResponse("Shared Content-taksonomien har en ugyldig neste-lenke");
            }
        }

        return { ok: true, data: terms };
    }

    async function getTaxonomyTerms(
        vocabulary: TaxonomyVocabulary,
        options: { parentId?: string } = {},
    ): Promise<SharedContentResult<readonly TaxonomyTerm[]>> {
        if (options.parentId !== undefined && !uuidSchema.safeParse(options.parentId).success) {
            return invalidRequest();
        }

        return instrument("taxonomy", () => fetchTaxonomyPages(vocabulary, options.parentId));
    }

    return {
        ok: true,
        data: {
            getCollection: (filter) => instrument("collection", () => fetchCollectionPages(filter)),
            getArticle,
            getWebformYaml,
            getTaxonomyTerms,
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

// Neste side må ligge på samme HTTPS-origin og samme ressurssti, og må aldri bære API-nøkkel i URL-en.
function validateNextUrl(href: string, baseUrl: URL, expectedPath: string): URL | undefined {
    let nextUrl: URL;
    try {
        nextUrl = new URL(href);
    } catch {
        return undefined;
    }

    if (
        nextUrl.origin !== baseUrl.origin ||
        nextUrl.pathname !== expectedPath ||
        nextUrl.username !== "" ||
        nextUrl.password !== "" ||
        nextUrl.hash !== "" ||
        [...nextUrl.searchParams.keys()].some((key) => key.toLowerCase() === "api-key")
    ) {
        return undefined;
    }
    return nextUrl;
}

// Drupal JSON:API sin IN-betingelse: filter[<gruppe>][condition][path]=<felt>.id, operator IN
// og én verdi per `value[]`. Bare UUID-er som allerede finnes i onboarding-modulen sendes hit
// (se buildOnboardingModule.server.ts), men vi validerer likevel som siste sikkerhetsnett
// før brukerstyrte verdier havner i et eksternt API-kall.
const COLLECTION_FILTER_GROUPS: Readonly<Record<keyof CollectionFilter, Readonly<{ group: string; path: string }>>> = {
    age: { group: "age-group", path: "field_sc_age.id" },
    experience: { group: "experience-group", path: "field_sc_experience.id" },
    audiences: { group: "audiences-group", path: "field_sc_audiences.id" },
};

function applyCollectionFilter(searchParams: URLSearchParams, filter?: CollectionFilter): ClientFailure | undefined {
    if (!filter) {
        return undefined;
    }

    for (const [dimension, { group, path }] of Object.entries(COLLECTION_FILTER_GROUPS) as [
        keyof CollectionFilter,
        Readonly<{ group: string; path: string }>,
    ][]) {
        const values = filter[dimension];
        if (!values || values.length === 0) {
            continue;
        }
        if (values.some((value) => !uuidSchema.safeParse(value).success)) {
            return invalidRequest();
        }

        searchParams.set(`filter[${group}][condition][path]`, path);
        searchParams.set(`filter[${group}][condition][operator]`, "IN");
        for (const value of values) {
            searchParams.append(`filter[${group}][condition][value][]`, value);
        }
    }

    return undefined;
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
