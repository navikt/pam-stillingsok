/**
 * Sorter publisert basert på egen array
 */
export default function sortRemoteValues(facets) {
    const sortedPublishedValues = ["Hybridkontor", "Hjemmekontor", "Hjemmekontor ikke mulig"];
    const clone = facets;

    clone.sort((a, b) => sortedPublishedValues.indexOf(a.key) - sortedPublishedValues.indexOf(b.key));

    return clone;
}
