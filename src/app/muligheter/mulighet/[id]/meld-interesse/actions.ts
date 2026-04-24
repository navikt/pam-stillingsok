"use server";

import { getDirApiOboHeaders } from "@/app/muligheter/_common/auth/auth";
import { appLogger } from "@/app/_common/logging/appLogger";
import { ActionStatusResponse } from "@/app/stillinger/_common/actions/types";

export async function meldInteresseAction(id: string): Promise<ActionStatusResponse> {
    let headers;
    try {
        headers = await getDirApiOboHeaders();
    } catch {
        appLogger.error("meldInteresseAction: Could not get OBO headers");
        return { success: false };
    }

    const res = await fetch(`${process.env.PAM_DIR_API_URL}/rest/dir/${id}/interesse`, {
        headers,
        method: "POST",
    });

    if (!res.ok) {
        appLogger.httpError("POST meld interesse failed.", {
            method: "POST",
            url: res.url,
            status: res.status,
            statusText: res.statusText,
        });
        return { success: false };
    }

    return { success: true };
}
