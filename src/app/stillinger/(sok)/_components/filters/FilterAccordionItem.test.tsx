import { Accordion } from "@navikt/ds-react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FilterAccordionItem from "./FilterAccordionItem";

let searchParams = "";

vi.mock("next/navigation", () => ({
    useSearchParams: () => new URLSearchParams(searchParams),
    useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
    usePathname: () => "/stillinger",
}));

beforeEach(() => {
    searchParams = "";
});

function TestAccordion() {
    return (
        <Accordion>
            <FilterAccordionItem title="Sesong" watchKeys={["isSummerJob", "isXmasJob"]} openOnSelectionChange>
                Sesonginnhold
            </FilterAccordionItem>
            <FilterAccordionItem title="Annet" watchKeys={["sector"]}>
                Annet innhold
            </FilterAccordionItem>
        </Accordion>
    );
}

describe("FilterAccordionItem", () => {
    it("åpner Sesong-panelet ved overgang til aktivt filter, og lar det lukkes manuelt", async () => {
        const user = userEvent.setup();
        const { rerender } = render(<TestAccordion />);
        const header = screen.getByRole("button", { name: "Sesong" });

        expect(header).toHaveAttribute("aria-expanded", "false");

        searchParams = "isXmasJob=true";
        rerender(<TestAccordion />);
        expect(header).toHaveAttribute("aria-expanded", "true");

        await user.click(header);
        expect(header).toHaveAttribute("aria-expanded", "false");

        searchParams = "isXmasJob=true&q=utvikler";
        rerender(<TestAccordion />);
        expect(header).toHaveAttribute("aria-expanded", "false");
    });
});
