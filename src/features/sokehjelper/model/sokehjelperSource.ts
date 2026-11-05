export const SOKEHJELPER_SOURCE_PARAM = "kilde";
export const SOKEHJELPER_SOURCE_VALUE = "sokehjelper";

/** Merker søke-URL-en slik at søkesiden vet at brukeren kom fra søkehjelperen på forsiden. */
export function withSokehjelperSource(url: string): string {
    const [path, query = ""] = url.split("?");
    const params = new URLSearchParams(query);
    params.set(SOKEHJELPER_SOURCE_PARAM, SOKEHJELPER_SOURCE_VALUE);
    return `${path}?${params.toString()}`;
}
