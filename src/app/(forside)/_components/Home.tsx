"use client";

import { useEffect, useRef } from "react";
import { Accordion, BodyLong, Button, Heading, HStack, Show } from "@navikt/ds-react";
import { FiguresSideBySide } from "@navikt/arbeidsplassen-react";
import { MagnifyingGlassIcon } from "@navikt/aksel-icons";
import InformationUkraine from "@/app/(forside)/_components/InformationUkraine";
import Link from "next/link";
import KarriereveiledningPanel from "./Karriereveiledning";
import GiTilbakemelding from "./GiTilbakemelding";
import SkyraInit from "@/app/_common/skyra/Skyra";

export default function Home() {
    const skyraRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const host = skyraRef.current;
        if (!host) return;

        let disposed = false;

        const onClosed = (reason?: string, evt?: Event) => {
            if (disposed) return;

            console.log("Skyra survey closed:", { reason, evt });
        };

        const hostEventNames = ["close", "closed", "hide", "hidden", "finish", "ended", "skyra:close", "survey:closed"];
        const hostHandlers: Array<[string, EventListener]> = hostEventNames.map((name) => {
            const handler: EventListener = (e) => onClosed(`host:${name}`, e);
            host.addEventListener(name, handler);
            return [name, handler];
        });

        let shadowCleanup: (() => void) | undefined;
        const attachShadowListeners = () => {
            const sr = (host as any).shadowRoot as ShadowRoot | null;
            if (!sr) return;
            const names = ["close", "closed", "hide", "hidden", "finish", "ended", "skyra:close", "survey:closed"];
            const handlers: Array<[string, EventListener]> = [];
            names.forEach((n) => {
                const h: EventListener = (e) => onClosed(`shadow:${n}`, e);
                sr.addEventListener(n, h, { capture: true });
                handlers.push([n, h]);
            });
            shadowCleanup = () => {
                handlers.forEach(([n, h]) => sr.removeEventListener(n, h, { capture: true } as any));
            };
        };

        // Some custom elements attach shadow later; wait for upgrade
        customElements
            .whenDefined("skyra-survey")
            .then(() => {
                if (!disposed) attachShadowListeners();
            })
            .catch(() => {});

        // 3) Fallbacks: detect hidden/removed states if no events fire
        const isHidden = () => {
            const cs = getComputedStyle(host);
            return (
                host.hasAttribute("hidden") ||
                host.getAttribute("aria-hidden") === "true" ||
                cs.display === "none" ||
                cs.visibility === "hidden"
            );
        };

        const attrObserver = new MutationObserver(() => {
            if (isHidden()) onClosed("mutation:hidden");
        });
        attrObserver.observe(host, { attributes: true, attributeFilter: ["hidden", "style", "class", "aria-hidden"] });

        const removalObserver = new MutationObserver(() => {
            if (!document.body.contains(host)) {
                onClosed("mutation:removed");
                removalObserver.disconnect();
            }
        });
        removalObserver.observe(document.body, { childList: true, subtree: true });

        // Optional: if the component collapses to 0x0 when closed
        const ro = new ResizeObserver(() => {
            const rect = host.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                onClosed("resize:collapsed");
            }
        });
        ro.observe(host);

        return () => {
            disposed = true;
            hostHandlers.forEach(([n, h]) => host.removeEventListener(n, h));
            shadowCleanup?.();
            attrObserver.disconnect();
            removalObserver.disconnect();
            ro.disconnect();
        };
    }, []);

    return (
        <div className="container-large mt-5 mb-24">
            <SkyraInit />
            <HStack gap="20" align="center">
                <div className="flex-3">
                    <Heading size="xlarge" level="1" spacing className="jumbo-h1">
                        Alle ledige jobber, <br />
                        samlet på én plass
                    </Heading>

                    <Accordion className="accordion-feedback">
                        <Accordion.Item>
                            <Accordion.Header>Gi tilbakemelding</Accordion.Header>
                            <Accordion.Content>
                                {/* If you add a JSX typing shim for "skyra-survey", you can remove this cast */}
                                {/* @ts-expect-error custom element */}
                                <skyra-survey
                                    ref={skyraRef as any}
                                    className="w-full h-full"
                                    slug="arbeids-og-velferdsetaten-nav/test-arbeidsplassen-dev"
                                />
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion>

                    <BodyLong size="large" spacing>
                        Lete etter jobb skal være enkelt. Fra deltid til direktør, finn jobben som passer for deg.
                    </BodyLong>

                    <HStack gap="4" className="mb-16">
                        <Button
                            variant="primary"
                            as={Link}
                            href="/stillinger"
                            role="link"
                            icon={<MagnifyingGlassIcon aria-hidden="true" />}
                        >
                            Søk etter jobber
                        </Button>
                    </HStack>
                </div>

                <Show above="lg">
                    <FiguresSideBySide />
                </Show>
            </HStack>

            <div className="mb-12" data-nosnippet="true">
                <KarriereveiledningPanel />
            </div>

            <div className="mb-12">
                <InformationUkraine />
            </div>
        </div>
    );
}
