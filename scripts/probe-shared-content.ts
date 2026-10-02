import { loadEnvFile } from "node:process";
import { getSharedContentClient } from "../src/features/ung/onboarding/server/sharedContentClient.server";
import type { JsonApiDocument, JsonApiResource } from "../src/features/ung/onboarding/server/sharedContentSchemas";

const DEFAULT_API_URL = "https://cms.staging.karriereveiledning.no";
const DEFAULT_RESOURCE_ID = "8eb7f9d6-361c-4ac0-92c6-b272374e84d5";

function summarizeSharedContentDocument(document: JsonApiDocument) {
    const includedByType = new Map<
        string,
        {
            count: number;
            attributeNames: Set<string>;
            relationshipNames: Set<string>;
        }
    >();

    for (const resource of document.included) {
        const current = includedByType.get(resource.type) ?? {
            count: 0,
            attributeNames: new Set<string>(),
            relationshipNames: new Set<string>(),
        };
        current.count += 1;
        for (const attributeName of Object.keys(resource.attributes)) {
            current.attributeNames.add(attributeName);
        }
        for (const relationshipName of Object.keys(resource.relationships ?? {})) {
            current.relationshipNames.add(relationshipName);
        }
        includedByType.set(resource.type, current);
    }

    return {
        primary: summarizeResource(document.data),
        included: [...includedByType.entries()]
            .sort(([leftType], [rightType]) => leftType.localeCompare(rightType, "en"))
            .map(([type, summary]) => ({
                type,
                count: summary.count,
                attributeNames: [...summary.attributeNames].sort(),
                relationshipNames: [...summary.relationshipNames].sort(),
            })),
    };
}

function summarizeResource(resource: JsonApiResource) {
    return {
        type: resource.type,
        id: resource.id,
        attributeNames: Object.keys(resource.attributes).sort(),
        relationshipNames: Object.keys(resource.relationships ?? {}).sort(),
    };
}

async function main(): Promise<void> {
    loadLocalEnvironment();
    process.env.SHARED_CONTENT_API_URL ??= DEFAULT_API_URL;
    const resourceId = process.env.SHARED_CONTENT_PROBE_ID ?? DEFAULT_RESOURCE_ID;

    const clientResult = getSharedContentClient();
    if (!clientResult.ok) {
        fail(`${clientResult.error.type}: ${clientResult.error.message}`);
        return;
    }

    const documentResult = await clientResult.data.getArticle(resourceId);
    if (!documentResult.ok) {
        const status = documentResult.error.type === "http" ? ` (${documentResult.error.status})` : "";
        fail(`${documentResult.error.type}${status}: ${documentResult.error.message}`);
        return;
    }

    console.log(JSON.stringify(summarizeSharedContentDocument(documentResult.data), null, 2));
}

function loadLocalEnvironment(): void {
    try {
        loadEnvFile(".env.local");
    } catch (error) {
        if (!isMissingFileError(error)) {
            throw error;
        }
    }
}

function isMissingFileError(error: unknown): error is NodeJS.ErrnoException {
    return error instanceof Error && "code" in error && error.code === "ENOENT";
}

function fail(message: string): void {
    console.error(`Shared Content-probe feilet: ${message}`);
    process.exitCode = 1;
}

await main();
