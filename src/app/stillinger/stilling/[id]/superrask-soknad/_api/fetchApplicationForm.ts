import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import type { ApplicationForm } from "@/app/stillinger/stilling/[id]/superrask-soknad/_types/Application";

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

    return res.json();
}

export class ApplicationFormNotFoundError extends Error {
    constructor(id: string) {
        super(`Application form not found for ${id}`);
        this.name = "ApplicationFormNotFoundError";
    }
}
