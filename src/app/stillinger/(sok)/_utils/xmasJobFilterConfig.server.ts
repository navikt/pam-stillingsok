import "server-only";

export function isXmasJobFilterVisible(): boolean {
    const configuredValue = process.env.XMAS_JOB_FILTER_VISIBLE;

    if (configuredValue === "true") {
        return true;
    }

    if (configuredValue === "false") {
        return false;
    }

    // TODO ARB-351: Fjern flagget når julejobbfilteret lanseres.
    return process.env.NODE_ENV !== "production";
}
