import { AzureOpenAI } from "openai";

// eslint-disable-next-line
export async function getVector(query: string) {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://arbeidsmarked-dev.openai.azure.com";
    const modelName = "text-embedding-3-large";
    const apiKey = process.env.AZURE_OPENAI_KEY || process.env.NEXT_PUBLIC_AZURE_OPENAI_KEY;
    const apiVersion = "2024-04-01-preview";
    const deployment = "arbeidsplassen-embedding-3-large";
    const options = {
        endpoint,
        apiKey,
        deployment,
        apiVersion,
        dangerouslyAllowBrowser: true,
    };

    const client = new AzureOpenAI(options);

    const response = client.embeddings.create({
        input: [query],
        model: modelName,
    });

    return response;
}
