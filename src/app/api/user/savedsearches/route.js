const mockData = {
    id: 4187,
    uuid: "123456",
    title: "Kontor og økonomi, Buskerud",
    searchQuery: "?counties[]=BUSKERUD&occupationFirstLevels[]=Kontor%20og%20%C3%B8konomi",
    lastSearched: "2024-02-09T10:37:49.814890837",
    updated: "2024-02-09T10:37:49.817306",
    duration: 30,
    expires: "2024-03-10T10:37:49.814820985",
    status: "ACTIVE",
    notifyType: "EMAIL",
    userUuid: "123456",
};

export async function GET() {
    return Response.json(mockData);
}

export async function POST() {
    return Response.json(mockData);
}

export async function PUT() {
    return Response.json(mockData);
}
