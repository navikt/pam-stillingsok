/**
 * Sorter publisert basert på egen array
 */
export default function sortRemoteValues(facets) {
    const sortedPublishedValues = ["Hjemmekontor ikke mulig", "Hybridkontor", "Hjemmekontor"];
    const clone = facets;

    clone.sort((a, b) => sortedPublishedValues.indexOf(a.key) - sortedPublishedValues.indexOf(b.key));

    return clone;
}
