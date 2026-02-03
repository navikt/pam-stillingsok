import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import type { ValidateApplicationRequest } from "../../stillinger/stilling/[id]/superrask-soknad/_types/Application";
import { notFound } from "next/navigation";

export async function verifyApplication(token: string): Promise<void> {
    const headers = await getDefaultHeaders();

    const validateRequest: ValidateApplicationRequest = {
        token: token,
    };

    const res = await fetch(`${process.env.INTEREST_API_URL}/application-form/application/verify`, {
        headers: headers,
        method: "POST",
        body: JSON.stringify(validateRequest),
    });

    if (res.status === 404) {
        notFound();
    }

    if (!res.ok) {
        throw new Error("Failed to validate application email");
    }
}
