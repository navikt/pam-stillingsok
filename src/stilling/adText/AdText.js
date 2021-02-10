import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import './AdText.less';
import {containsEmail, extractEmail, isValidEmail, mailtoInString} from "../../utils";

const preprocessAd = (adText) => {
    if (containsEmail(adText)) {
        const extractedEmails = [...extractEmail(adText)];
        let preprocessedAd = adText.replace(/&#64;/g, "@");
        extractedEmails.forEach(it => {
            if (isValidEmail(it) && !mailtoInString(preprocessedAd, it)) {
                preprocessedAd = preprocessedAd.replace(it, `<a rel="nofollow" href="mailto:${it}">${it}</a>`);
            }
        });
        return preprocessedAd
    }
    return adText;
};

export default function AdText({adText}) {

    useEffect(() => {
        const elements = document.querySelectorAll('a');
        let el;
        elements.forEach((it) => {
            if (it.innerHTML === 'Søk på stillingen') el = it;
        });
        console.log(el)
        if (el) {
            el.classList.add('Knapp');
            el.classList.add('Knapp--hoved');
            el.classList.add('SokPaaStilling--knapp');
        }
    }, []);

    if (adText) {
        const preprocessedAd = preprocessAd(adText);
        return (
            <section className="AdText">
                {ReactHtmlParser(preprocessedAd)}
            </section>
        );
    }
    return null;
}

AdText.defaultProps = {
    adText: undefined
};

AdText.propTypes = {
    adText: PropTypes.string
};
