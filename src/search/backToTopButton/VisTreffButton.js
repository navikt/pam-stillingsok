import React from 'react';
import PropTypes from 'prop-types';
import Chevron from 'nav-frontend-chevron';

export default function VisTreffButton({ count }) {
    return (
        <a
            href="#treff"
            className="VisTreffButton"
        >
            <span className="VisTreffButton__inner">
                <span className="VisTreffButton__count typo-normal">{count}</span>
                <span className="VisTreffButton__treff typo-normal">treff</span>
                <Chevron className="VisTreffButton__chevron" type="ned" />
            </span>
        </a>
    );
}

VisTreffButton.propTypes = {
    count: PropTypes.number.isRequired
};
