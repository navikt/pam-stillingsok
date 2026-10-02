import "server-only";

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
