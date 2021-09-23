import React from 'react';
import PropTypes from 'prop-types';
import './TotalFavourites.less';

export default function TotalFavourites({ total }) {
    return (
        <div className="TotalFavourites">
            <h2 className="TotalFavourites__label">{total !== 1 ? `${total} annonser` : '1 annonse'}</h2>
        </div>
    );
}

TotalFavourites.propTypes = {
    total: PropTypes.number.isRequired
};
