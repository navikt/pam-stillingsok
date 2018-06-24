import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import './AdText.less';

export default function AdText({ stilling }) {
    if (stilling._source.properties.adtext) {
        return (
            <section className="AdText">
                {ReactHtmlParser(stilling._source.properties.adtext)}
            </section>
        );
    }
    return null;
}

