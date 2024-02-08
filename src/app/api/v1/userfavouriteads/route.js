import mockData from "./mock-data";

export async function GET(request) {
    const sort = request.nextUrl.searchParams.get("sort");
    console.log(`GET userfavouriteads sort: ${sort}`);

    if (sort === "published") {
        mockData.sort((a, b) => b.favouriteAd.published.localeCompare(a.favouriteAd.published));
    } else if (sort === "expires") {
        mockData.sort((a, b) => b.favouriteAd.expires.localeCompare(a.favouriteAd.expires));
    }

    return Response.json(mockData);
}
