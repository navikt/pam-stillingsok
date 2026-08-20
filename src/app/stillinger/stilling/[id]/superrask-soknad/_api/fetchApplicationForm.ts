import { appLogger } from "@/app/_common/logging/appLogger";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import type { ApplicationForm } from "@/app/stillinger/stilling/[id]/superrask-soknad/_types/Application";
import { ApplicationFormSchema } from "@/app/stillinger/stilling/[id]/superrask-soknad/_types/Application";

export async function fetchApplicationForm(id: string): Promise<ApplicationForm> {
    const headers = await getDefaultHeaders();

    const res = await fetch(`${process.env.INTEREST_API_URL}/application-form/${id}`, {
        headers,
        next: { revalidate: 30 },
    });

    if (res.status === 404) {
        throw new ApplicationFormNotFoundError(id);
    }

    if (!res.ok) {
        throw new Error(`Failed to fetch application form for ${id}: ${res.status}`);
    }

    const json = await res.json();
    const parsed = ApplicationFormSchema.safeParse(json);

    if (!parsed.success) {
        appLogger.warn(`ApplicationForm schema mismatch for ${id}`, { issues: parsed.error.issues });
        return {
            adId: typeof json?.adId === "string" ? json.adId : id,
            responseFormat: "MOTIVATION_QUESTION",
            qualifications: [],
            questions: [],
        };
    }

    return parsed.data;
}

export class ApplicationFormNotFoundError extends Error {
    constructor(id: string) {
        super(`Application form not found for ${id}`);
        this.name = "ApplicationFormNotFoundError";
    }
}
