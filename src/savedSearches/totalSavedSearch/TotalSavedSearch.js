import React from 'react';
import PropTypes from 'prop-types';
import './TotalSavedSearch.less';

export default function TotalSavedSearch({ total }) {
    return (
        <h2 className="TotalSavedSearch">
            {total !== 1 ? `${total} lagrede søk` : '1 lagret søk'}
        </h2>
    );
}

TotalSavedSearch.propTypes = {
    total: PropTypes.number.isRequired
};
