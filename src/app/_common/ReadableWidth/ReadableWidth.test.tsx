import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReadableWidth } from "./ReadableWidth";

describe("ReadableWidth", () => {
    it("renderes som ønsket tag og forwarder attributter", () => {
        render(
            <ReadableWidth as="article" id="article-id" data-testid="wrapper">
                Innhold
            </ReadableWidth>,
        );

        const wrapper = screen.getByTestId("wrapper");
        expect(wrapper.tagName.toLowerCase()).toBe("article");
        expect(wrapper).toHaveAttribute("id", "article-id");
    });

    it("dokumenterer tilgjengelig adferd: section med navn blir en navngitt region", () => {
        render(
            <ReadableWidth as="section" aria-label="Tekstinnhold">
                Seksjon
            </ReadableWidth>,
        );

        expect(screen.getByRole("region", { name: "Tekstinnhold" })).toBeInTheDocument();
    });
});
