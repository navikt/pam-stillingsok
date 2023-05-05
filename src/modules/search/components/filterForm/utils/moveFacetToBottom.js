/**
 * Listen over fasetter man får fra backend kan inneholde
 * verdier man ønsker skal komme på bunn av listen, f.eks "Annet"
 *
 * @returns Returnerer en ny liste, hvor et gitt fasettverdi er flyttet til bunn av listen
 */
export default function moveCriteriaToBottom(facets, facetKey) {
    const clone = facets.concat();

    clone.forEach((item, i) => {
        if (item.key === facetKey) {
            clone.push(clone.splice(i, 1)[0]);
        }
    });

    return clone;
}
