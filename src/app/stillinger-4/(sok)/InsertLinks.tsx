"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { useMutationObserver } from "./useMutationObserver";
import { useEffect, useRef, useState } from "react";
import * as ReactDOM from "react-dom/client";
import { Link as AkselLink, Button, BodyLong, Stack } from "@navikt/ds-react";

function InsertLinksContent({ searchParams, pathname }: { searchParams: URLSearchParams; pathname: string }) {
    const queryString = searchParams.toString();
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname;
    const versionMatch = pathname.match(/stillinger-(\d+)/);
    let currentVersion = parseInt(versionMatch ? versionMatch[1] : "4");
    if (currentVersion < 3) {
        currentVersion = 3;
    }

    const links = [
        { version: "3", label: "Resultat A" },
        { version: "4", label: "Resultat B" },
    ];

    const getHref = (version: string) => {
        const queryString = searchParams.toString();
        if (searchParams.get("locked") === "true") {
            return `/stillinger-${version}${queryString ? `?${queryString}` : ""}`;
        } else {
            return `/stillinger-${version}${queryString ? `?${queryString}&locked=true` : ""}`;
        }
    };

    return (
        <>
            <Stack
                className="container-small mb-6"
                direction={{ xs: "column", md: "row" }}
                justify={{ md: "center" }}
                align={{ sm: "center", md: "center" }}
                gap="2 4"
                wrap={false}
            >
                <BodyLong weight="semibold" size="large">
                    Sammenlign de ulike resultatene av søket ditt
                </BodyLong>
            </Stack>
            <Stack
                className="container-small mb-8"
                direction={{ xs: "column", md: "row" }}
                justify={{ md: "center" }}
                align={{ sm: "start", md: "center" }}
                gap="2 8"
                wrap={false}
            >
                {links.map(({ version, label }) => {
                    const isActive = currentVersion === parseInt(version);
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
                className="container-small mb-12"
                direction={{ xs: "column", md: "row" }}
                justify={{ md: "center" }}
                align={{ sm: "center", md: "center" }}
                gap="2 4"
                wrap={false}
            >
                {/* eslint-disable-next-line */}
                {typeof window !== undefined && (
                    <Button
                        as={Link}
                        role="link"
                        target="_blank"
                        href={`https://forms.office.com/Pages/ResponsePage.aspx?id=NGU2YsMeYkmIaZtVNSedCzzqTBH9H4JIspiNYzvKj5JUOTAzVlgxUkJQSEtPWFlYRUozWDJWQU5aRSQlQCN0PWcu&r91188d1535794ec685d89cd062e70c45=${encodeURIComponent("https://arbeidsplassen.nav.no" + fullPath)}`}
                    >
                        Gi tilbakemelding på søkeresultatene
                    </Button>
                )}
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
    const pathname = usePathname();

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
        rootRef.current.render(<InsertLinksContent searchParams={searchParams} pathname={pathname} />);

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
            rootRef.current.render(<InsertLinksContent searchParams={searchParams} pathname={pathname} />);
        }
    }, [searchParams]);

    return null;
}
