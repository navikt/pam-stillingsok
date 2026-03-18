export function editedOccupation(key: string): string {
    return key === "Uoppgitt/ ikke identifiserbare" ? "Ikke oppgitt" : key;
}
/**
 * This ensures that 'Annet' is displayed as 'Ikke oppgitt' in the search filters.
 * It's a mere cosmetic change since the value attributed to the checkbox
 * remains the same. The decision behind this particular change came due to
 * a problem in our structured data where most of the ads coming from different
 * stakeholders don't include the correct classification 'Fast'.
 * @param key
 * @returns {string|*}
 */
export function editedItemKey(key: string): string {
    return key === "Annet" ? "Ikke oppgitt" : key;
}
