/* eslint-disable import/prefer-default-export */
const host = process.env.PAMSEARCHAPI_URL ? process.env.PAMSEARCHAPI_URL : "http://pam-search-api";

function suggest(field, match) {
    return {
        prefix: match,
        completion: {
            field,
            skip_duplicates: true,
            contexts: {
                status: "ACTIVE",
            },
            size: 10,
        },
    };
}

const suggestionsTemplate = (match, minLength) => ({
    suggest: {
        category_suggest: {
            ...suggest("category_name_suggest", match, minLength),
        },
        searchtags_suggest: {
            ...suggest("searchtags_suggest", match, minLength),
        },
    },
    _source: false,
});

export async function POST(request) {
    const query = await request.json();
    const body = suggestionsTemplate(query.match, query.minLength);
    const res = await fetch(`${host}/stillingsok/ad/_search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const data = await res.json();

    return Response.json(data);
}
