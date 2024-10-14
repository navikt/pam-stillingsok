import React, { ReactNode } from "react";
import parse, { DOMNode, domToReact, HTMLReactParserOptions } from "html-react-parser";
import { Heading } from "@navikt/ds-react";
import { RichText } from "@navikt/arbeidsplassen-react";

const options: HTMLReactParserOptions = {
    replace: (domNode: DOMNode): React.JSX.Element | string | boolean | object | void | null | undefined => {
        // Sjekk om domNode er en tag (et HTML-element)
        if (domNode.type === "tag" && domNode.tagName) {
            const { tagName, attribs, children } = domNode;

            // Adjust h2 to Aksel h2.
            if (tagName === "h2") {
                return (
                    <Heading level="2" size="medium" spacing>
                        {domToReact(children as DOMNode[])}
                    </Heading>
                );
            }
            if (attribs && attribs.id === "arb-aapningstekst") {
                // Dokumentasjonen sier at dette er måten å gjøre det på
                // Skulle helst ha returnert null her men har ingen
                // effekt, da teksten rendres uansett av en eller annen grunn
                // eslint-disable-next-line react/jsx-no-useless-fragment
                return <></>;
            }
            return domToReact(children as DOMNode[]);
        }
        // Sjekk om domNode er en tekstnode
        if (domNode.type === "text") {
            return domNode.data; // Returner teksten direkte
        }

        return domToReact([domNode]);
    },
};

const optionsReplaceHeadings: HTMLReactParserOptions = {
    // Adjust heading levels
    replace: (domNode: DOMNode): React.JSX.Element | string | boolean | object | void | null | undefined => {
        if (domNode.type === "tag" && domNode.tagName) {
            const { tagName, children } = domNode;
            if (Array.isArray(children) && children.every((child) => (child as DOMNode).type)) {
                if (tagName === "h1") {
                    return (
                        <Heading level="2" size="medium" spacing>
                            {domToReact(children as DOMNode[])}
                        </Heading>
                    );
                }

                if (tagName === "h2") {
                    return (
                        <Heading level="3" size="small" spacing>
                            {domToReact(children as DOMNode[])}
                        </Heading>
                    );
                }

                if (tagName === "h3") {
                    return (
                        <Heading level="4" size="xsmall" spacing>
                            {domToReact(children as DOMNode[])}
                        </Heading>
                    );
                }
            }
            return domToReact(children as DOMNode[]);
        }

        // Sjekk om domNode er en tekstnode
        if (domNode.type === "text") {
            return domNode.data; // Returner teksten direkte
        }

        return domToReact([domNode]);
    },
};

export default function AdText({ adText }: { adText: string }): ReactNode {
    if (adText) {
        if (adText.includes("arb-aapningstekst")) {
            return <RichText className="job-posting-text">{parse(adText, options)}</RichText>;
        }
        return <RichText className="job-posting-text">{parse(adText, optionsReplaceHeadings)}</RichText>;
    }
    return null;
}
