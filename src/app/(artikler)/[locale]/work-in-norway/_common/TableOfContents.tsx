import { useEffect, useRef, useState } from "react";
import { Heading } from "@navikt/ds-react";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import NextLink from "next/link";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

interface HeadingItem {
    id: string;
    title: string;
    items?: HeadingItem[];
}

interface HeadingsProps {
    headings: HeadingItem[];
    activeId?: string;
    ariaLabelledBy: string;
}

interface TableOfContentsProps {
    locale?: string;
    selectorPrefix?: string;
}

const getNestedHeadings = (headingElements: Element[]): HeadingItem[] => {
    const nestedHeadings: HeadingItem[] = [];

    headingElements.forEach((heading) => {
        const { innerText: title, id } = heading as HTMLElement;

        if (heading.nodeName === "H2") {
            nestedHeadings.push({ id, title, items: [] });
        }
    });

    return nestedHeadings;
};

const useHeadingsData = (prefix = "") => {
    const [nestedHeadings, setNestedHeadings] = useState<HeadingItem[]>([]);

    useEffect(() => {
        const headingElements = Array.from(document.querySelectorAll(`${prefix} h2:not(nav h2)`));
        const newNestedHeadings = getNestedHeadings(headingElements);
        setNestedHeadings(newNestedHeadings);
    }, [prefix]);

    return { nestedHeadings };
};

const Headings: React.FC<HeadingsProps> = ({ headings, activeId, ariaLabelledBy }) => {
    return (
        <ul aria-labelledby={ariaLabelledBy}>
            {headings.map((heading) => (
                <li key={heading.id} className={heading.id === activeId ? "active" : ""}>
                    <NextLink
                        href={`#${heading.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.querySelector(`#${heading.id}`)?.scrollIntoView({
                                behavior: "smooth",
                            });
                        }}
                    >
                        {heading.title}
                    </NextLink>
                </li>
            ))}
        </ul>
    );
};

const useIntersectionObserver = (setActiveId: (id: string) => void, prefix = "") => {
    const headingElementsRef = useRef<Record<string, IntersectionObserverEntry>>({});

    useEffect(() => {
        const headingElements = Array.from(document.querySelectorAll(`${prefix} h2:not(nav h2)`));
        const callback: IntersectionObserverCallback = (headings) => {
            headingElementsRef.current = headings.reduce((map, headingElement) => {
                map[headingElement.target.id] = headingElement;
                return map;
            }, headingElementsRef.current);

            const visibleHeadings = Object.values(headingElementsRef.current).filter((entry) => entry.isIntersecting);

            const getIndexFromId = (id: string) => headingElements.findIndex((heading) => heading.id === id);

            if (visibleHeadings.length === 1) {
                setActiveId(visibleHeadings[0].target.id);
            } else if (visibleHeadings.length > 1) {
                const sortedVisibleHeadings = visibleHeadings.sort(
                    (a, b) => getIndexFromId(a.target.id) - getIndexFromId(b.target.id),
                );
                setActiveId(sortedVisibleHeadings[0].target.id);
            }
        };

        const observer = new IntersectionObserver(callback, {
            rootMargin: "0px 0px -40% 0px",
        });

        headingElements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, [setActiveId, prefix]);
};

const TableOfContents: React.FC<TableOfContentsProps> = ({ locale = "en", selectorPrefix = "" }) => {
    const [activeId, setActiveId] = useState<string>();
    const { nestedHeadings } = useHeadingsData(selectorPrefix);
    useIntersectionObserver(setActiveId, selectorPrefix);

    return (
        <nav className="table-of-contents-wrapper" aria-label="Page contents">
            <div className="table-of-contents-container">
                <Heading id="table-of-contents" className="table-of-contents-label" lang="en" level="2" size="small">
                    Page contents
                </Heading>
                <div className="table-of-contents">
                    <Headings headings={nestedHeadings} activeId={activeId} ariaLabelledBy="table-of-contents" />
                </div>
                <AkselNextLink
                    href={`/${locale}/work-in-norway`}
                    className="table-of-contents back-link-main-content"
                    lang="en"
                >
                    <ChevronLeftIcon aria-hidden="true" />
                    Back to main page
                </AkselNextLink>
            </div>
        </nav>
    );
};

export default TableOfContents;
