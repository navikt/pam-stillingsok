import type { OnboardingModule, Selection } from "@/features/ung/onboarding/domain/onboarding";

export const CURRENT_SELECTION_VERSION = 2;
export const MAX_ANSWER_COUNT = 50;
export const MAX_ANSWER_ID_LENGTH = 128;
export const RESULT_PATH = "/ung/enklere-vei-til-jobb/resultat";
export const JOB_QUIZ_PATH = "/ung/enklere-vei-til-jobb/jobbquiz";
export const ARTICLE_PATH = "/ung/enklere-vei-til-jobb/artikkel";

export type SelectionParamsErrorReason =
    | "invalid-answer-id"
    | "multiple-answers-for-single-question"
    | "too-many-answers"
    | "unknown-answer"
    | "unsupported-version";

export type SelectionParamsResult =
    | Readonly<{
          ok: true;
          selection: Selection;
      }>
    | Readonly<{
          ok: false;
          reason: SelectionParamsErrorReason;
          invalidAnswerIds?: readonly string[];
      }>;

export function decodeSelectionParams(searchParams: URLSearchParams, module: OnboardingModule): SelectionParamsResult {
    const versions = searchParams.getAll("v");
    if (versions.length !== 1 || versions[0] !== `${CURRENT_SELECTION_VERSION}`) {
        return { ok: false, reason: "unsupported-version" };
    }

    const answerIds = searchParams.getAll("svar");
    if (answerIds.length > MAX_ANSWER_COUNT) {
        return { ok: false, reason: "too-many-answers" };
    }

    if (answerIds.some((answerId) => !isValidAnswerId(answerId))) {
        return { ok: false, reason: "invalid-answer-id" };
    }

    const uniqueAnswerIds = [...new Set(answerIds)];
    const questionByAnswerId = new Map(
        module.questions.flatMap((question) => question.options.map((option) => [option.id, question] as const)),
    );
    const unknownAnswerIds = uniqueAnswerIds.filter((answerId) => !questionByAnswerId.has(answerId));

    if (unknownAnswerIds.length > 0) {
        return {
            ok: false,
            reason: "unknown-answer",
            invalidAnswerIds: unknownAnswerIds,
        };
    }

    for (const question of module.questions) {
        if (question.selectionMode !== "single") {
            continue;
        }

        const selectedForQuestion = uniqueAnswerIds.filter(
            (answerId) => questionByAnswerId.get(answerId)?.id === question.id,
        );
        if (selectedForQuestion.length > 1) {
            return {
                ok: false,
                reason: "multiple-answers-for-single-question",
                invalidAnswerIds: selectedForQuestion,
            };
        }
    }

    return {
        ok: true,
        selection: {
            answerIds: uniqueAnswerIds,
        },
    };
}

export function encodeSelectionParams(selection: Selection): URLSearchParams {
    const uniqueAnswerIds = [...new Set(selection.answerIds)].sort();
    if (uniqueAnswerIds.length > MAX_ANSWER_COUNT || uniqueAnswerIds.some((answerId) => !isValidAnswerId(answerId))) {
        throw new TypeError("Selection inneholder ugyldige svar-ID-er");
    }

    const searchParams = new URLSearchParams({ v: `${CURRENT_SELECTION_VERSION}` });
    for (const answerId of uniqueAnswerIds) {
        searchParams.append("svar", answerId);
    }
    return searchParams;
}

export function buildResultHref(selection: Selection): string {
    return `${RESULT_PATH}?${encodeSelectionParams(selection).toString()}`;
}

export function buildJobQuizHref(selection: Selection): string {
    return `${JOB_QUIZ_PATH}?${encodeSelectionParams(selection).toString()}`;
}

export function buildArticleHref(articleId: string, selection: Selection): string {
    return `${ARTICLE_PATH}/${encodeURIComponent(articleId)}?${encodeSelectionParams(selection).toString()}`;
}

function isValidAnswerId(answerId: string): boolean {
    return (
        answerId.length > 0 &&
        answerId.length <= MAX_ANSWER_ID_LENGTH &&
        /^[A-Za-z0-9](?:[A-Za-z0-9._~-]*[A-Za-z0-9])?$/.test(answerId)
    );
}
