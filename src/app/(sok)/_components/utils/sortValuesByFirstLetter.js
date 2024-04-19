/**
 * Sorter publisert basert på egen array
 */
export default function sortValuesByFirstLetter(facets) {
    let clone = facets;

    console.log("INSIDE", facets);
    clone = clone.sort((a, b) => {
        console.log("inside", a.key < b.key);

        return 1;
    });

    console.log("SORTED", clone);
    return clone;
}
