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

export async function GET() {
    return Response.json(mockData);
}

export async function POST() {
    return new Response("", { status: 200 });
}

export async function PUT() {
    return new Response("", { status: 200 });
}
