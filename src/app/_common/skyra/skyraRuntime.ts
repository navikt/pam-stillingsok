export type SkyraConfig = {
    org: string;
    cookieConsent?: boolean;
};

export type SkyraApi = {
    setConsent: (consent: boolean) => void;
    reload?: () => void;
};

declare global {
    interface Window {
        SKYRA_CONFIG?: SkyraConfig;
        skyra?: SkyraApi;
    }
}

/** Oppdater samtykke for Skyra dynamisk (cookieless <-> cookies). */
export const updateSkyraConsent = (consented: boolean): void => {
    if (typeof window === "undefined") return;

    // Hvis runtime er klar: bruk API direkte
    if (window.skyra?.setConsent) {
        try {
            window.skyra.setConsent(consented);
            if (consented) {
                window.skyra.reload?.();
            }
            return;
        } catch {
            // fallthrough til SKYRA_CONFIG
        }
    }
    if (window.SKYRA_CONFIG) {
        window.SKYRA_CONFIG.cookieConsent = consented;
    } else {
        window.SKYRA_CONFIG = { org: "arbeids-og-velferdsetaten-nav", cookieConsent: consented };
    }
};

/** Fjern kjente Skyra-cookies ved tilbaketrekking av samtykke. */
export const clearSkyraCookies = (): void => {
    if (typeof document === "undefined") return;
    const names = document.cookie.split("; ").map((c) => c.split("=")[0]);
    for (const name of names) {
        if (name === "skyra.state" || name.startsWith("skyra.")) {
            document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
        }
    }
};
