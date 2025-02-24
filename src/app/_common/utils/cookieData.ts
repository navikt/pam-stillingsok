import { z } from "zod";
import { cookies } from "next/headers";

const isValidDateString = (dateString: string) => !isNaN(Date.parse(dateString));

const ConsentDataSchema = z.object({
    consent: z.object({
        analytics: z.boolean().default(false),
        surveys: z.boolean().default(false),
    }),
    userActionTaken: z.boolean().default(false),
    meta: z.object({
        createdAt: z
            .string()
            .refine(isValidDateString, {
                message: "Invalid date string",
            })
            .default(() => new Date(Date.now()).toISOString()),
        updatedAt: z
            .string()
            .refine(isValidDateString, {
                message: "Invalid date string",
            })
            .default(() => new Date(Date.now()).toISOString()),
        version: z.number().default(0),
    }),
});

type ConsentData = z.infer<typeof ConsentDataSchema>;

export function getCurrentConsent(): ConsentData {
    const cookieStore = cookies();
    const cookieData = cookieStore.get("arbeidsplassen-consent");
    if (cookieData) {
        try {
            const parsedData = JSON.parse(cookieData.value);
            const result = ConsentDataSchema.safeParse(parsedData);
            if (result.success) {
                return result.data;
            } else {
                console.warn("Validation error:", result.error.issues);
            }
            return JSON.parse(cookieData.value) as ConsentData;
        } catch (error) {
            console.error("Failed to parse cookie data", error);
        }
    }
    return ConsentDataSchema.parse({}); // default values
}
