import "server-only";

import { notFound } from "next/navigation";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { type VerifyEmailResponse, verifyEmailResponseSchema } from "@/app/superrask-soknad/bekreft/types";
import type { ConfirmApplicationEmailRequest } from "../../stillinger/stilling/[id]/superrask-soknad/_types/Application";

export async function confirmEmail(token: string): Promise<VerifyEmailResponse> {
    const headers = await getDefaultHeaders();

    const confirmRequest: ConfirmApplicationEmailRequest = {
        token: token,
    };

    const res = await fetch(`${process.env.INTEREST_API_URL}/application/verify`, {
        headers: headers,
        method: "POST",
        body: JSON.stringify(confirmRequest),
    });

    if (res.status === 404) {
        notFound();
    }

    if (!res.ok) {
        throw new Error("Failed to confirm application email");
    }

    const json: unknown = await res.json();
    const parsed = verifyEmailResponseSchema.safeParse(json);

    if (!parsed.success) {
        throw new Error("Failed to parse verify email response from superrask soknad api.");
    }

    return parsed.data;
}
