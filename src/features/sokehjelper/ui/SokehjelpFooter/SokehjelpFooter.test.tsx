import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchSokehjelpCount } from "@/features/sokehjelper/model/fetchSokehjelpCount";
import type { WizardState } from "@/features/sokehjelper/model/sokehjelperTypes";
import SokehjelpFooter from "./SokehjelpFooter";

vi.mock("@/features/sokehjelper/model/fetchSokehjelpCount", () => ({
    fetchSokehjelpCount: vi.fn(),
}));

const initialState: WizardState = {
    jobbtypes: [],
    steder: [],
    county: null,
    municipal: null,
    yrker: [],
    fritekst: "",
    aktivtSteg: 1,
};

describe("SokehjelpFooter", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.mocked(fetchSokehjelpCount).mockReset().mockResolvedValue(42);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("venter til valgene har vært uendret i ett sekund og teller bare siste valg", async () => {
        const { rerender } = render(<SokehjelpFooter state={initialState} />);
        await act(() => vi.advanceTimersByTimeAsync(500));

        const state: WizardState = { ...initialState, jobbtypes: ["deltid"] };
        rerender(<SokehjelpFooter state={state} />);
        await act(() => vi.advanceTimersByTimeAsync(999));
        expect(fetchSokehjelpCount).not.toHaveBeenCalled();

        await act(() => vi.advanceTimersByTimeAsync(1));
        expect(fetchSokehjelpCount).toHaveBeenCalledExactlyOnceWith(state);
        expect(screen.getByRole("status")).toHaveTextContent("42 jobber");
    });

    it("avbryter planlagt telling når komponenten fjernes", async () => {
        const { unmount } = render(<SokehjelpFooter state={initialState} />);
        unmount();
        await act(() => vi.advanceTimersByTimeAsync(1000));

        expect(fetchSokehjelpCount).not.toHaveBeenCalled();
    });
});
