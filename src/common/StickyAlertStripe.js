import AlertStripe from 'nav-frontend-alertstriper';
import PropTypes from 'prop-types';
import React from 'react';
import './StickyAlertStripe.less';

export default function StickyAlertStripe({ children, type }) {
    return (
        <AlertStripe type={type} className="StickyAlertStripe alertstripe--solid">
            {children}
        </AlertStripe>
    );
}

StickyAlertStripe.propTypes = {
    type: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired
};
