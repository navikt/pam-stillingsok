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
    const skyraSurveyRef = useRef<HTMLElement>(null);

    const checkShadowContent = () => {
        const element = skyraSurveyRef.current;
        return !!element?.shadowRoot?.childElementCount;
    };

    useEffect(() => {
        if (typeof window === "undefined" || !skyraSurveyRef.current) return;

        const onSurveyEvent = (data: { type: string }) => {
            console.log("Skyra event:", data);
            // Handle events here
        };

        const observer = new MutationObserver((mutations, obs) => {
            const hasContent = checkShadowContent();
            console.log("Shadow DOM content changed, has content:", hasContent, mutations);

            if (hasContent && !window._skyraListenersAdded) {
                console.log("Adding Skyra event listeners");
                window.skyra?.on?.("surveyCompleted", onSurveyEvent);
                window.skyra?.on?.("surveyRejected", onSurveyEvent);
                window._skyraListenersAdded = true;
            } else if (!hasContent && window._skyraListenersAdded) {
                console.log("Removing Skyra event listeners");
                window.skyra?.off?.("surveyCompleted", onSurveyEvent);
                window.skyra?.off?.("surveyRejected", onSurveyEvent);
                window._skyraListenersAdded = false;
            }
        });

        // If no shadowRoot yet, observe the element for when it gets one
        observer.observe(skyraSurveyRef.current, {
            childList: false,
            subtree: false,
            attributes: true,
        });

        // Also set up a mutation observer on the document to catch when the shadow root is created
        const docObserver = new MutationObserver((mutations) => {
            if (skyraSurveyRef.current?.shadowRoot) {
                console.log("Shadow root now exists, observing it");
                observer.observe(skyraSurveyRef.current.shadowRoot, {
                    childList: true,
                    subtree: true,
                    characterData: true,
                });
                docObserver.disconnect();
            }
        });

        docObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Initial check
        if (checkShadowContent()) {
            window.skyra?.on?.("surveyCompleted", onSurveyEvent);
            window.skyra?.on?.("surveyRejected", onSurveyEvent);
            window._skyraListenersAdded = true;
        }

        return () => {
            observer.disconnect();
            docObserver.disconnect();
            if (window._skyraListenersAdded) {
                window.skyra?.off?.("surveyCompleted", onSurveyEvent);
                window.skyra?.off?.("surveyRejected", onSurveyEvent);
                delete window._skyraListenersAdded;
            }
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
                                    ref={skyraSurveyRef as any}
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
