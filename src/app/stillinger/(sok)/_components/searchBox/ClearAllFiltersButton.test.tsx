import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import ClearAllFiltersButton from "./ClearAllFiltersButton";

const routerReplace = vi.fn();
const { track } = vi.hoisted(() => ({
    track: vi.fn(),
}));

vi.mock("@/app/_common/umami", () => ({ track }));
vi.mock("next/navigation", () => ({
    useSearchParams: () => new URLSearchParams("q=Utvikler"),
    useRouter: () => ({ replace: routerReplace }),
    usePathname: () => "/stillinger",
}));

it("sporer og nullstiller søket", async () => {
    const user = userEvent.setup();
    render(<ClearAllFiltersButton />);

    await user.click(screen.getByRole("button", { name: "Fjern alle" }));

    expect(track).toHaveBeenCalledWith("Klikk - Fjern alle filtre", { enhet: "desktop" });
    expect(routerReplace).toHaveBeenCalledWith("/stillinger", { scroll: false });
});
