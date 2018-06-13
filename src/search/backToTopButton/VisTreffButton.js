import React from 'react';
import PropTypes from 'prop-types';
import Chevron from 'nav-frontend-chevron';

export default function VisTreffButton({ count }) {
    return (
        <a
            href="#treff"
            className="knapp knapp--standard"
        >
            <Chevron className="BackToTop__chevron" type="ned" />
            {count > 0 ? (
                <span>Vis {count} treff</span>
            ) : (
                <span>Ingen treff</span>
            )}
        </a>
    );
}

VisTreffButton.propTypes = {
    count: PropTypes.number.isRequired
};
