import React from 'react';
import PropTypes from 'prop-types';

export default function Kartlenke(props) {
    const queryString = props.queryString;
    if (queryString) {
        return (
            <a id="kart-lenke" className="typo-normal lenke" href={`/sok/kart?${queryString}`} aria-hidden="true" role="tab">Vis kart</a>
        );
    }
    return (
        <a id="kart-lenke" className="typo-normal lenke" href="/sok/kart" aria-hidden="true" role="tab">Vis kart</a>
    );
}

Kartlenke.defaultProps = {
    queryString: undefined
};

Kartlenke.propTypes = {
    queryString: PropTypes.string
};
