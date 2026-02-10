import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SommerjobbStedVelger from "./SommerjobbStedVelger";
import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => {
    return {
        useSearchParams: () => new URLSearchParams(""),
        useRouter: () => ({ replace: vi.fn() }),
        usePathname: () => "/sommerjobb",
    };
});

describe("SommerjobbStedVelger", () => {
    it("renderer et tilgjengelig komboboksfelt basert på label", async () => {
        const user = userEvent.setup();

        const locations: readonly SearchLocation[] = [
            {
                key: "TROMS",
                label: "Troms",
                code: "19",
                municipals: [{ key: "TROMS.TROMSØ", label: "Tromsø", code: "5401" }],
            },
            { key: "UTLAND", label: "Utland", code: "999", municipals: [] },
        ];

        render(<SommerjobbStedVelger locations={locations} />);

        const inputs = screen.getAllByLabelText("Skriv hvor du vil jobbe");
        expect(inputs.length).toBeGreaterThanOrEqual(1);

        await user.click(inputs[0]);
        expect(inputs[0]).toBeInTheDocument();
    });
});
