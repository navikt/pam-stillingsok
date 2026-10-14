import {
    defaultSingleOptionId,
    type FilterDimension,
    type OnboardingModule,
    onboardingQuestions,
    type Selection,
} from "@/features/ung/enklere-vei-til-jobb/domain/onboarding";

export const RESULT_PATH = "/ung/enklere-vei-til-jobb/resultat";
export const JOB_QUIZ_PATH = "/ung/enklere-vei-til-jobb/jobbquiz";
export const ARTICLE_PATH = "/ung/enklere-vei-til-jobb/artikkel";

// Verdien er `<dimensjon>:<term-UUID>`, f.eks. `age:5be5c5a4-...`. Lengden må romme den lengste
// dimensjonen ("experience", "audiences") pluss kolon og en UUID (36 tegn).
const MAX_VALUE_LENGTH = 64;
// Grenser på antall verdier, før noe semantisk slås opp mot modulen (forsvar i dybden).
const MAX_TOTAL_VALUES = 100;
const MAX_VALUES_PER_QUESTION = 50;

const VALUE_PATTERN = /^(age|experience|audiences):([0-9a-fA-F-]{36})$/;

export type SelectionParamsErrorReason =
    | "too-many-values"
    | "value-too-long"
    | "malformed-value"
    | "multiple-values-for-single-choice";

export type SelectionParamsResult =
    | Readonly<{
          ok: true;
          selection: Selection;
      }>
    | Readonly<{
          ok: false;
          reason: SelectionParamsErrorReason;
      }>;

/**
 * Dekoder URL-en til et validert Selection. Rekkefølgen er alltid: 1) størrelsesgrenser, 2) syntaks
 * (`dimensjon:uuid`, og dimensjonen må stemme med spørsmålets egen dimensjon i modulen), 3) semantisk
 * oppslag mot modulens gyldige valg. Utgåtte/upubliserte term-ID-er fjernes stille (de finnes ikke
 * blant spørsmålets gyldige valg), mens syntaktisk ugyldige verdier avvises som en ugyldig lenke.
 */
export function decodeSelectionParams(searchParams: URLSearchParams, module: OnboardingModule): SelectionParamsResult {
    const entries = [...searchParams.entries()];
    if (entries.length > MAX_TOTAL_VALUES) {
        return { ok: false, reason: "too-many-values" };
    }
    if (entries.some(([, value]) => value.length > MAX_VALUE_LENGTH)) {
        return { ok: false, reason: "value-too-long" };
    }

    const selection: Record<string, Readonly<{ dimension: FilterDimension; optionIds: readonly string[] }>> = {};

    for (const question of onboardingQuestions(module)) {
        const rawValues = searchParams.getAll(question.id);
        if (rawValues.length > MAX_VALUES_PER_QUESTION) {
            return { ok: false, reason: "too-many-values" };
        }

        const parsedOptionIds: string[] = [];
        for (const rawValue of rawValues) {
            const match = VALUE_PATTERN.exec(rawValue);
            if (!match || match[1] !== question.dimension) {
                return { ok: false, reason: "malformed-value" };
            }
            parsedOptionIds.push(match[2]);
        }

        const validOptionIds = new Set(question.options.map((option) => option.id));
        const existingOptionIds = [...new Set(parsedOptionIds.filter((optionId) => validOptionIds.has(optionId)))];

        if (!question.multiple) {
            if (existingOptionIds.length > 1) {
                return { ok: false, reason: "multiple-values-for-single-choice" };
            }
            if (existingOptionIds.length === 0) {
                const fallbackOptionId = defaultSingleOptionId(question);
                if (fallbackOptionId) {
                    existingOptionIds.push(fallbackOptionId);
                }
            }
        }

        if (existingOptionIds.length > 0) {
            selection[question.id] = { dimension: question.dimension, optionIds: existingOptionIds };
        }
    }

    return { ok: true, selection };
}

/**
 * Koder Selection i modulens steg-/spørsmålsrekkefølge. Enkeltvalg får maks én verdi. Ukjente
 * alternativ-ID-er (f.eks. igjen fra en tidligere modulversjon i klient-state) filtreres bort.
 */
export function encodeSelectionParams(selection: Selection, module: OnboardingModule): URLSearchParams {
    const searchParams = new URLSearchParams();
    for (const question of onboardingQuestions(module)) {
        const answer = selection[question.id];
        if (!answer) {
            continue;
        }
        const validOptionIds = new Set(question.options.map((option) => option.id));
        const optionIds = answer.optionIds.filter((optionId) => validOptionIds.has(optionId));
        const valuesToEncode = question.multiple ? optionIds : optionIds.slice(0, 1);
        for (const optionId of valuesToEncode) {
            searchParams.append(question.id, `${question.dimension}:${optionId}`);
        }
    }
    return searchParams;
}

export function buildResultHref(selection: Selection, module: OnboardingModule): string {
    return `${RESULT_PATH}?${encodeSelectionParams(selection, module).toString()}`;
}

export function buildJobQuizHref(selection: Selection, module: OnboardingModule): string {
    return `${JOB_QUIZ_PATH}?${encodeSelectionParams(selection, module).toString()}`;
}

export function buildArticleHref(articleId: string, selection: Selection, module: OnboardingModule): string {
    return `${ARTICLE_PATH}/${encodeURIComponent(articleId)}?${encodeSelectionParams(selection, module).toString()}`;
}
