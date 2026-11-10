import { cleanup, render } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UtmParamsHandler } from "./UtmParamsHandler";

const mocks = vi.hoisted(() => ({
    analyticsConsent: false,
    userActionTaken: false,
    showCookieBanner: false,
    track: vi.fn(),
}));

vi.mock("@navikt/arbeidsplassen-react", () => ({
    getConsentValues: () => ({ analyticsConsent: mocks.analyticsConsent }),
    getUserActionTakenValue: () => mocks.userActionTaken,
}));

vi.mock("next/navigation", () => ({
    usePathname: () => window.location.pathname,
    useSearchParams: () => new URLSearchParams(window.location.search),
}));

vi.mock("@/app/_common/cookie-banner/CookieBannerContext", () => ({
    useCookieBannerContext: () => ({ showCookieBanner: mocks.showCookieBanner }),
}));

vi.mock("@/app/_common/umami", () => ({
    track: mocks.track,
}));

const campaignUrl = "/julejobb?utm_source=qr-plakat&utm_campaign=julejobb-2026";
const campaignPayload = { source: "qr-plakat", campaign: "julejobb-2026" };

describe("UtmParamsHandler", () => {
    beforeEach(() => {
        mocks.analyticsConsent = false;
        mocks.userActionTaken = false;
        mocks.showCookieBanner = false;
        mocks.track.mockClear();
        window.history.replaceState(null, "", campaignUrl);
    });

    afterEach(() => {
        cleanup();
        window.history.replaceState(null, "", "/");
    });

    it("keeps campaign parameters without tracking while consent is undecided", () => {
        const { rerender } = render(<UtmParamsHandler />);

        mocks.showCookieBanner = true;
        rerender(<UtmParamsHandler />);

        expect(window.location.pathname + window.location.search).toBe(campaignUrl);
        expect(mocks.track).not.toHaveBeenCalled();
    });

    it("tracks once and cleans the URL when analytics consent is subsequently given", () => {
        mocks.showCookieBanner = true;
        const { rerender } = render(<UtmParamsHandler />);
        expect(mocks.track).not.toHaveBeenCalled();

        mocks.analyticsConsent = true;
        mocks.userActionTaken = true;
        mocks.showCookieBanner = false;
        rerender(<UtmParamsHandler />);
        rerender(<UtmParamsHandler />);

        expect(mocks.track).toHaveBeenCalledExactlyOnceWith("utm", campaignPayload);
        expect(window.location.pathname + window.location.search).toBe("/julejobb");
    });

    it("keeps campaign parameters across a remount before a consent decision", () => {
        const { unmount } = render(<UtmParamsHandler />);
        unmount();
        expect(window.location.pathname + window.location.search).toBe(campaignUrl);

        mocks.analyticsConsent = true;
        mocks.userActionTaken = true;
        render(<UtmParamsHandler />);

        expect(mocks.track).toHaveBeenCalledExactlyOnceWith("utm", campaignPayload);
        expect(window.location.search).toBe("");
    });

    it("cleans the URL without tracking when analytics consent is declined", () => {
        mocks.showCookieBanner = true;
        const { rerender } = render(<UtmParamsHandler />);

        mocks.userActionTaken = true;
        mocks.showCookieBanner = false;
        rerender(<UtmParamsHandler />);

        expect(mocks.track).not.toHaveBeenCalled();
        expect(window.location.pathname + window.location.search).toBe("/julejobb");
    });

    it("does not track a returning visitor who has declined analytics", () => {
        mocks.userActionTaken = true;
        render(<UtmParamsHandler />);

        expect(mocks.track).not.toHaveBeenCalled();
        expect(window.location.search).toBe("");
    });

    it("tracks only once in StrictMode and preserves other parameters, hash and history state", () => {
        mocks.analyticsConsent = true;
        mocks.userActionTaken = true;
        const historyState = { __NA: true, navigation: "existing" };
        window.history.replaceState(historyState, "", `${campaignUrl}&other=value#ledige-jobber`);

        render(
            <StrictMode>
                <UtmParamsHandler />
            </StrictMode>,
        );

        expect(mocks.track).toHaveBeenCalledExactlyOnceWith("utm", campaignPayload);
        expect(window.location.pathname + window.location.search + window.location.hash).toBe(
            "/julejobb?other=value#ledige-jobber",
        );
        expect(window.history.state).toEqual(historyState);
    });

    it("does not track a URL without campaign parameters", () => {
        mocks.analyticsConsent = true;
        mocks.userActionTaken = true;
        window.history.replaceState(null, "", "/julejobb?other=value");

        render(<UtmParamsHandler />);

        expect(mocks.track).not.toHaveBeenCalled();
        expect(window.location.search).toBe("?other=value");
    });
});
