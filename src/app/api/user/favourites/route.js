import logger from "@/app/_common/utils/logger";

const mockData = [
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
    {
        uuid: "d28b640b-f2c0-4b16-ac9f-9a9e1e02a16b",
        userUuid: "6718eeab-f8d4-4132-83e6-ab2302a6e8cd",
        favouriteAd: {
            id: 1000,
            uuid: "5904dc99-8533-49f7-8661-f2dd15286e69",
            title: "Fylkestilling",
            applicationdue: "Snarest",
            jobTitle: "Fylkesagronom",
            status: "ACTIVE",
            source: "Stillingsregistrering",
            reference: "5904dc99-8533-49f7-8661-f2dd15286e69",
            updated: "2023-10-13T23:08:01.737758",
            published: "2023-10-13T00:00:00",
            expires: "2023-12-31T00:00:00",
            employer: "Barmhjertig Effektiv Tiger As",
            location: "Agder",
        },
        created: "2023-10-13T23:08:01.739277",
    },
    {
        uuid: "e7ab611e-7ee8-4c8c-9348-4f087b387df0",
        userUuid: "6718eeab-f8d4-4132-83e6-ab2302a6e8cd",
        favouriteAd: {
            id: 1001,
            uuid: "2c26d5f6-3657-437f-ad98-d791d8914a20",
            title: "Gromstad Auto søker ny Servicemedarbeider",
            applicationdue: "23.10.2023",
            jobTitle: "Servicemedarbeider",
            status: "ACTIVE",
            source: "IMPORTAPI",
            reference: "23d832ec-06d0-4b69-be4c-0b3ab9f0196c",
            updated: "2023-10-13T23:08:02.592345",
            published: "2023-09-21T21:38:45.424",
            expires: "2023-10-24T00:00:00",
            employer: "Gromstad Auto",
            location: "Arendal",
        },
        created: "2023-10-13T23:08:02.592478",
    },
    {
        uuid: "29bb83e3-2487-4ce5-a8b0-eb211aefd73a",
        userUuid: "6718eeab-f8d4-4132-83e6-ab2302a6e8cd",
        favouriteAd: {
            id: 1002,
            uuid: "65134f3c-3cb4-4e42-acf0-1e3e84dc07cc",
            title: "Rektor/enhetsleder Høvåg skole",
            applicationdue: "28.03.2024",
            jobTitle: null,
            status: "ACTIVE",
            source: "FINN",
            reference: "142916219",
            updated: "2023-10-13T23:08:03.381231",
            published: "2023-06-13T11:58:50.548807",
            expires: "2024-03-28T02:00:00",
            employer: "Privat",
            location: "Høvåg",
        },
        created: "2023-10-13T23:08:03.381407",
    },
];

export async function GET() {
    logger.info(`GET favoritter`);
    return Response.json({ content: mockData });
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

export async function DELETE(request) {
    logger.info("DELETE uuid", request.nextUrl.searchParams.get("uuid"));
    await new Promise((r) => setTimeout(r, 1000));
    return new Response("", { status: 200 });
}
