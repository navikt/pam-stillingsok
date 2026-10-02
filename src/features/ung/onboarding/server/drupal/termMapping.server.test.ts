import { describe, expect, it } from "vitest";
import type { ArticleSummary } from "@/features/ung/onboarding/domain/results";
import { ANSWER_TERM_MAPPING, matchArticles } from "@/features/ung/onboarding/server/drupal/termMapping.server";
import { onboardingModule } from "@/features/ung/onboarding/server/local/onboardingModule";

const AGE_UNDER_18 = "5be5c5a4-c191-4f00-9ad1-cc4ac365da78";
const AGE_18_PLUS = "7d074491-7231-4c1c-aef3-bdd917776198";
const EXPERIENCE_NONE = "0fd8124e-edf2-459d-9986-7fb2167dd3da";
const EXPERIENCE_SOME = "a2dc822c-1eea-4201-bf2e-bcd61077ca05";
const GOAL_FIND_JOB = "03c6bc26-0b80-42c0-95aa-d001c6e9c5e2";
const GOAL_INTERVIEW = "ccdaef9c-c649-4a1e-a6bf-3fba1ec39255";

function article(id: string, metadata: Partial<ArticleSummary["metadata"]> = {}): ArticleSummary {
    return {
        id,
        type: "article",
        title: id,
        description: "",
        href: `/a/${id}`,
        metadata: { ageTermIds: [], experienceTermIds: [], audienceTermIds: [], ...metadata },
    };
}

const articles = [
    article("a", {
        ageTermIds: [AGE_UNDER_18],
        experienceTermIds: [EXPERIENCE_NONE],
        audienceTermIds: [GOAL_FIND_JOB],
    }),
    article("b", {
        ageTermIds: [AGE_18_PLUS],
        experienceTermIds: [EXPERIENCE_SOME],
        audienceTermIds: [GOAL_INTERVIEW],
    }),
    article("c", { ageTermIds: [AGE_UNDER_18], experienceTermIds: [EXPERIENCE_SOME], audienceTermIds: [] }),
];

function ids(selection: readonly string[]): string[] {
    return matchArticles(articles, { answerIds: selection }).map((match) => match.id);
}

describe("matchArticles", () => {
    it("viser alle artikler i API-rekkefølge ved tom selection", () => {
        expect(ids([])).toEqual(["a", "b", "c"]);
    });

    it("filtrerer på én dimensjon", () => {
        expect(ids(["age-under-18"])).toEqual(["a", "c"]);
        expect(ids(["situation-some-experience"])).toEqual(["b", "c"]);
    });

    it("bruker AND mellom dimensjoner", () => {
        expect(ids(["age-under-18", "situation-some-experience"])).toEqual(["c"]);
        expect(ids(["age-under-18", "goal-interview"])).toEqual([]);
    });

    it("bruker OR innad i mål-dimensjonen", () => {
        expect(ids(["goal-find-job", "goal-interview"])).toEqual(["a", "b"]);
    });

    it("lar manglende metadata feile et valgt filter", () => {
        expect(ids(["goal-find-job", "goal-interview", "goal-support"])).toEqual(["a", "b"]);
        expect(ids(["goal-find-job"])).not.toContain("c");
    });

    it("matcher ingenting når valgt svar mangler kjent term", () => {
        expect(ids(["goal-rights"])).toEqual([]);
        expect(ids(["situation-looking-for-change"])).toEqual([]);
    });

    it("dedupliserer på id og beholder første forekomst", () => {
        const duplicated = [articles[1], articles[0], articles[1]].filter((item) => item !== undefined);

        expect(matchArticles(duplicated, { answerIds: [] }).map((match) => match.id)).toEqual(["b", "a"]);
    });
});

describe("ANSWER_TERM_MAPPING", () => {
    it("dekker alle lokale onboarding-svar", () => {
        const optionIds = onboardingModule.questions
            .flatMap((question) => question.options.map((option) => option.id))
            .sort();

        expect(Object.keys(ANSWER_TERM_MAPPING).sort()).toEqual(optionIds);
    });
});
