import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';

export default function UnknownFacets(
    {
        namePrefix,
        unknownFacets,
        checkedFacets,
        onUnknownFacetClick,
        unknownFacetsSecondLevel,
        checkedFacetsSecondLevels,
        onUnknownFacetSecondLevelClick
    }
) {
    if (unknownFacets.length + unknownFacetsSecondLevel.length === 0) {
        return <div/>
    }

    return (
        <div>
            <div>
                <div className="Search__separator"/>
                <Element className="blokk-xs">Følgende kriterier gir 0 treff:</Element>
            </div>
            {unknownFacets && unknownFacets.map((sec) => (
                <div key={sec}>
                    <Checkbox
                        name={`${namePrefix}-deprecatedFacet`}
                        label={`${sec} (0)`}
                        value={sec}
                        onChange={onUnknownFacetClick}
                        checked={checkedFacets.includes(sec)}
                    />
                </div>
            ))}
            {unknownFacetsSecondLevel && unknownFacetsSecondLevel.map((second) => (
                <div key={second}>
                    <Checkbox
                        name={`${namePrefix}-deprecatedFacetSecondLevel`}
                        label={`${second.split('.')[1]} (0)`}
                        value={second}
                        onChange={onUnknownFacetSecondLevelClick}
                        checked={checkedFacetsSecondLevels.includes(second)}
                    />
                </div>
            ))}
        </div>
    );
}

UnknownFacets.defaultProps = {
    unknownFacetsSecondLevel: [],
    checkedFacetsSecondLevels: [],
    onUnknownFacetSecondLevelClick: undefined
};

UnknownFacets.propTypes = {
    namePrefix: PropTypes.string.isRequired,
    unknownFacets: PropTypes.array.isRequired,
    checkedFacets: PropTypes.array.isRequired,
    onUnknownFacetClick: PropTypes.func.isRequired,
    unknownFacetsSecondLevel: PropTypes.array,
    checkedFacetsSecondLevels: PropTypes.array,
    onUnknownFacetSecondLevelClick: PropTypes.func
};

