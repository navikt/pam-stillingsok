import React from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { RichText } from "@navikt/arbeidsplassen-react";
import { containsEmail, extractEmail, isValidEmail, mailtoInString } from "@/app/_common/utils/utils";

const preprocessAd = (adText) => {
    if (containsEmail(adText)) {
        try {
            const extractedEmails = [...extractEmail(adText)];
            let preprocessedAd = adText.replace(/&#64;/g, "@");
            extractedEmails.forEach((it) => {
                if (isValidEmail(it) && !mailtoInString(preprocessedAd, it)) {
                    preprocessedAd = preprocessedAd.replace(it, `<a rel="nofollow" href="mailto:${it}">${it}</a>`);
                }
            });
            return preprocessedAd;
        } catch (err) {
            return adText;
        }
    }
    return adText;
};

export default function AdText({ adText }) {
    if (adText) {
        const preprocessedAd = preprocessAd(adText);
        const cleanHtml = DOMPurify.sanitize(preprocessedAd);
        return <div className="job-posting-text">{parse(cleanHtml)}</div>;
    }
    return null;
}

AdText.propTypes = {
    adText: PropTypes.string,
};
