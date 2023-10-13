export async function GET() {
    const res = await fetch("https://arbeidsplassen.intern.dev.nav.no/stillinger/api/locations", {
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await res.json();

    return Response.json(data);
}
