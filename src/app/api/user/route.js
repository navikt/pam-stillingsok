import { validateToken, requestTokenxOboToken, getToken } from "@navikt/oasis";

const mockData = {
    id: 1212,
    uuid: "12121212",
    email: "sadasdasdsadasd@asdasdasdasdasdasdasdasdas.dasdasdasdasdas",
    name: "Nesnødd Flaggermus",
    acceptedTerms: "true",
    updated: "2024-02-09T10:37:26.641063",
    created: "2023-12-14T16:03:16.299817",
    verifiedEmail: false,
};

export const dynamic = "force-dynamic";

export async function GET(req) {
    console.log("Get token");
    const token = getToken(req);
    console.log("Validate token");
    const validationResult = await validateToken(token);

    if (!validationResult.ok) {
        console.log("Validate not ok");
        return new Response(null, { status: 401 });
    }
    console.log("Validate ok");

    console.log("Exchange token");
    const oboRes = await requestTokenxOboToken(token, process.env.ADUSER_AUDIENCE);
    if (!oboRes.ok) {
        console.error("Failed to exchange token");
        console.error(oboRes.error.message);
        console.error(oboRes.error);
        return new Response(null, { status: 500 });
    }

    console.log("Exchange token ok");

    console.log("Fetching from adser");
    let url = `${process.env.PAMADUSER_URL}/api/v1/user`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${oboRes.token}`,
        },
    });

    console.log("Fetching done");

    if (!res.ok) {
        console.error("Failed to fetch from aduser");
        console.error(res.status);
        return new Response(null, { status: res.status });
    }

    console.log("Fetching ok");

    let data = await res.json();
    return Response.json(data);
}

export async function POST() {
    return new Response("", { status: 200 });
}

export async function PUT() {
    return new Response("", { status: 200 });
}
