import PropTypes from 'prop-types';
import React from 'react';

export default function Star({ fill, stroke }) {
    return (
        <svg width="24px" height="23px" viewBox="0 0 24 23" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <title>star</title>
            <desc>Created with Sketch.</desc>
            <defs />
            <g id="Symbols" stroke="none" strokeWidth="1" fill={fill} fillRule="evenodd">
                <g id="Stillingssok/-liste" transform="translate(-773.000000, -21.000000)" stroke={stroke}>
                    <g id="Group">
                        <g id="star/uten-fyll-grå" transform="translate(773.000000, 21.000000)">
                            <polygon
                                id="Star"
                                points="12 18 4.94657697 21.7082039 6.2936609 13.854102 0.587321804 8.29179607
                                     8.47328849 7.14589803 12 0 15.5267115 7.14589803 23.4126782 8.29179607 17.7063391
                                     13.854102 19.053423 21.7082039"
                            />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
}

Star.propTypes = {
    stroke: PropTypes.string.isRequired,
    fill: PropTypes.string.isRequired
};

