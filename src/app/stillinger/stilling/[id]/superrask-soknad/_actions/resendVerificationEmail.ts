"use server";

import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";

export async function resendVerificationEmail(
    applicationId: string,
): Promise<{ success: boolean }> {
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
            success: response.ok
        };
    } catch {
        return {
            success: false,
        };
    }
}
