export type SkyraConfig = {
    org: string;
    cookieConsent?: boolean;
};

export type SkyraApi = {
    // Dokumentert av Skyra (cookieless -> cookies on): skyra.setConsent(true)
    setConsent: (consent: boolean) => void;
    // SPA: tving en ny vurdering etter rutenavigasjon / samtykkeendring
    reload?: () => void;
};

declare global {
    // NB: Global augmentering må bruke interface (unntak fra "type > interface")
    interface Window {
        SKYRA_CONFIG?: SkyraConfig;
        skyra?: SkyraApi;
    }
}

/** Oppdater samtykke for Skyra dynamisk (cookieless <-> cookies). */
export const updateSkyraConsent = (consented: boolean): void => {
    if (typeof window === "undefined") return;

    // 1) Hvis runtime er klar: bruk API direkte
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

    // 2) Hvis scriptet ikke er klart ennå: oppdater init-config, så plukkes det opp ved load.
    if (window.SKYRA_CONFIG) {
        window.SKYRA_CONFIG.cookieConsent = consented;
    } else {
        // Opprett om mangler
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
