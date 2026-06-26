export const RESPONSE_FORMATS = ["MOTIVATION_QUESTION", "MULTIPLE_QUESTIONS"] as const;
export type ResponseFormat = (typeof RESPONSE_FORMATS)[number];

export interface Application {
    name: string;
    telephone: string;
    email: string;
    qualifications: Qualification[];
    motivation: string;
    answers?: QuestionAnswer[];
}

export interface ApplicationForm {
    adId: string;
    responseFormat: ResponseFormat;
    qualifications: Qualification[];
    questions: PublishedQuestion[];
}

export interface Qualification {
    id: string;
    label: string;
}

export interface PublishedQuestion {
    id: string;
    label: string;
    sortOrder: number;
}

export interface QuestionAnswer {
    id: string;
    text: string;
}

export interface ConfirmApplicationEmailRequest {
    token: string;
}

export function isMultipleQuestionsFormat(applicationForm: ApplicationForm): boolean {
    return applicationForm.responseFormat === "MULTIPLE_QUESTIONS" && applicationForm.questions.length > 0;
}
