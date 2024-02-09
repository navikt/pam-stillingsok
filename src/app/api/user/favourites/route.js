const mockData = {
    content: [
        {
            uuid: "685e37af-355a-43a5-89bf-508bf9267ebf",
            userUuid: "785572b1-5361-42f7-94f4-8d51d61e856e",
            favouriteAd: {
                id: 2253,
                uuid: "37134abf-ffd7-4987-b0a1-770b0817b6e9",
                title: "test job",
                applicationdue: "2024-02-14T00:00:00",
                jobTitle: "test job",
                status: "ACTIVE",
                source: "IMPORTAPI",
                reference: "31233e349bcd43d09fde9e4a98e438f6",
                updated: "2024-02-09T11:19:14.059349",
                published: "2024-02-08T00:00:00",
                expires: "2024-02-14T00:00:00",
                employer:
                    "Unit_Test_Company_b947aacc-204f-45c4-9be4-0438fe2755cc, Unit_Test_Teant_f0b98f1f-bf84-47aa-a163-dccdd0b41c5e",
                location: "Norge",
            },
            created: "2024-02-09T11:19:14.060261",
        },
    ],
};

export async function GET() {
    return Response.json(mockData);
}

export async function POST(request) {
    const body = await request.json();
    const mock = {
        uuid: new Date().getTime(),
        userUuid: "123",
        favouriteAd: body,
        created: "2024-02-09T12:00:53.578776841",
    };
    return Response.json(mock);
}

export async function DELETE() {
    return new Response("", { status: 200 });
}
