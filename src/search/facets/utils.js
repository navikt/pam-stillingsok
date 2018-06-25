export function moveFacetToBottom(array, itemKey) {
    const clone = array.concat();

    clone.forEach((item, i) => {
        if (item.key === itemKey) {
            // Flytter elementet til bunn av listen
            clone.push(clone.splice(i, 1)[0]);
        }
    });

    return clone;
}

/**
 * Hvilke fasetter som er tilgjengelige vil variere over tid. F.eks hvis det ikke finnes
 * ledige stilinger med ansetteleseform 'Sessong', vil heller ikke dette være en mulig fasett.
 * Bruker kan likevel ha en gammel lenke/bokmerke &engagementType=Sesong som inneholder utilgjengelige fasetter.
 * Fjern derfor fasetter fra søket som ikke er tilgjengelige.
 * @param checkedFacets
 * @param actualFacets
 */
export function removeNonExistingFacets(checkedFacets, facets) {
    return checkedFacets.filter((checked) => {
        const found = facets.find((facet) => (
            checked === facet.key
        ));
        return found !== undefined;
    });
}

/**
 * Fjener utilgjengelige fasetter fra fasettgrupper med to nivå.
 * @param checkedFacets
 * @param facets
 * @param nestedName f.eks 'municipals'
 */
export function removeNonExistingNestedFacets(checkedFacets, facets, nestedName) {
    return checkedFacets.filter((checked) => {
        const found = facets.find((facet) => facet[nestedName].find((nested) => checked === nested.key));
        return found !== undefined;
    });
}
