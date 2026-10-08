import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import runAxeTest from "@/app/_common/axe/runAxeTest";
import VimeoVideo from "@/app/_common/VimeoVideo/VimeoVideo";

const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));
vi.mock("@/app/_common/umami", () => ({ track: trackMock }));

describe("VimeoVideo", () => {
    it("viser ikke iframe eller Vimeo-ressurs før klikk", () => {
        const { container } = render(<VimeoVideo title="Tips om jobb" href="https://vimeo.com/1180806925" />);

        expect(container.querySelector("iframe")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Spill av video: Tips om jobb" })).toBeInTheDocument();
    });

    it("laster iframe med dnt=1 og riktig tittel først etter klikk, og sporer ett event", async () => {
        const user = userEvent.setup();
        render(
            <VimeoVideo
                title="Tips om jobb"
                href="https://vimeo.com/1180806925"
                trackingData={{
                    provider: "vimeo",
                    videoId: "1180806925",
                    videoTitle: "Tips om jobb",
                    section: "ung",
                    location: "inline",
                    trigger: "play",
                }}
            />,
        );

        await user.click(screen.getByRole("button", { name: "Spill av video: Tips om jobb" }));

        const iframe = screen.getByTitle("Tips om jobb");
        expect(iframe).toHaveAttribute("src", "https://player.vimeo.com/video/1180806925?dnt=1&autoplay=1");
        expect(trackMock).toHaveBeenCalledOnce();
        expect(trackMock).toHaveBeenCalledWith("Klikk - video", {
            provider: "vimeo",
            videoId: "1180806925",
            videoTitle: "Tips om jobb",
            section: "ung",
            location: "inline",
            trigger: "play",
        });
    });

    it("aktiverer med tastatur", async () => {
        const user = userEvent.setup();
        render(<VimeoVideo title="Tips om jobb" href="https://vimeo.com/1180806925" />);

        const button = screen.getByRole("button", { name: "Spill av video: Tips om jobb" });
        button.focus();
        await user.keyboard("{Enter}");

        expect(screen.getByTitle("Tips om jobb")).toBeInTheDocument();
    });

    it("viser ingen figcaption når description ikke er satt", () => {
        const { container } = render(
            <VimeoVideo title="Tips om jobb" href="https://player.vimeo.com/video/1180806925?" />,
        );

        expect(container.querySelector("figcaption")).not.toBeInTheDocument();
    });

    it("viser description i figcaption når den er satt", () => {
        render(
            <VimeoVideo
                title="Tips om jobb"
                href="https://player.vimeo.com/video/1180806925?"
                description="Video, 1:52"
            />,
        );

        expect(screen.getByText("Video, 1:52")).toBeInTheDocument();
    });

    it("viser ingen iframe eller trygg lenke for ugyldig input, bare en rå lenke", () => {
        const { container } = render(<VimeoVideo title="Mistenkelig" href="https://evil.example/1180806925" />);

        expect(container.querySelector("iframe")).not.toBeInTheDocument();
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Mistenkelig" })).toHaveAttribute(
            "href",
            "https://evil.example/1180806925",
        );
    });

    it("har ingen UU-feil", async () => {
        const { container } = render(<VimeoVideo title="Tips om jobb" href="https://vimeo.com/1180806925" />);

        await act(async () => {
            await runAxeTest(container);
        });
    });

    it("viser thumbnail fra Drupal (ikke Vimeo) før klikk når thumbnailSrc er satt", () => {
        const { container } = render(
            <VimeoVideo
                title="Tips om jobb"
                href="https://vimeo.com/1180806925"
                thumbnailSrc="https://cms.staging.karriereveiledning.no/sites/default/files/thumb.jpg"
            />,
        );

        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("alt", "");
        expect(container.querySelector("iframe")).not.toBeInTheDocument();
    });

    it("faller tilbake til gradient-placeholder når thumbnailen feiler å laste", () => {
        const { container } = render(
            <VimeoVideo
                title="Tips om jobb"
                href="https://vimeo.com/1180806925"
                thumbnailSrc="https://cms.staging.karriereveiledning.no/sites/default/files/manglende.jpg"
            />,
        );

        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
        if (img) {
            fireEvent.error(img);
        }

        expect(container.querySelector("img")).not.toBeInTheDocument();
    });
});
