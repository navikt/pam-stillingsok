import React from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import { RichText } from "@navikt/arbeidsplassen-react";

export default function AdText({ adText }) {
    const options = {
        replace: ({ attribs }) => {
            if (attribs && attribs.id === "arb-aapningstekst") {
                return <></>;
            }
        },
    };

    if (adText) {
        if (adText.includes("arb-aapningstekst")) {
            return <RichText className="job-posting-text">{parse(adText, options)}</RichText>;
        }
        return <RichText className="job-posting-text">{parse(adText)}</RichText>;
    }
    return null;
}

AdText.propTypes = {
    adText: PropTypes.string,
};
