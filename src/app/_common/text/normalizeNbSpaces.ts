export function normalizeNbSpaces(value: string): string {
    return value.replace(/[\u00A0\u202F]/g, " ");
}
