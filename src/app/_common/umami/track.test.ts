import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";

const getConsentValuesMock = vi.fn(() => ({ analyticsConsent: false }));
vi.mock("@navikt/arbeidsplassen-react", () => ({
    getConsentValues: () => getConsentValuesMock(),
}));

type UmamiTrackFn = (name: string, payload?: Readonly<Record<string, unknown>>) => void;

function mockConsent(value: boolean): void {
    getConsentValuesMock.mockReturnValue({ analyticsConsent: value });
}

function installUmamiApi(): Mock<UmamiTrackFn> {
    const trackFn = vi.fn<UmamiTrackFn>();
    (window as unknown as Record<string, unknown>).umami = { track: trackFn };
    return trackFn;
}

function removeUmamiApi(): void {
    delete (window as unknown as Record<string, unknown>).umami;
}

async function importFreshModule() {
    vi.resetModules();
    return import("./track");
}

const STORAGE_KEY = "umami_event_queue";
const CONSENT_PAYLOAD = { variant: "B" as const, url: "/" };

describe("track", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        sessionStorage.clear();
        removeUmamiApi();
        mockConsent(false);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("dropper events uten samtykke", async () => {
        const umami = installUmamiApi();
        const { track } = await importFreshModule();

        track("Klikk annonse", { arbpidn: "123", title: "t", index: 0, treff: 1 });
        vi.advanceTimersByTime(1000);

        expect(umami).not.toHaveBeenCalled();
        expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it("sender direkte med samtykke og Umami", async () => {
        mockConsent(true);
        const umami = installUmamiApi();
        const { track } = await importFreshModule();

        track("Klikk annonse", { arbpidn: "123", title: "t", index: 0, treff: 1 });

        expect(umami).toHaveBeenCalledWith("Klikk annonse", expect.objectContaining({ arbpidn: "123" }));
    });

    it("trackConsentAction køer event uten samtykke og sender etter samtykke", async () => {
        const { trackConsentAction } = await importFreshModule();
        trackConsentAction("Cookiebanner – Godta alle", CONSENT_PAYLOAD);

        mockConsent(true);
        const umami = installUmamiApi();
        vi.advanceTimersByTime(1_000);

        expect(umami).toHaveBeenCalledWith("Cookiebanner – Godta alle", expect.objectContaining(CONSENT_PAYLOAD));
    });

    it("forkaster køede events eldre enn 5 sekunder", async () => {
        const { trackConsentAction } = await importFreshModule();
        trackConsentAction("Cookiebanner – Godta alle", CONSENT_PAYLOAD);

        vi.advanceTimersByTime(6_000);

        mockConsent(true);
        const umami = installUmamiApi();
        vi.advanceTimersByTime(1_000);

        expect(umami).not.toHaveBeenCalled();
    });

    it("persistPendingEvents skriver ikke til sessionStorage uten samtykke", async () => {
        const { trackConsentAction, persistPendingEvents } = await importFreshModule();
        trackConsentAction("Cookiebanner – Godta alle", CONSENT_PAYLOAD);

        persistPendingEvents();
        expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it("restoreQueue krasjer ikke ved ugyldig sessionStorage-data", async () => {
        sessionStorage.setItem(STORAGE_KEY, "ugyldig{{{json");
        const umami = installUmamiApi();

        await expect(importFreshModule()).resolves.toBeDefined();
        vi.advanceTimersByTime(1_000);

        expect(umami).not.toHaveBeenCalled();
    });

    it("komplett flyt: samtykke-klikk → persist → reload → flush → opprydding", async () => {
        // Før reload: bruker klikker "Godta alle"
        const module1 = await importFreshModule();
        module1.trackConsentAction("Cookiebanner – Godta alle", CONSENT_PAYLOAD);

        // CookieBannerB setter consent-cookie, onConsentChanged persisterer køen
        mockConsent(true);
        module1.persistPendingEvents();
        expect(sessionStorage.getItem(STORAGE_KEY)).not.toBeNull();

        // Simuler location.reload()
        vi.clearAllTimers();
        const umami = installUmamiApi();
        await importFreshModule();
        vi.advanceTimersByTime(1_000);

        // Event sendt og sessionStorage ryddet
        expect(umami).toHaveBeenCalledTimes(1);
        expect(umami).toHaveBeenCalledWith("Cookiebanner – Godta alle", expect.objectContaining(CONSENT_PAYLOAD));
        expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it("køer events når samtykke er gitt men Umami ikke er lastet ennå", async () => {
        mockConsent(true);
        // Umami er IKKE installert ennå
        const { track } = await importFreshModule();

        track("Klikk annonse", { arbpidn: "123", title: "t", index: 0, treff: 1 });

        // Installer Umami og vent på flush
        const umami = installUmamiApi();
        vi.advanceTimersByTime(1_000);

        expect(umami).toHaveBeenCalledWith("Klikk annonse", expect.objectContaining({ arbpidn: "123" }));
    });

    it("begrenser køen til 5 events og forkaster eldste", async () => {
        mockConsent(true);
        const { track } = await importFreshModule();

        // Kø 6 events uten Umami
        for (let eventIndex = 0; eventIndex < 6; eventIndex++) {
            track("Klikk annonse", { arbpidn: `id-${eventIndex}`, title: "t", index: eventIndex, treff: 1 });
        }

        const umami = installUmamiApi();
        vi.advanceTimersByTime(1_000);

        // Eldste (id-0) skal være forkastet, de 5 nyeste (id-1 til id-5) sendt
        expect(umami).toHaveBeenCalledTimes(5);
        expect(umami).not.toHaveBeenCalledWith("Klikk annonse", expect.objectContaining({ arbpidn: "id-0" }));
        expect(umami).toHaveBeenCalledWith("Klikk annonse", expect.objectContaining({ arbpidn: "id-5" }));
    });
});
