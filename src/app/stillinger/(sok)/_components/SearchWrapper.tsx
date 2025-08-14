"use client";

import React from "react";
import Search from "@/app/stillinger/(sok)/_components/Search";
import { QueryProvider } from "@/app/stillinger/(sok)/_components/QueryProvider";
import FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { FetchError } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { SearchLocation } from "@/app/stillinger/(sok)/page";
// import { AzureOpenAI } from "openai";

type SearchWrapperProps = {
    searchResult: SearchResult;
    aggregations: FilterAggregations;
    locations: SearchLocation[];
    postcodes: Postcode[];
    resultsPerPage: number;
    errors: FetchError[];
};
const SearchWrapper = ({
    searchResult,
    aggregations,
    locations,
    postcodes,
    resultsPerPage,
    errors,
}: SearchWrapperProps) => {
    // const endpoint = "https://arbeidsmarked-dev.openai.azure.com/";
    // const modelName = "text-embedding-3-large";
    // const apiKey = process.env.NEXT_PUBLIC_AZURE_OPENAI_KEY;
    // const apiVersion = "2024-04-01-preview";
    // const deployment = "arbeidsplassen-embedding-3-large";
    // const options = { endpoint, apiKey, deployment, apiVersion, dangerouslyAllowBrowser: true };

    // const client = new AzureOpenAI(options);

    // const response = await client.embeddings.create({
    //     input: ["tester"],
    //     model: modelName,
    // });

    // for (const item of response.data) {
    //     let length = item.embedding.length;
    //     console.log(
    //         `data[$ {item.index}]: length=$ {length}, ` +
    //             `[$ {item.embedding[0]}, $ {item.embedding[1]}, ` +
    //             `..., $ {item.embedding[length - 2]}, $ {item.embedding[length -1]}]`,
    //     );
    // }
    // console.log(response.usage);
    // console.log("RESPONSE", response.data[0].embedding);

    // main().catch((err) => {
    //     console.error("The sample encountered an error:", err);
    // });

    return (
        <QueryProvider>
            <Search
                searchResult={searchResult}
                locations={locations}
                aggregations={aggregations}
                postcodes={postcodes}
                resultsPerPage={resultsPerPage}
                errors={errors}
            />
        </QueryProvider>
    );
};
export default SearchWrapper;
