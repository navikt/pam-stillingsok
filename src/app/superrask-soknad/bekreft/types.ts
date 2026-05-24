import { z } from "zod";

export const verifyEmailResponseSchema = z.object({
    applicationSentByLoggedInApplicant: z.boolean(),
});

export type VerifyEmailResponse = z.infer<typeof verifyEmailResponseSchema>;
