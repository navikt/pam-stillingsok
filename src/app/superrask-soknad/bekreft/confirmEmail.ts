import "server-only";

import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import type { ConfirmApplicationEmailRequest } from "../../stillinger/stilling/[id]/superrask-soknad/_types/Application";
import { notFound } from "next/navigation";

export async function confirmEmail(token: string): Promise<void> {
    const headers = await getDefaultHeaders();

    const confirmRequest: ConfirmApplicationEmailRequest = {
        token: token,
    };

    const res = await fetch(`${process.env.INTEREST_API_URL}/application-form/application/verify`, {
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
}
