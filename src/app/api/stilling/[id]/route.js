import { excludes } from "../../../stilling/[id]/page";

/**
 * Note: This endpoint is used by pam-aduser
 */
export async function GET(request, { params }) {
    const res = await fetch(
        `${process.env.PAMSEARCHAPI_URL}/stillingsok/ad/ad/${params.id}?_source_excludes=${excludes}`,
        {
            headers: {
                "Content-Type": "application/json",
            },
        },
    );

    if (res.status === 404) {
        return new Response("Not found", { status: 404 });
    }

    if (!res.ok) {
        Response.error();
    }

    const data = await res.json();

    return Response.json(data);
}
