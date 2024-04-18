/**
 * Sorter utdanningsnivå basert på egen array
 */
export default function sortEducationValues(facets) {
    const sortedEducationValues = ["Ingen krav", "Videregående", "Fagskole", "Bachelor", "Master", "Ikke oppgitt"];
    const clone = facets;

    clone.sort((a, b) => sortedEducationValues.indexOf(a.key) - sortedEducationValues.indexOf(b.key));

    return clone;
}
