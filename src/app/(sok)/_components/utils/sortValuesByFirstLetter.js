/**
 * Sorter verdier alfabetisk
 */
export default function sortValuesByFirstLetter(facets) {
    const clone = facets;

    clone.sort((a, b) => a.key.localeCompare(b.key, "no"));

    return clone;
}
