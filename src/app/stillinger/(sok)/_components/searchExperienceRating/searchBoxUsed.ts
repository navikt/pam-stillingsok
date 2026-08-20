const STORAGE_KEY = "ab_search_box_used";

/**
 * Markerer at brukeren har interagert med søkefeltet (combobox eller forenklet input).
 * Kalles fra SearchCombobox og det forenklede søkefeltet.
 */
export function markSearchBoxUsed(): void {
    if (typeof sessionStorage === "undefined") {
        return;
    }

    sessionStorage.setItem(STORAGE_KEY, "1");
}

export function hasSearchBoxBeenUsed(): boolean {
    if (typeof sessionStorage === "undefined") {
        return false;
    }

    return sessionStorage.getItem(STORAGE_KEY) === "1";
}
