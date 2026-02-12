import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ViewportEventTracker } from "./ViewportEventTracker";

vi.mock("next/navigation", () => {
    return {
        usePathname: () => "/stillinger/stilling/123",
    };
});

const trackMock = vi.fn();
vi.mock("@/app/_common/umami/track", () => {
    return {
        track: (eventName: string, props?: Record<string, unknown>) => {
            trackMock(eventName, props);
        },
    };
});

type ObserverCallback = (entries: readonly IntersectionObserverEntry[]) => void;

class MockIntersectionObserver {
    public static instances: MockIntersectionObserver[] = [];

    private readonly callback: ObserverCallback;

    public constructor(callback: ObserverCallback) {
        this.callback = callback;
        MockIntersectionObserver.instances.push(this);
    }

    public observe(): void {
        // no-op
    }

    public disconnect(): void {
        // no-op
    }

    public trigger(isIntersecting: boolean): void {
        const entry = { isIntersecting } as IntersectionObserverEntry;
        this.callback([entry]);
    }
}

describe("ViewportEventTracker", () => {
    const originalIO = globalThis.IntersectionObserver;

    beforeEach(() => {
        trackMock.mockClear();
        vi.useFakeTimers();

        MockIntersectionObserver.instances = [];

        globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
    });

    afterEach(() => {
        vi.useRealTimers();
        globalThis.IntersectionObserver = originalIO;
        vi.restoreAllMocks();
    });

    it("er skjult for skjermleser (aria-hidden)", () => {
        render(
            <ViewportEventTracker
                eventName="sett bunnen av annonseteksten"
                resetKey="1234asd"
                getPayload={({ timeOnPageMs }) => {
                    return {
                        adId: "1234asd",
                        kontekst: "stilling",
                        flowId: "flow-5678",
                        tidSynligMs: timeOnPageMs,
                    };
                }}
            />,
        );
        const sentinel = screen.getByTestId("viewport-event-tracker-sentinel");
        expect(sentinel).toHaveAttribute("aria-hidden", "true");
    });

    it("tracker én gang når terskler er oppfylt", () => {
        let nowMs = 0;

        vi.spyOn(window.performance, "now").mockImplementation(() => {
            return nowMs;
        });

        render(
            <ViewportEventTracker
                eventName="sett bunnen av annonseteksten"
                resetKey="1234asd"
                minTimeOnPageMs={12_000}
                minVisibleMs={500}
                getPayload={({ timeOnPageMs }) => {
                    return {
                        kontekst: "stilling",
                        flowId: "flow-5678",
                        adId: "1234asd",
                        tidSynligMs: timeOnPageMs,
                    };
                }}
            />,
        );

        const observer = MockIntersectionObserver.instances[0];
        if (!observer) {
            throw new Error("Forventet IntersectionObserver-instans.");
        }

        // Sentinel blir synlig ved t=0 → komponenten planlegger timeout på 12_000ms
        observer.trigger(true);

        // Simuler at tiden faktisk går på siden
        nowMs = 20_000;

        // Viktig: advance minst 12_000ms (ikke 500ms), siden waitMs blir 12_000
        vi.advanceTimersByTime(12_000);

        expect(trackMock).toHaveBeenCalledTimes(1);

        // Trigger igjen – skal ikke tracke på nytt
        observer.trigger(false);
        observer.trigger(true);
        vi.advanceTimersByTime(12_000);

        expect(trackMock).toHaveBeenCalledTimes(1);
    });
});
