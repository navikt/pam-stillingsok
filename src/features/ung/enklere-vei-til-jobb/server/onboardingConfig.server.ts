import "server-only";
import { z } from "zod";
import type { SharedContentResult } from "@/features/ung/enklere-vei-til-jobb/server/sharedContentResult";

export function isOnboardingEnabled(): boolean {
    const configuredValue = process.env.ENKLERE_VEI_TIL_JOBB_ENABLED;

    if (configuredValue === "true") {
        return true;
    }
    if (configuredValue === "false") {
        return false;
    }
    return process.env.NODE_ENV !== "production";
}

export function getJobQuizArticleId(): SharedContentResult<string | undefined> {
    const configuredValue = process.env.JOB_QUIZ_ARTICLE_ID;
    if (configuredValue === undefined || configuredValue === "") {
        return { ok: true, data: undefined };
    }

    const parsed = z.uuid().safeParse(configuredValue);
    if (!parsed.success) {
        return {
            ok: false,
            error: {
                type: "configuration",
                message: "JOB_QUIZ_ARTICLE_ID må være en gyldig UUID",
            },
        };
    }
    return { ok: true, data: parsed.data };
}
