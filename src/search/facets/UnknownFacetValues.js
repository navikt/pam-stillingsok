import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import './UnknownFacetValues.less';
import fixLocationName from '../../../server/common/fixLocationName';

export default function UnknownFacetValues(
    {
        namePrefix,
        unknownValues,
        checkedValues,
        onClick,
        unknownNestedValues,
        checkedNestedValues,
        onNestedLevelClick
    }
) {
    if (unknownValues.length + unknownNestedValues.length === 0) {
        return <div/>
    }

    return (
        <div className="UnknownFacetValues">
            <Element className="UnknownFacetValues__label">Følgende kriterier gir 0 treff:</Element>
            {unknownValues && unknownValues.map((sec) => (
                <div key={sec}>
                    <Checkbox
                        name={`${namePrefix}-unknownFacetValue`}
                        label={`${fixLocationName(sec)} (0)`}
                        value={sec}
                        onChange={onClick}
                        checked={checkedValues.includes(sec)}
                    />
                </div>
            ))}
            {unknownNestedValues && unknownNestedValues.map((second) => (
                <div key={second}>
                    <Checkbox
                        name={`${namePrefix}-unknownFacetNestedValue`}
                        label={`${fixLocationName(second.split('.')[1])} (0)`}
                        value={second}
                        onChange={onNestedLevelClick}
                        checked={checkedNestedValues.includes(second)}
                    />
                </div>
            ))}
        </div>
    );
}

UnknownFacetValues.defaultProps = {
    unknownNestedValues: [],
    checkedNestedValues: [],
    onNestedLevelClick: undefined
};

UnknownFacetValues.propTypes = {
    namePrefix: PropTypes.string.isRequired,
    unknownValues: PropTypes.array.isRequired,
    checkedValues: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    unknownNestedValues: PropTypes.array,
    checkedNestedValues: PropTypes.array,
    onNestedLevelClick: PropTypes.func
};

