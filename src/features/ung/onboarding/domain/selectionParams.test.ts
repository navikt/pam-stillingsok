import { describe, expect, it } from "vitest";
import type { OnboardingModule } from "@/features/ung/onboarding/domain/onboarding";
import {
    buildJobQuizHref,
    buildResultHref,
    CURRENT_SELECTION_VERSION,
    decodeSelectionParams,
    encodeSelectionParams,
    MAX_ANSWER_COUNT,
    MAX_ANSWER_ID_LENGTH,
} from "@/features/ung/onboarding/domain/selectionParams";

const module: OnboardingModule = {
    id: "module",
    title: "Tittel",
    intro: "Ingress",
    resultTitle: "Resultat",
    resultIntro: "Resultatingress",
    questions: [
        {
            id: "question-single",
            title: "Enkeltvalg",
            selectionMode: "single",
            options: [
                { id: "single-a", label: "A" },
                { id: "single-b", label: "B" },
            ],
        },
        {
            id: "question-multiple",
            title: "Flervalg",
            selectionMode: "multiple",
            options: [
                { id: "multiple-a", label: "A" },
                { id: "multiple-b", label: "B" },
            ],
        },
    ],
};

describe("selectionParams", () => {
    it("behandler tomt svarsett som et gyldig standardresultat", () => {
        const searchParams = new URLSearchParams({ v: `${CURRENT_SELECTION_VERSION}` });

        expect(decodeSelectionParams(searchParams, module)).toEqual({
            ok: true,
            selection: { answerIds: [] },
        });
    });

    it("koder svar kanonisk med versjon og uten duplikater", () => {
        const searchParams = encodeSelectionParams({
            answerIds: ["multiple-b", "single-a", "multiple-b"],
        });

        expect(searchParams.toString()).toBe("v=2&svar=multiple-b&svar=single-a");
    });

    it("bygger kanoniske lenker til resultat og jobbquiz", () => {
        const selection = {
            answerIds: ["multiple-b", "single-a", "multiple-b"],
        };

        expect(buildResultHref(selection)).toBe("/ung/enklere-vei-til-jobb/resultat?v=2&svar=multiple-b&svar=single-a");
        expect(buildJobQuizHref(selection)).toBe(
            "/ung/enklere-vei-til-jobb/jobbquiz?v=2&svar=multiple-b&svar=single-a",
        );
    });

    it("avviser en ukjent URL-versjon", () => {
        const searchParams = new URLSearchParams({ v: "99" });

        expect(decodeSelectionParams(searchParams, module)).toEqual({
            ok: false,
            reason: "unsupported-version",
        });
    });

    it("avviser lenker med forrige versjon (v=1), slik at gamle svar-ID-er ikke blir tolket på nytt", () => {
        const searchParams = new URLSearchParams({ v: "1", svar: "single-a" });

        expect(decodeSelectionParams(searchParams, module)).toEqual({
            ok: false,
            reason: "unsupported-version",
        });
    });

    it("avviser svar som ikke finnes i modulen", () => {
        const searchParams = new URLSearchParams({
            v: `${CURRENT_SELECTION_VERSION}`,
            svar: "unknown",
        });

        expect(decodeSelectionParams(searchParams, module)).toEqual({
            ok: false,
            reason: "unknown-answer",
            invalidAnswerIds: ["unknown"],
        });
    });

    it("avviser flere svar på et enkeltvalgsspørsmål", () => {
        const searchParams = new URLSearchParams([
            ["v", `${CURRENT_SELECTION_VERSION}`],
            ["svar", "single-a"],
            ["svar", "single-b"],
        ]);

        expect(decodeSelectionParams(searchParams, module)).toEqual({
            ok: false,
            reason: "multiple-answers-for-single-question",
            invalidAnswerIds: ["single-a", "single-b"],
        });
    });

    it("avviser for mange svar før semantisk validering", () => {
        const searchParams = new URLSearchParams({ v: `${CURRENT_SELECTION_VERSION}` });
        for (let index = 0; index <= MAX_ANSWER_COUNT; index += 1) {
            searchParams.append("svar", `answer-${index}`);
        }

        expect(decodeSelectionParams(searchParams, module)).toEqual({
            ok: false,
            reason: "too-many-answers",
        });
    });

    it("avviser svar-ID-er som er for lange", () => {
        const searchParams = new URLSearchParams({
            v: `${CURRENT_SELECTION_VERSION}`,
            svar: "a".repeat(MAX_ANSWER_ID_LENGTH + 1),
        });

        expect(decodeSelectionParams(searchParams, module)).toEqual({
            ok: false,
            reason: "invalid-answer-id",
        });
    });
});
