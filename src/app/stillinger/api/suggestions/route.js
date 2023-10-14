export async function GET(request) {
    const url = new URL(request.url);
    const res = await fetch(`https://arbeidsplassen.intern.dev.nav.no/stillinger/api/suggestions${url.search}`, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await res.json();

    return Response.json(data);
}
