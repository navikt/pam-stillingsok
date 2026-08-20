import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SearchExperienceRating } from "./SearchExperienceRating";

vi.mock("@/app/_experiments/client/ExperimentProvider", () => ({
    useExperimentVariant: () => "test",
}));

const trackMock = vi.fn();
vi.mock("@/app/_common/umami", () => ({
    track: (eventName: string, props?: Record<string, unknown>) => {
        trackMock(eventName, props);
    },
}));

vi.mock("./searchExperienceCookie", () => ({
    hasSearchExperienceRatingCookie: () => false,
    setSearchExperienceRatingCookie: vi.fn(),
}));

vi.mock("./searchBoxUsed", () => ({
    hasSearchBoxBeenUsed: () => true,
}));

import { setSearchExperienceRatingCookie } from "./searchExperienceCookie";

type ObserverCallback = (entries: readonly IntersectionObserverEntry[]) => void;

class MockIntersectionObserver {
    public static instances: MockIntersectionObserver[] = [];

    private readonly callback: ObserverCallback;

    public constructor(callback: ObserverCallback) {
        this.callback = callback;
        MockIntersectionObserver.instances.push(this);
    }

    public observe() {}
    public unobserve() {}
    public disconnect() {}

    public trigger(isIntersecting: boolean) {
        this.callback([{ isIntersecting } as IntersectionObserverEntry]);
    }
}

describe("SearchExperienceRating", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        MockIntersectionObserver.instances = [];
        vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    function renderWithRef() {
        const ref = { current: document.createElement("div") };
        const result = render(<SearchExperienceRating searchBoxRef={ref} />);
        return { ...result, ref };
    }

    function openDialog() {
        const observer = MockIntersectionObserver.instances[0];
        act(() => {
            observer.trigger(false);
        });
        act(() => {
            vi.advanceTimersByTime(2000);
        });
    }

    it("should not show dialog initially", () => {
        renderWithRef();
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should show dialog 2s after search box leaves viewport", () => {
        renderWithRef();
        openDialog();

        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText("Hvordan synes du søkefelt og filter virker?")).toBeInTheDocument();
    });

    it("should not show dialog if search box returns to viewport before timeout", () => {
        renderWithRef();

        const observer = MockIntersectionObserver.instances[0];
        act(() => {
            observer.trigger(false);
        });
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        act(() => {
            observer.trigger(true);
        });
        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should track rating and show thank you state when user rates", () => {
        renderWithRef();
        openDialog();

        const ratingButton = screen.getByRole("button", { name: /Fantastisk \(5 av 5\)/ });
        fireEvent.click(ratingButton);

        expect(trackMock).toHaveBeenCalledWith("AB - konvertering", {
            experiment: "searchbox-simple-variant",
            variant: "test",
            konvertering: "rating",
            rating: 5,
        });

        expect(setSearchExperienceRatingCookie).toHaveBeenCalledWith("rated");

        // Dialog should still be open with thank you content
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText("🎉 Tusen takk!")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Gi tilbakemelding" })).toBeInTheDocument();
        const closeButtons = screen.getAllByRole("button", { name: "Lukk" });
        expect(closeButtons.length).toBeGreaterThanOrEqual(1);
    });

    it("should close dialog when clicking Lukk in thank you state", () => {
        renderWithRef();
        openDialog();

        const ratingButton = screen.getByRole("button", { name: /Bra \(4 av 5\)/ });
        fireEvent.click(ratingButton);

        expect(screen.getByText("🎉 Tusen takk!")).toBeInTheDocument();

        // Select the explicit "Lukk" button (not the Dialog's built-in X close button)
        const closeButtons = screen.getAllByRole("button", { name: "Lukk" });
        const primaryCloseButton = closeButtons.find((btn) => btn.textContent === "Lukk");
        fireEvent.click(primaryCloseButton!);

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should set cookie when user dismisses", () => {
        renderWithRef();
        openDialog();

        const dismissButton = screen.getByRole("button", { name: "Nei takk, vil ikke stemme" });
        fireEvent.click(dismissButton);

        expect(setSearchExperienceRatingCookie).toHaveBeenCalledWith("dismissed");
    });

    it("should render all 5 emoji options", () => {
        renderWithRef();
        openDialog();

        expect(screen.getByRole("button", { name: /Veldig dårlig \(1 av 5\)/ })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Dårlig \(2 av 5\)/ })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Helt greit \(3 av 5\)/ })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Bra \(4 av 5\)/ })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Fantastisk \(5 av 5\)/ })).toBeInTheDocument();
    });
});
