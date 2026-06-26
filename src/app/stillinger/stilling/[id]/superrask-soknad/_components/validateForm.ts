import { isValidEmail, isValidTelephone } from "@/app/stillinger/_common/utils/utils";
import type {
    Application,
    PublishedQuestion,
    Qualification,
    QuestionAnswer,
} from "@/app/stillinger/stilling/[id]/superrask-soknad/_types/Application";
import type { ValidationErrors } from "@/app/stillinger/stilling/[id]/superrask-soknad/_types/ValidationErrors";

export const MOTIVATION_MAX_LENGTH = 800;
export const QUESTION_ANSWER_MAX_LENGTH = 800;

function getFormString(value: FormDataEntryValue | null): string {
    if (value === null || value instanceof File) {
        return "";
    }
    return value;
}

export function parseFormData(
    formData: FormData,
    qualifications: Qualification[],
    questions?: PublishedQuestion[],
): Application {
    const isMultipleQuestions = questions && questions.length > 0;
    return {
        name: getFormString(formData.get("fullName")),
        telephone: getFormString(formData.get("telephone")),
        email: getFormString(formData.get("email")),
        motivation: isMultipleQuestions ? "" : getFormString(formData.get("motivation")).replace(/\r\n/g, "\n"),
        qualifications: qualifications.map((it: Qualification) => ({
            ...it,
            checked: formData.getAll("qualification").includes(it.label),
        })),
        ...(isMultipleQuestions && {
            answers: questions.map((q) => ({
                id: q.id,
                text: getFormString(formData.get(`screening-${q.id}`)).replace(/\r\n/g, "\n"),
            })),
        }),
    };
}

export function validateMotivationText(motivationText: string): string | undefined {
    if (motivationText.length > MOTIVATION_MAX_LENGTH) {
        return `Du har brukt ${
            motivationText.length - MOTIVATION_MAX_LENGTH
        } tegn for mye i din begrunnelse. Begrunnelsen kan ikke være lengre enn ${MOTIVATION_MAX_LENGTH} tegn`;
    }
    return undefined;
}

export function validateQuestionAnswers(questionAnswers: QuestionAnswer[]): Record<string, string> | undefined {
    const errors: Record<string, string> = {};
    for (const qa of questionAnswers) {
        if (!qa.text || qa.text.trim().length === 0) {
            errors[qa.id] = "Du må svare på dette spørsmålet";
        } else if (qa.text.length > QUESTION_ANSWER_MAX_LENGTH) {
            errors[qa.id] = `Svaret kan ikke være lengre enn ${QUESTION_ANSWER_MAX_LENGTH} tegn`;
        }
    }
    return Object.keys(errors).length > 0 ? errors : undefined;
}

export function validateEmail(email: string): string | undefined {
    if (!email || email.trim().length === 0) {
        return "Du må oppgi din e-post for å kunne sende inn søknaden";
    }
    if (email && email.length > 0 && !isValidEmail(email)) {
        return "E-postadressen er ugyldig";
    }
    return undefined;
}

export function validateTelephone(telephone: string): string | undefined {
    if (!telephone || telephone.trim().length === 0) {
        return "Du må oppgi ditt telefonnummer for å kunne sende inn søknaden";
    }
    if (telephone && telephone.trim().length > 0 && !isValidTelephone(telephone)) {
        return "Telefonnummer er ugyldig";
    }
    return undefined;
}

export default function validateForm(application: Application): ValidationErrors {
    let errors: ValidationErrors = {};

    const emailError = validateEmail(application.email);
    if (emailError) {
        errors = { ...errors, email: emailError };
    }

    const telephoneError = validateTelephone(application.telephone);
    if (telephoneError) {
        errors = { ...errors, telephone: telephoneError };
    }

    if (application.answers) {
        const questionErrors = validateQuestionAnswers(application.answers);
        if (questionErrors) {
            errors = { ...errors, answers: questionErrors };
        }
    } else {
        const motivationError = validateMotivationText(application.motivation);
        if (motivationError) {
            errors = { ...errors, motivation: motivationError };
        }
    }

    return errors;
}
