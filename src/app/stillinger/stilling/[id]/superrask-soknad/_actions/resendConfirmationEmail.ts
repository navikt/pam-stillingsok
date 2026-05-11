"use server";

import { validate as uuidValidate } from "uuid";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";

export async function resendConfirmationEmail(applicationId: string): Promise<{ success: boolean }> {
    if (!uuidValidate(applicationId)) {
        return {
            success: false,
        };
    }

    try {
        const headers = await getDefaultHeaders();
        const response = await fetch(
            `${process.env.INTEREST_API_URL}/application-form/application/${applicationId}/resend-verification-email`,
            {
                method: "POST",
                headers: headers,
            },
        );

        return {
            success: response.ok,
        };
    } catch {
        return {
            success: false,
        };
    }
}
