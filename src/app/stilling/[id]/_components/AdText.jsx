import React from "react";
import PropTypes from "prop-types";
import parse, { domToReact } from "html-react-parser";
import { Heading } from "@navikt/ds-react";
import { RichText } from "@navikt/arbeidsplassen-react";

const options = {
    replace: ({ attribs, tagName, children }) => {
        // Adjust h2 to Aksel h2.
        if (tagName === "h2") {
            return (
                <Heading level="2" size="medium" spacing>
                    {domToReact(children)}
                </Heading>
            );
        }
        if (attribs && attribs.id === "arb-aapningstekst") {
            // eslint-disable-next-line
            return <></>;
        }
        return attribs;
    },
};

const optionsReplaceHeadings = {
    // Adjust heading levels
    replace: ({ tagName, children }) => {
        if (tagName === "h1") {
            return (
                <Heading level="2" size="medium" spacing>
                    {domToReact(children)}
                </Heading>
            );
        }
        if (tagName === "h2") {
            return (
                <Heading level="3" size="small" spacing>
                    {domToReact(children)}
                </Heading>
            );
        }
        if (tagName === "h3") {
            return (
                <Heading level="4" size="xsmall" spacing>
                    {domToReact(children)}
                </Heading>
            );
        }
        return children;
    },
};

export default function AdText({ adText }) {
    if (adText) {
        if (adText.includes("arb-aapningstekst")) {
            return <RichText className="job-posting-text">{parse(adText, options)}</RichText>;
        }
        return <RichText className="job-posting-text">{parse(adText, optionsReplaceHeadings)}</RichText>;
    }
    return null;
}

AdText.propTypes = {
    adText: PropTypes.string,
};
