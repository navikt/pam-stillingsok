/**
 * Sorter publisert basert på egen array
 */
export default function sortPublishedValues(facets) {
    const sortedPublishedValues = ["now/d", "now-3d", "now-7d"];
    const clone = facets;

    clone.sort((a, b) => sortedPublishedValues.indexOf(a.key) - sortedPublishedValues.indexOf(b.key));

    return clone;
}
