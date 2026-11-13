import type { InitOptions } from "@nais/apm";

type BeforeSendHook = NonNullable<InitOptions["beforeSend"]>;

const FREE_TEXT_PARAM = "q";

export function removeFreeTextParams(url: string): string {
    const hashIndex = url.indexOf("#");
    const fragment = hashIndex === -1 ? "" : url.slice(hashIndex);
    const withoutFragment = hashIndex === -1 ? url : url.slice(0, hashIndex);

    const queryIndex = withoutFragment.indexOf("?");
    if (queryIndex === -1) {
        return url;
    }

    const params = new URLSearchParams(withoutFragment.slice(queryIndex + 1));
    if (!params.has(FREE_TEXT_PARAM)) {
        return url;
    }

    params.delete(FREE_TEXT_PARAM);
    const remainingQuery = params.toString();
    const base = withoutFragment.slice(0, queryIndex);

    return `${base}${remainingQuery ? `?${remainingQuery}` : ""}${fragment}`;
}

/**
 * 🔴 Rød sone (personvern): fjerner fritekstsøk (`q`) fra `meta.page.url` før telemetri
 * sendes til delt Loki. Nais-scrubberen maskerer fnr, e-post og token, men ikke fritekst.
 */
export const stripFreeTextFromPageUrl: BeforeSendHook = (item) => {
    const page = item.meta?.page;
    if (!page?.url) {
        return item;
    }

    const cleanedUrl = removeFreeTextParams(page.url);
    if (cleanedUrl === page.url) {
        return item;
    }

    return {
        ...item,
        meta: { ...item.meta, page: { ...page, url: cleanedUrl } },
    };
};
