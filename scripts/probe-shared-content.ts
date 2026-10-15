import { loadEnvFile } from "node:process";
import { buildOnboardingModule } from "../src/features/ung/enklere-vei-til-jobb/server/drupal/buildOnboardingModule.server";
import {
    getSharedContentClient,
    getSharedContentGoalsParentId,
    type SharedContentClient,
    type TaxonomyTerm,
    type TaxonomyVocabulary,
} from "../src/features/ung/enklere-vei-til-jobb/server/drupal/drupalClient.server";
import type { JsonApiDocument, JsonApiResource } from "../src/features/ung/enklere-vei-til-jobb/server/drupal/jsonApi";

const DEFAULT_API_URL = "https://cms.staging.karriereveiledning.no";

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

/**
 * Henter de tre taxonomy-vokabularene onboarding-valgene bygges fra (se
 * buildOnboardingModule.server.ts). `situations` filtreres på ankeret for mål
 * (SHARED_CONTENT_GOALS_PARENT_ID), de to andre hentes uten parentId-filter.
 */
async function probeTaxonomy(
    client: SharedContentClient,
    goalsParentId: string,
): Promise<{
    ok: boolean;
    termsByVocabulary: Partial<Record<TaxonomyVocabulary, readonly TaxonomyTerm[]>>;
}> {
    const vocabularies: ReadonlyArray<{ vocabulary: TaxonomyVocabulary; parentId?: string }> = [
        { vocabulary: "shared_content_age" },
        { vocabulary: "shared_content_experience" },
        {
            vocabulary: "situations",
            parentId: goalsParentId,
        },
    ];

    const termsByVocabulary: Partial<Record<TaxonomyVocabulary, readonly TaxonomyTerm[]>> = {};
    let ok = true;
    for (const { vocabulary, parentId } of vocabularies) {
        const result = await client.getTaxonomyTerms(vocabulary, { parentId });
        if (!result.ok) {
            console.error(`Taxonomy-probe feilet for ${vocabulary}: ${result.error.type} ${result.error.message}`);
            ok = false;
            continue;
        }
        termsByVocabulary[vocabulary] = result.data;
        console.log(
            `${vocabulary}: ${result.data.length} term(er) -> ${result.data
                .map((term) => `${term.name} (${term.id}, vekt ${term.weight})`)
                .join(", ")}`,
        );
    }
    return { ok, termsByVocabulary };
}

/**
 * Demonstrerer filtrert samlingshenting: bruker første term fra age-vokabularet (hvis den finnes)
 * som filter, og sammenligner med en uten filter for å vise at filteret faktisk begrenser treff.
 */
async function probeFilteredCollection(
    client: SharedContentClient,
    termsByVocabulary: Partial<Record<TaxonomyVocabulary, readonly TaxonomyTerm[]>>,
): Promise<boolean> {
    const unfilteredResult = await client.getCollection();
    if (!unfilteredResult.ok) {
        console.error(`Uten filter feilet: ${unfilteredResult.error.type} ${unfilteredResult.error.message}`);
        return false;
    }
    console.log(`Uten filter: ${unfilteredResult.data.data.length} artikler.`);

    const firstAgeTerm = termsByVocabulary.shared_content_age?.[0];
    if (!firstAgeTerm) {
        console.error("Ingen age-term å filtrere på, kan ikke kontrollere filtrert samlingskall.");
        return false;
    }

    const filteredResult = await client.getCollection({ age: [firstAgeTerm.id] });
    if (!filteredResult.ok) {
        console.error(`Med filter feilet: ${filteredResult.error.type} ${filteredResult.error.message}`);
        return false;
    }
    console.log(
        `Filtrert på age=${firstAgeTerm.name} (${firstAgeTerm.id}): ${filteredResult.data.data.length} artikler.`,
    );
    return true;
}

/** Valgfri sekundær sjekk: henter én artikkel med full `include`, slik `getArticle` gjør i appen. */
async function probeArticle(client: SharedContentClient): Promise<boolean> {
    const resourceId = process.env.SHARED_CONTENT_PROBE_ARTICLE_ID;
    if (!resourceId) {
        return true;
    }
    const documentResult = await client.getArticle(resourceId);
    if (!documentResult.ok) {
        const status = documentResult.error.type === "http" ? ` (${documentResult.error.status})` : "";
        console.error(`Artikkel-probe feilet: ${documentResult.error.type}${status}: ${documentResult.error.message}`);
        return false;
    }
    console.log(JSON.stringify(summarizeSharedContentDocument(documentResult.data), null, 2));
    return true;
}

/**
 * Prober onboarding-kontrakten ved å kjøre lokal struktur og taxonomy gjennom den ekte
 * module-builderen. Logger bare struktur (antall steg/spørsmål/valg per dimensjon), aldri
 * spørsmålstekst, svaretiketter eller ID-er.
 */
async function probeOnboardingModule(client: SharedContentClient): Promise<boolean> {
    const moduleResult = await buildOnboardingModule(client);
    if (!moduleResult.ok) {
        console.error(`Onboarding-probe feilet: ${moduleResult.error.type} ${moduleResult.error.message}`);
        return false;
    }

    const { module } = moduleResult.data;
    console.log(
        `Onboarding-modul: ${module.steps.length} steg, ${module.steps.reduce((sum, step) => sum + step.questions.length, 0)} spørsmål totalt.`,
    );
    for (const step of module.steps) {
        console.log(
            `  Steg: ${step.questions.length} spørsmål -> ${step.questions
                .map((question) => `${question.controlType} (${question.options.length} valg)`)
                .join(", ")}`,
        );
    }
    return true;
}

async function main(): Promise<void> {
    loadLocalEnvironment();
    process.env.SHARED_CONTENT_API_URL ??= DEFAULT_API_URL;

    const clientResult = getSharedContentClient();
    if (!clientResult.ok) {
        fail(`${clientResult.error.type}: ${clientResult.error.message}`);
        return;
    }

    const goalsParentIdResult = getSharedContentGoalsParentId();
    if (!goalsParentIdResult.ok) {
        fail(`${goalsParentIdResult.error.type}: ${goalsParentIdResult.error.message}`);
        return;
    }

    const taxonomy = await probeTaxonomy(clientResult.data, goalsParentIdResult.data);
    const collectionOk = await probeFilteredCollection(clientResult.data, taxonomy.termsByVocabulary);
    const articleOk = await probeArticle(clientResult.data);
    const onboardingOk = await probeOnboardingModule(clientResult.data);

    if (!taxonomy.ok || !collectionOk || !articleOk || !onboardingOk) {
        fail("én eller flere kontroller feilet");
    }
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
