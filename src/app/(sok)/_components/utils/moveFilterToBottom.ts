import { FilterAggregation } from "@/app/(sok)/_types/FilterAggregations";

/**
 * Listen over filtre man får fra backend kan inneholde
 * verdier man ønsker skal komme på bunn av listen, f.eks "Annet"
 *
 * @returns Returnerer en ny liste, hvor et innsendt filter er flyttet til bunn av listen
 */
export default function moveFilterToBottom(filters: FilterAggregation[], filterToBeMoved: string): FilterAggregation[] {
    const clone = filters.concat();

    clone.forEach((item, i) => {
        if (item.key === filterToBeMoved) {
            clone.push(clone.splice(i, 1)[0]);
        }
    });

    return clone;
}
