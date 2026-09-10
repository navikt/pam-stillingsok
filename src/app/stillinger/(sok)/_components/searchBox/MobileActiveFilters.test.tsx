import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MobileActiveFilters from "./MobileActiveFilters";

const routerReplace = vi.fn();
const routerPush = vi.fn();

vi.mock("next/navigation", () => {
    return {
        useSearchParams: () => new URLSearchParams("q=Utvikler&county=03"),
        useRouter: () => ({ replace: routerReplace, push: routerPush }),
        usePathname: () => "/stillinger",
    };
});

beforeEach(() => {
    routerReplace.mockClear();
    routerPush.mockClear();
});

describe("MobileActiveFilters", () => {
    it("viser valgte filtre og fjerner dem fra søket ved klikk", async () => {
        const user = userEvent.setup();
        render(<MobileActiveFilters />);

        expect(screen.getByRole("list", { name: "Aktive filtre" })).toBeInTheDocument();

        const chip = screen.getByRole("button", { name: /Utvikler/ });
        expect(chip).toBeInTheDocument();

        await user.click(chip);

        expect(routerReplace).toHaveBeenCalledTimes(1);
        const [nextUrl] = routerReplace.mock.calls[0];
        expect(nextUrl).not.toContain("q=Utvikler");
        expect(nextUrl).toContain("county=03");
    });

    it("viser «Fjern alle» som siste knapp i chip-listen", () => {
        render(<MobileActiveFilters />);

        const activeFilters = screen.getByRole("list", { name: "Aktive filtre" });
        const buttons = within(activeFilters).getAllByRole("button");

        expect(buttons[buttons.length - 1]).toHaveAccessibleName("Fjern alle");
    });

    it("nullstiller hele søket ved klikk på «Fjern alle»", async () => {
        const user = userEvent.setup();
        render(<MobileActiveFilters />);

        await user.click(screen.getByRole("button", { name: "Fjern alle" }));

        expect(routerReplace).toHaveBeenCalledTimes(1);
        const [nextUrl] = routerReplace.mock.calls[0];
        expect(nextUrl).toBe("/stillinger");
    });
});
