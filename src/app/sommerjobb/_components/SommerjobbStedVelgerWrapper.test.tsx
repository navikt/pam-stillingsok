import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SommerjobbStedVelgerWrapper from "@/app/sommerjobb/_components/SommerjobbStedVelgerWrapper";

describe("SommerjobbStedVelgerWrapper", () => {
    it("renderer innhold og eksponerer overskrift som nivå 2", () => {
        render(
            <SommerjobbStedVelgerWrapper headerText="I nærheten av...">
                <div>Innhold</div>
            </SommerjobbStedVelgerWrapper>,
        );

        const headings = screen.getAllByRole("heading", { level: 2, name: "I nærheten av..." });
        expect(headings.length).toBeGreaterThanOrEqual(1);

        const contents = screen.getAllByText("Innhold");
        expect(contents).toHaveLength(2);
    });

    it("skjuler lokasjonsikonet for skjermlesere", () => {
        const { container } = render(
            <SommerjobbStedVelgerWrapper headerText="I nærheten av...">
                <div>Innhold</div>
            </SommerjobbStedVelgerWrapper>,
        );

        const svg = container.querySelector('svg[aria-hidden="true"]');
        expect(svg).not.toBeNull();
    });
});
