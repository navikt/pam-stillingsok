import type { InitOptions } from "@nais/apm";

type BeforeSendHook = NonNullable<InitOptions["beforeSend"]>;

/**
 * 🔴 Rød sone (personvern): fjerner query-string og fragment fra `meta.page.url`
 * før telemetri sendes til delt Loki. Nais-scrubberen fjerner bare token-parametre,
 * ikke fritekstsøk som `?q=...`.
 */
export const stripQueryFromPageUrl: BeforeSendHook = (item) => {
    // TODO(rød sone): returner en kopi av item der meta.page.url er uten query-string og fragment. Ikke muter item.
    return item;
};
