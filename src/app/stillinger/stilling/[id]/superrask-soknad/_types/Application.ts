import { z } from "zod";

export const RESPONSE_FORMATS = ["MOTIVATION_QUESTION", "MULTIPLE_QUESTIONS"] as const;
export type ResponseFormat = (typeof RESPONSE_FORMATS)[number];

export const QualificationSchema = z.object({
    id: z.string(),
    label: z.string(),
});

export const ApplicationQualificationSchema = QualificationSchema.extend({
    checked: z.boolean(),
});

export const PublishedQuestionSchema = z.object({
    id: z.string(),
    label: z.string(),
    sortOrder: z.number(),
});

export const ApplicationFormSchema = z.object({
    adId: z.string(),
    responseFormat: z.enum(RESPONSE_FORMATS).default("MOTIVATION_QUESTION"),
    qualifications: z.array(QualificationSchema).default([]),
    questions: z.array(PublishedQuestionSchema).default([]),
});

export interface Qualification extends z.infer<typeof QualificationSchema> {}

export interface ApplicationQualification extends z.infer<typeof ApplicationQualificationSchema> {}

export interface PublishedQuestion extends z.infer<typeof PublishedQuestionSchema> {}

export interface ApplicationForm extends z.infer<typeof ApplicationFormSchema> {}

export interface Application {
    name: string;
    telephone: string;
    email: string;
    qualifications: ApplicationQualification[];
    motivation: string;
    answers?: QuestionAnswer[];
}

export interface QuestionAnswer {
    id: string;
    text: string;
}

export interface ConfirmApplicationEmailRequest {
    token: string;
}

export function isMultipleQuestionsFormat(applicationForm: ApplicationForm): boolean {
    return (
        applicationForm.responseFormat === "MULTIPLE_QUESTIONS" &&
        Array.isArray(applicationForm.questions) &&
        applicationForm.questions.length > 0
    );
}
