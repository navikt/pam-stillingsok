"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutationObserver } from "./useMutationObserver";
import { useEffect, useRef, useState } from "react";
import * as ReactDOM from "react-dom/client";
import { Link as AkselLink, Stack } from "@navikt/ds-react";

function InsertLinksContent({ searchParams }: { searchParams: URLSearchParams }) {
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    const versionMatch = pathname.match(/stillinger-(\d+)/);
    const currentVersion = versionMatch ? versionMatch[1] : "4";

    const links = [
        { version: "1", label: "Versjon 1" },
        { version: "2", label: "Versjon 2" },
        { version: "3", label: "Versjon 3" },
        { version: "4", label: "Versjon 4" },
    ];

    const getHref = (version: string) => {
        const queryString = searchParams.toString();
        return `/stillinger-${version}${queryString ? `?${queryString}` : ""}`;
    };

    return (
        <>
            <Stack
                className="container-small mb-4"
                direction={{ xs: "column", md: "row" }}
                justify={{ md: "space-between" }}
                align={{ sm: "start", md: "center" }}
                gap="2 4"
                wrap={false}
            >
                {links.map(({ version, label }) => {
                    const isActive = currentVersion === version;
                    return (
                        <AkselLink
                            key={version}
                            as={Link}
                            href={getHref(version)}
                            className={isActive ? "active-version-link" : ""}
                            style={
                                isActive
                                    ? {
                                          padding: "0.5rem",
                                          borderRadius: "4px",
                                          outline: "2px solid var(--a-border-focus)",
                                          outlineOffset: "2px",
                                      }
                                    : undefined
                            }
                        >
                            {label}
                        </AkselLink>
                    );
                })}
            </Stack>
            <Stack
                className="container-small mb-4"
                direction={{ xs: "column", md: "row" }}
                justify={{ md: "center" }}
                align={{ sm: "center", md: "center" }}
                gap="2 4"
                wrap={false}
            >
                <AkselLink
                    target="_blank"
                    href={`https://forms.office.com/Pages/ResponsePage.aspx?id=NGU2YsMeYkmIaZtVNSedCzzqTBH9H4JIspiNYzvKj5JUOTAzVlgxUkJQSEtPWFlYRUozWDJWQU5aRSQlQCN0PWcu&r91188d1535794ec685d89cd062e70c45=${encodeURIComponent(window.location.href)}`}
                >
                    Gi oss en tilbakemelding
                </AkselLink>
            </Stack>
        </>
    );
}

export function InsertLinks() {
    const [shouldRender, setShouldRender] = useState(false);
    const [targetElement, setTargetElement] = useState<Element | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<ReactDOM.Root | null>(null);
    const searchParams = useSearchParams();

    useMutationObserver({
        targetId: "search-wrapper",
        childNumber: 1,
        onElementFound: (secondDiv) => {
            if (secondDiv !== targetElement) {
                setTargetElement(secondDiv);
                setShouldRender(true);
            }
        },
    });

    // Create container and root once
    useEffect(() => {
        if (!targetElement || !shouldRender || containerRef.current) return;

        const container = document.createElement("div");
        container.id = "version-links-container";
        targetElement.after(container);
        containerRef.current = container;
        rootRef.current = ReactDOM.createRoot(container);

        // Initial render
        rootRef.current.render(<InsertLinksContent searchParams={new URLSearchParams(window.location.search)} />);

        return () => {
            if (rootRef.current) {
                rootRef.current.unmount();
                rootRef.current = null;
            }
            if (containerRef.current?.parentNode) {
                containerRef.current.parentNode.removeChild(containerRef.current);
                containerRef.current = null;
            }
        };
    }, [targetElement, shouldRender]);

    // Update when searchParams change
    useEffect(() => {
        if (rootRef.current) {
            rootRef.current.render(<InsertLinksContent searchParams={searchParams} />);
        }
    }, [searchParams]);

    return null;
}
