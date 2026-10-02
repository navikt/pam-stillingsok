import "server-only";
import type { ArticleSummary, Selection } from "@/features/ung/onboarding/domain/types";

export type MetadataDimension = "age" | "experience" | "audience";

export const METADATA_TERM_TYPES: Readonly<Record<MetadataDimension, string>> = {
    age: "taxonomy_term--shared_content_age",
    experience: "taxonomy_term--shared_content_experience",
    audience: "taxonomy_term--situations",
};

type AnswerTermMapping = Readonly<{
    dimension: MetadataDimension;
    termIds: readonly string[];
}>;

/**
 * ARBEIDSANTAKELSE: Term-UUID-ene er hentet fra de sanerte fixturene (collection.json og on_its_own.json)
 * og er IKKE bekreftet av API-teamet. Fixturene eksponerer ikke navnene på alders- og erfaringstermer,
 * og to situation-termer er utelatt via meta.omitted, så koblingen mellom svar og term er en antakelse.
 * En tom liste betyr at ingen kjent term finnes ennå. Slike svar matcher ingen artikler.
 * Bekreft tabellen med API-teamet før SHARED_CONTENT_SOURCE=live aktiveres i dev.
 * Titler og termnavn skal aldri brukes som stabile nøkler.
 */
export const ANSWER_TERM_MAPPING: Readonly<Record<string, AnswerTermMapping>> = {
    "age-under-18": { dimension: "age", termIds: ["7d074491-7231-4c1c-aef3-bdd917776198"] },
    "age-18-or-older": { dimension: "age", termIds: ["5be5c5a4-c191-4f00-9ad1-cc4ac365da78"] },
    "situation-no-experience": { dimension: "experience", termIds: ["a2dc822c-1eea-4201-bf2e-bcd61077ca05"] },
    "situation-some-experience": { dimension: "experience", termIds: ["0fd8124e-edf2-459d-9986-7fb2167dd3da"] },
    "situation-looking-for-change": { dimension: "experience", termIds: [] },
    "goal-find-job": { dimension: "audience", termIds: ["03c6bc26-0b80-42c0-95aa-d001c6e9c5e2"] },
    "goal-apply": { dimension: "audience", termIds: ["cb90945e-a2c4-4a50-8dcb-438c1fe69764"] },
    "goal-interview": { dimension: "audience", termIds: ["ccdaef9c-c649-4a1e-a6bf-3fba1ec39255"] },
    "goal-rights": { dimension: "audience", termIds: [] },
    "goal-support": { dimension: "audience", termIds: ["e3e36196-3627-4ce9-8b35-5a7790489618"] },
};

type DimensionFilter = Readonly<Record<MetadataDimension, ReadonlySet<string> | undefined>>;

function buildDimensionFilter(selection: Selection): DimensionFilter {
    const termIds: Record<MetadataDimension, Set<string> | undefined> = {
        age: undefined,
        experience: undefined,
        audience: undefined,
    };

    for (const answerId of selection.answerIds) {
        const mapping = ANSWER_TERM_MAPPING[answerId];
        if (!mapping) {
            continue;
        }
        const dimensionTermIds = termIds[mapping.dimension] ?? new Set<string>();
        for (const termId of mapping.termIds) {
            dimensionTermIds.add(termId);
        }
        termIds[mapping.dimension] = dimensionTermIds;
    }

    return termIds;
}

function matchesDimension(articleTermIds: readonly string[], filter: ReadonlySet<string> | undefined): boolean {
    if (filter === undefined) {
        return true;
    }
    return articleTermIds.some((termId) => filter.has(termId));
}

/**
 * AND mellom dimensjoner med valg, OR innad i en dimensjon.
 * Manglende metadata matcher ikke et valgt filter. Tomt valg viser alt.
 * Rekkefølgen fra API-et bevares, og duplikater (samme id) fjernes.
 */
export function matchArticles(articles: readonly ArticleSummary[], selection: Selection): readonly ArticleSummary[] {
    const filter = buildDimensionFilter(selection);
    const seen = new Set<string>();

    return articles.filter((article) => {
        const key = `node--shared_content:${article.id}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);

        return (
            matchesDimension(article.metadata.ageTermIds, filter.age) &&
            matchesDimension(article.metadata.experienceTermIds, filter.experience) &&
            matchesDimension(article.metadata.audienceTermIds, filter.audience)
        );
    });
}
