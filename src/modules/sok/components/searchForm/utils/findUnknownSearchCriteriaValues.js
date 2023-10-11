/**
 * User may be using an outdated or not currently available search criteria value.
 * For example, if user opens an old link containing ?engagementType=Julejobb,
 * it can happen that 'Julejobb' is not an available value anymore.
 *
 * Returns a list of unknown search criteria values.
 * @param searchCriteriaFromBrowserUrl: Search criteria from the browser url
 * @param searchCriteriaFromApi: Available search criteria from search api
 * @param nestedName, f.eks 'municipals'.
 */
export default function findUnknownSearchCriteriaValues(
    searchCriteriaFromBrowserUrl,
    searchCriteriaFromApi,
    nestedName,
) {
    return searchCriteriaFromBrowserUrl.filter((used) => {
        const found = searchCriteriaFromApi.find((knownValue) => {
            if (nestedName !== undefined && knownValue[nestedName]) {
                return knownValue[nestedName].find((nested) => used === nested.key);
            }
            return used === knownValue.key;
        });

        return found === undefined;
    });
}
