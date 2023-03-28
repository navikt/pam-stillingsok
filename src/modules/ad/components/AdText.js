import React from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import "./AdText.css";
import { containsEmail, extractEmail, isValidEmail, mailtoInString } from "../../../common/components/utils";

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
        return <section className="AdText">{parse(preprocessedAd)}</section>;
    }
    return null;
}

AdText.defaultProps = {
    adText: undefined
};

AdText.propTypes = {
    adText: PropTypes.string
};
