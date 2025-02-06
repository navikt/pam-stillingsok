export async function fetchAiSearchData(queryText: string) {
    console.log("search for", queryText);
    if (process.env.AZURE_SEARCH_KEY) {
        console.log("has key");
    }

    let response = null;
    try {
        response = await fetch(
            "https://ai-stillingsok-poc.search.windows.net/indexes/vector-1738060588317-properties-adtext-test/docs/search?api-version=2024-07-01",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": process.env.AZURE_SEARCH_KEY || "",
                },
                body: JSON.stringify({
                    count: true,
                    select: "properties/jobtitle, properties/applicationdue, title, employer, locationList, published",
                    vectorQueries: [
                        {
                            kind: "text",
                            text: queryText,
                            fields: "text_vector",
                        },
                    ],
                }),
            },
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch AI search data: ${response.statusText}`);
        }

        console.log("response AI", response);
        return response.json();
    } catch (e) {
        console.log("ai get error", e);
    }
}
