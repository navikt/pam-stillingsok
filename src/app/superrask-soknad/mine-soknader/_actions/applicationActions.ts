"use server";

import { appLogger } from "@/app/_common/logging/appLogger";
import { requiredEnv } from "@/app/_common/utils/requiredEnv";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { getSuperraskSoknadTokenIfLoggedIn } from "@/app/stillinger/stilling/[id]/superrask-soknad/_actions/superraskSoknadAuth";
import { type Application, applicantApplicationListSchema } from "@/app/superrask-soknad/mine-soknader/types";

export async function getApplications(): Promise<Application[]> {
    const superraskSoknadUrl = requiredEnv("INTEREST_API_URL");
    const headers = await getAuthHeaders();

    const response = await fetch(`${superraskSoknadUrl}/application`, {
        method: "GET",
        headers,
        cache: "no-store",
    });

    if (!response.ok) {
        appLogger.httpError("GET applications from superrask soknad api failed.", {
            method: "GET",
            url: response.url,
            status: response.status,
            statusText: response.statusText,
        });

        throw new Error(`Failed to fetch applications: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const parsed = applicantApplicationListSchema.safeParse(data);

    if (!parsed.success) {
        throw new Error("Failed to parse applications response from superrask soknad api.");
    }

    return parsed.data;
}

async function getAuthHeaders(): Promise<Headers> {
    const token = await getSuperraskSoknadTokenIfLoggedIn();

    if (token === null) {
        throw new Error("User is not authenticated");
    }

    const requestHeaders = await getDefaultHeaders();
    requestHeaders.set("Authorization", `Bearer ${token}`);
    return requestHeaders;
}
