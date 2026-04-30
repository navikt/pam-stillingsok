import { z } from "zod";

export const ApplicationStatusEnum = {
    PENDING: "PENDING",
    ACTIVE: "ACTIVE",
    REJECTED: "REJECTED",
    WITHDRAWN: "WITHDRAWN",
} as const;

export const qualificationSchema = z.object({
    label: z.string(),
    checked: z.boolean(),
});

export const applicationContactInfoSchema = z.object({
    name: z.string().nullable().optional(),
    telephone: z.string(),
    email: z.string(),
});

export const applicationStatusSchema = z.enum([
    ApplicationStatusEnum.PENDING,
    ApplicationStatusEnum.ACTIVE,
    ApplicationStatusEnum.REJECTED,
    ApplicationStatusEnum.WITHDRAWN,
]);

export const applicationStatuses = applicationStatusSchema.options;

export const applicationSchema = z.object({
    id: z.string(),
    adId: z.string(),
    adTitle: z.string(),
    organizationName: z.string(),
    status: applicationStatusSchema,
    qualifications: z.array(qualificationSchema),
    motivation: z.string().nullable().optional(),
    contactInfo: applicationContactInfoSchema.nullable(),
    emailVerified: z.boolean(),
    createdAt: z.string(),
    removedAt: z.string().nullable(),
});

export const applicantApplicationListSchema = z.array(applicationSchema);

export type Qualification = z.infer<typeof qualificationSchema>;
export type ContactInfo = z.infer<typeof applicationContactInfoSchema>;
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;
export type Application = z.infer<typeof applicationSchema>;
