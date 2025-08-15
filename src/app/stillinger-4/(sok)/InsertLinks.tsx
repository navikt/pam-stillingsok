"use client";

import Link from "next/link";

import { useSearchParams } from "next/navigation";
import { useMutationObserver } from "./useMutationObserver";
import { useEffect, useState } from "react";
import * as ReactDOM from "react-dom/client";
import { Link as AkselLink, Stack } from "@navikt/ds-react";

function InsertLinksContent({ searchParams }: { searchParams: URLSearchParams }) {
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    const versionMatch = pathname.match(/stillinger-(\d+)/);
    const currentVersion = versionMatch ? versionMatch[1] : "4"; // Default to version 4

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
                    const isActive = currentVersion === `${version}`;
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
                    href="https://forms.office.com/Pages/ResponsePage.aspx?id=NGU2YsMeYkmIaZtVNSedCzzqTBH9H4JIspiNYzvKj5JUOTAzVlgxUkJQSEtPWFlYRUozWDJWQU5aRSQlQCN0PWcu&r91188d1535794ec685d89cd062e70c45=https%3A%2F%2Farbeidsplassen.nav.no%2Fstillinger%3Fq%3Dutvikler%26v%3D5%26occupationLevel1%3DBygg%2Bog%2Banlegg%26occupationLevel2%3DBygg%2Bog%2Banlegg.Andre%2Bingeni%25C3%25B8rer"
                >
                    Gi oss en tilbakemelding
                </AkselLink>
            </Stack>
        </>
    );
}

export function InsertLinks() {
    const [mounted, setMounted] = useState(false);
    const [targetElement, setTargetElement] = useState<Element | null>(null);
    const searchParams = useSearchParams();

    useMutationObserver({
        targetId: "main-content",
        childNumber: 2,
        onElementFound: (secondDiv) => {
            setTargetElement(secondDiv);
            setMounted(true);
        },
    });

    useEffect(() => {
        if (!mounted || !targetElement) return;

        let container = document.getElementById("custom-links-container");
        if (container) return;

        container = document.createElement("div");
        container.id = "custom-links-container";
        targetElement.after(container);

        const root = ReactDOM.createRoot(container);
        root.render(<InsertLinksContent searchParams={searchParams} />);

        return () => {
            root.unmount();
            if (container?.parentNode) {
                container.parentNode.removeChild(container);
            }
        };
    }, [mounted, targetElement]);

    return null;
}
