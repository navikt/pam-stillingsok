import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';

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
        <div>
            <div>
                <div className="Search__separator"/>
                <Element className="blokk-xs">Følgende kriterier gir 0 treff:</Element>
            </div>
            {unknownValues && unknownValues.map((sec) => (
                <div key={sec}>
                    <Checkbox
                        name={`${namePrefix}-unknownFacetValue`}
                        label={`${sec} (0)`}
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
                        label={`${second.split('.')[1]} (0)`}
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

