import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { SkyraScripts } from "./SkyraScripts";
import { createSkyraInlineConfig } from "./skyraConfig";

type NextScriptMockProps = Readonly<{
    id?: string;
    src?: string;
    nonce?: string;
    children?: React.ReactNode;
}>;

vi.mock("next/script", () => {
    const MockScript = ({ id, src, nonce, children }: NextScriptMockProps): JSX.Element => {
        return (
            <div
                data-next-script="true"
                data-script-id={id ?? ""}
                data-script-src={src ?? ""}
                data-script-nonce={nonce ?? ""}
            >
                {children}
            </div>
        );
    };

    return { default: MockScript };
});

describe("Skyra config hardening", () => {
    it("escaper </script> slik at det ikke kan bryte ut av script-taggen", () => {
        const inline = createSkyraInlineConfig({
            org: '</script><script>alert("xss")</script>',
            cookieConsent: true,
        });

        expect(inline.includes("</script>")).toBe(false);
        expect(inline).toContain("\\u003c/script\\u003e");
    });

    it("renderer to 'Script'-komponenter med forventede attributter", () => {
        const { container } = render(<SkyraScripts nonce="nonce123" org="nav" cookieConsent={true} />);

        const mockedScripts = container.querySelectorAll('[data-next-script="true"]');
        expect(mockedScripts.length).toBe(2);

        const configEl = container.querySelector('[data-script-id="skyra-config"]');
        expect(configEl).not.toBeNull();

        const surveyEl = container.querySelector('[data-script-id="skyra-survey"]');
        expect(surveyEl?.getAttribute("data-script-src")).toBe("https://survey.skyra.no/skyra-survey.js");
    });

    it("a11y: ingen fokuserbare elementer rendres av script-wrapperen", () => {
        const { container } = render(<SkyraScripts nonce="nonce123" org="nav" cookieConsent={true} />);

        const focusables = container.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
        expect(focusables.length).toBe(0);
    });
});
