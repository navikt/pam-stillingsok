import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'nav-frontend-skjema';
import './Sorting.less';

export default function Sorting({sortBy, onSortByChange}) {

    const onSortingChange = (e) => {
        onSortByChange(e.target.value);
    };

    return (
        <div className="Sorting">
            <Select
                onChange={onSortingChange}
                value={sortBy}
                label="Sortér etter"
                className="typo-normal Sorting__Select"
            >
                <option key="published" value="published">Vis nyeste øverst</option>
                <option key="expires" value="expires">Søknadsfrist</option>
            </Select>
        </div>
    );
}

Sorting.propTypes = {
    sortBy: PropTypes.string.isRequired,
    onSortByChange: PropTypes.func.isRequired
};
