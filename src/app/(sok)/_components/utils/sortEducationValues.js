/**
 * Sorter publisert basert på egen array
 */
export default function sortEducationValues(facets) {
    const sortedPublishedValues = [
        "Ingen krav",
        "Videregående",
        "Fagbrev",
        "Fagskole",
        "Bachelor",
        "Master",
        "Forskningsgrad",
    ];
    const clone = facets;

    clone.sort((a, b) => sortedPublishedValues.indexOf(a.key) - sortedPublishedValues.indexOf(b.key));

    return clone;
}
