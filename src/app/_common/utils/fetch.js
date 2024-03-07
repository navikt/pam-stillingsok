export function getDefaultHeaders() {
    const headers = new Headers();

    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    return headers;
}
