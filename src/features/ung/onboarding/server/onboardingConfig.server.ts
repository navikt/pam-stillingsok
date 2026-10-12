import "server-only";
import { z } from "zod";
import type { SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";

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

/**
 * UUID-en til den faste Shared Content-artikkelen onboardingen bygges fra (se
 * SHARED_CONTENT_ONBOARDING_ARTICLE_ID i .nais/dev.yml). Ulik per miljø, derfor en env-variabel
 * i stedet for en konstant i koden, på samme måte som SHARED_CONTENT_GOALS_PARENT_ID.
 */
export function getOnboardingArticleId(): SharedContentResult<string> {
    const parsed = z.uuid().safeParse(process.env.SHARED_CONTENT_ONBOARDING_ARTICLE_ID ?? "");
    if (!parsed.success) {
        return {
            ok: false,
            error: {
                type: "configuration",
                message: "SHARED_CONTENT_ONBOARDING_ARTICLE_ID må være en gyldig UUID",
            },
        };
    }
    return { ok: true, data: parsed.data };
}
