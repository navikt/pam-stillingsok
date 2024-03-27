import React from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import { RichText } from "@navikt/arbeidsplassen-react";

export default function AdText({ adText }) {
    if (adText) {
        return <RichText className="job-posting-text">{parse(adText)}</RichText>;
    }
    return null;
}

AdText.propTypes = {
    adText: PropTypes.string,
};
