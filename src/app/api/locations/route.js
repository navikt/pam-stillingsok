export const dynamic = "force-dynamic";

export async function GET() {
    const res = await fetch("http://localhost:3000/stillinger/api/locations", {
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await res.json();

    return Response.json(data);
}
