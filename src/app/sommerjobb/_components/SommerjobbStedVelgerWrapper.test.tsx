import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SommerjobbStedVelgerWrapper from "@/app/sommerjobb/_components/SommerjobbStedVelgerWrapper";

describe("SommerjobbStedVelgerWrapper", () => {
    it("renderer innhold", () => {
        render(
            <SommerjobbStedVelgerWrapper>
                <div>Innhold</div>
            </SommerjobbStedVelgerWrapper>,
        );

        const contents = screen.getAllByText("Innhold");
        expect(contents).toHaveLength(1);
    });
});
