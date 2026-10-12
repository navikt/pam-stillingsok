import { describe, expect, it } from "vitest";
import type { OnboardingModule } from "@/features/ung/onboarding/domain/onboarding";
import {
    ARTICLE_PATH,
    buildArticleHref,
    buildJobQuizHref,
    buildResultHref,
    decodeSelectionParams,
    encodeSelectionParams,
    JOB_QUIZ_PATH,
    RESULT_PATH,
} from "@/features/ung/onboarding/domain/selectionParams";

const AGE_UNDER_18 = "11111111-1111-1111-1111-111111111111";
const AGE_18_OR_OLDER = "22222222-2222-2222-2222-222222222222";
const GOAL_FIND_JOB = "33333333-3333-3333-3333-333333333333";
const GOAL_APPLY = "44444444-4444-4444-4444-444444444444";

const module: OnboardingModule = {
    id: "module",
    title: "Tittel",
    intro: "Ingress",
    resultTitle: "Resultat",
    resultIntro: "Resultatingress",
    steps: [
        {
            id: "step-1",
            title: "Steg 1",
            questions: [
                {
                    id: "age",
                    title: "Alder",
                    controlType: "radios",
                    required: true,
                    multiple: false,
                    dimension: "age",
                    options: [
                        { id: AGE_UNDER_18, label: "Under 18 år" },
                        { id: AGE_18_OR_OLDER, label: "18 år eller eldre" },
                    ],
                },
            ],
        },
        {
            id: "step-2",
            title: "Steg 2",
            questions: [
                {
                    id: "goals",
                    title: "Mål",
                    controlType: "checkboxes",
                    required: false,
                    multiple: true,
                    dimension: "audiences",
                    options: [
                        { id: GOAL_FIND_JOB, label: "Finne en jobb" },
                        { id: GOAL_APPLY, label: "Søke på stillinger" },
                    ],
                },
            ],
        },
    ],
};

describe("selectionParams", () => {
    describe("decodeSelectionParams", () => {
        it("bruker første alternativ som standard for enkeltvalgsspørsmål når ingenting er svart", () => {
            const searchParams = new URLSearchParams();

            expect(decodeSelectionParams(searchParams, module)).toEqual({
                ok: true,
                selection: {
                    age: { dimension: "age", optionIds: [AGE_UNDER_18] },
                },
            });
        });

        it("lar et valgfritt flervalgsspørsmål være tomt", () => {
            const searchParams = new URLSearchParams({ age: `age:${AGE_18_OR_OLDER}` });

            expect(decodeSelectionParams(searchParams, module)).toEqual({
                ok: true,
                selection: {
                    age: { dimension: "age", optionIds: [AGE_18_OR_OLDER] },
                },
            });
        });

        it("tar vare på flere verdier for et flervalgsspørsmål i Webform-rekkefølge", () => {
            const searchParams = new URLSearchParams([
                ["goals", `audiences:${GOAL_APPLY}`],
                ["goals", `audiences:${GOAL_FIND_JOB}`],
            ]);

            expect(decodeSelectionParams(searchParams, module)).toEqual({
                ok: true,
                selection: {
                    age: { dimension: "age", optionIds: [AGE_UNDER_18] },
                    goals: { dimension: "audiences", optionIds: [GOAL_APPLY, GOAL_FIND_JOB] },
                },
            });
        });

        it("fjerner duplikate verdier for et flervalgsspørsmål", () => {
            const searchParams = new URLSearchParams([
                ["goals", `audiences:${GOAL_APPLY}`],
                ["goals", `audiences:${GOAL_APPLY}`],
            ]);

            expect(decodeSelectionParams(searchParams, module)).toEqual({
                ok: true,
                selection: {
                    age: { dimension: "age", optionIds: [AGE_UNDER_18] },
                    goals: { dimension: "audiences", optionIds: [GOAL_APPLY] },
                },
            });
        });

        it("faller tilbake til første gyldige alternativ når en utgått/upublisert term oppgis for enkeltvalg", () => {
            const searchParams = new URLSearchParams({ age: "age:99999999-9999-9999-9999-999999999999" });

            expect(decodeSelectionParams(searchParams, module)).toEqual({
                ok: true,
                selection: {
                    age: { dimension: "age", optionIds: [AGE_UNDER_18] },
                },
            });
        });

        it("ignorerer en utgått/upublisert term for flervalg uten å feile", () => {
            const searchParams = new URLSearchParams([
                ["goals", `audiences:${GOAL_FIND_JOB}`],
                ["goals", "audiences:99999999-9999-9999-9999-999999999999"],
            ]);

            expect(decodeSelectionParams(searchParams, module)).toEqual({
                ok: true,
                selection: {
                    age: { dimension: "age", optionIds: [AGE_UNDER_18] },
                    goals: { dimension: "audiences", optionIds: [GOAL_FIND_JOB] },
                },
            });
        });

        it("avviser flere verdier for et enkeltvalgsspørsmål som en hard feil (ikke stille trunkering)", () => {
            const searchParams = new URLSearchParams([
                ["age", `age:${AGE_UNDER_18}`],
                ["age", `age:${AGE_18_OR_OLDER}`],
            ]);

            expect(decodeSelectionParams(searchParams, module)).toEqual({
                ok: false,
                reason: "multiple-values-for-single-choice",
            });
        });

        it("avviser en syntaktisk ugyldig verdi (feil dimensjon-prefiks)", () => {
            const searchParams = new URLSearchParams({ age: `experience:${AGE_UNDER_18}` });

            expect(decodeSelectionParams(searchParams, module)).toEqual({
                ok: false,
                reason: "malformed-value",
            });
        });

        it("avviser en syntaktisk ugyldig verdi (ikke UUID-formet)", () => {
            const searchParams = new URLSearchParams({ age: "age:ikke-en-uuid" });

            expect(decodeSelectionParams(searchParams, module)).toEqual({
                ok: false,
                reason: "malformed-value",
            });
        });

        it("avviser en verdi som er for lang", () => {
            const searchParams = new URLSearchParams({ age: `age:${AGE_UNDER_18}${"a".repeat(100)}` });

            expect(decodeSelectionParams(searchParams, module)).toEqual({
                ok: false,
                reason: "value-too-long",
            });
        });

        it("avviser for mange totale verdier før semantisk validering", () => {
            const searchParams = new URLSearchParams();
            for (let index = 0; index < 101; index += 1) {
                searchParams.append("goals", `audiences:${GOAL_APPLY}`);
            }

            expect(decodeSelectionParams(searchParams, module)).toEqual({
                ok: false,
                reason: "too-many-values",
            });
        });

        it("avviser for mange verdier for ett enkelt spørsmål", () => {
            const searchParams = new URLSearchParams();
            for (let index = 0; index < 51; index += 1) {
                searchParams.append("goals", `audiences:${GOAL_APPLY}`);
            }

            expect(decodeSelectionParams(searchParams, module)).toEqual({
                ok: false,
                reason: "too-many-values",
            });
        });

        it("ignorerer ukjente parameternavn som ikke finnes i modulen", () => {
            const searchParams = new URLSearchParams({ ukjent: "age:ignorert" });

            expect(decodeSelectionParams(searchParams, module)).toEqual({
                ok: true,
                selection: {
                    age: { dimension: "age", optionIds: [AGE_UNDER_18] },
                },
            });
        });
    });

    describe("encodeSelectionParams", () => {
        it("koder svar i modulens steg-/spørsmålsrekkefølge med dimensjon:uuid-verdier", () => {
            const selection = {
                age: { dimension: "age" as const, optionIds: [AGE_18_OR_OLDER] },
                goals: { dimension: "audiences" as const, optionIds: [GOAL_APPLY, GOAL_FIND_JOB] },
            };

            const searchParams = encodeSelectionParams(selection, module);

            expect(searchParams.toString()).toBe(
                `age=age%3A${AGE_18_OR_OLDER}&goals=audiences%3A${GOAL_APPLY}&goals=audiences%3A${GOAL_FIND_JOB}`,
            );
        });

        it("koder bare én verdi for et enkeltvalgsspørsmål selv om flere er lagret", () => {
            const selection = {
                age: { dimension: "age" as const, optionIds: [AGE_UNDER_18, AGE_18_OR_OLDER] },
            };

            const searchParams = encodeSelectionParams(selection, module);

            expect(searchParams.getAll("age")).toEqual([`age:${AGE_UNDER_18}`]);
        });

        it("utelater ukjente alternativ-ID-er", () => {
            const selection = {
                age: { dimension: "age" as const, optionIds: ["ukjent-id"] },
            };

            const searchParams = encodeSelectionParams(selection, module);

            expect(searchParams.toString()).toBe("");
        });
    });

    describe("lenkebyggere", () => {
        it("bygger en lenke til resultatsida med valgene eksplisitt i lenka", () => {
            const selection = {
                age: { dimension: "age" as const, optionIds: [AGE_18_OR_OLDER] },
            };

            expect(buildResultHref(selection, module)).toBe(`${RESULT_PATH}?age=age%3A${AGE_18_OR_OLDER}`);
        });

        it("bygger en lenke til jobbquizen", () => {
            const selection = {
                age: { dimension: "age" as const, optionIds: [AGE_18_OR_OLDER] },
            };

            expect(buildJobQuizHref(selection, module)).toBe(`${JOB_QUIZ_PATH}?age=age%3A${AGE_18_OR_OLDER}`);
        });

        it("bygger en lenke til en artikkel med artikkel-ID i stien", () => {
            const selection = {
                age: { dimension: "age" as const, optionIds: [AGE_18_OR_OLDER] },
            };

            expect(buildArticleHref("artikkel-1", selection, module)).toBe(
                `${ARTICLE_PATH}/artikkel-1?age=age%3A${AGE_18_OR_OLDER}`,
            );
        });
    });
});
