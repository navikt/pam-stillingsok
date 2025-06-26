import { ALLOWED_NUMBER_OF_RESULTS_PER_PAGE, SEARCH_CHUNK_SIZE } from "./query";
import { getVector } from "./getVector";

// eslint-disable-next-line
const elasticSearchRequestBody = async (query: any) => {
    const { from, size } = query;
    let { q } = query;

    if (!q) {
        q = ["kokk"];
    }

    console.log("GO", q);
    //Get vector query
    const test = await getVector(q);
    console.log("ANSWER", test.data[0]);

    // Make vector query array
    const knn = test.data.map((val) => {
        return {
            knn: {
                normalizedAdVector: {
                    k: 10,
                    vector: val.embedding,
                },
            },
        };
    });

    const template = {
        from: from || 0,
        size: size && ALLOWED_NUMBER_OF_RESULTS_PER_PAGE.includes(size) ? size : SEARCH_CHUNK_SIZE,
        track_total_hits: true,

        // query: {
        //     hybrid: {
        //         queries: [
        //             {
        //                 knn: {
        //                     normalizedAdVector: {
        //                         k: 10,
        //                         vector: test.data[0].embedding,
        //                     },
        //                 },
        //             },
        //         ],
        //     },
        // },
        query: {
            hybrid: {
                queries: [...knn],
            },
        },
    };

    return template;
};

export default elasticSearchRequestBody;
