"use client";

import { experiments } from "@/app/_experiments/experiments";
import { AB_USER_ID_COOKIE, getExperimentCookieName } from "@/app/_experiments/cookies";

function deleteCookie(name: string): void {
    // Sletter cookie for hele domenet/path=/ ved å sette Max-Age=0
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function clearAbCookies(): void {
    deleteCookie(AB_USER_ID_COOKIE);

    for (const def of experiments) {
        console.log("delete", def);
        deleteCookie(getExperimentCookieName(def.key));
    }
}
