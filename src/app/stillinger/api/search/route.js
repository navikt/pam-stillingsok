export async function GET(request) {
    const url = new URL(request.url);
    const res = await fetch(`http://localhost:3000/stillinger/api/search${url.search}`, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await res.json();

    return Response.json(data);
}
