import React from 'react';
import PropTypes from 'prop-types';

export default function SearchResultItemLogo(props) {

    const { className, alt, src} = props;
    return (
        <img
            className={className}
            src={src}
            alt={alt}
        />
    );
}

SearchResultItemLogo.propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
    alt: PropTypes.string.isRequired
};
