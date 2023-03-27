import React from "react";
import PropTypes from "prop-types";
import fixLocationName from "../../../../../../server/common/fixLocationName";
import { Checkbox } from "@navikt/ds-react";

export default function UnknownSearchCriteriaValues({
    namePrefix,
    unknownValues,
    checkedValues,
    onClick,
    unknownNestedValues,
    checkedNestedValues,
    onNestedLevelClick,
    shouldFixLocationName
}) {
    if (unknownValues.length + unknownNestedValues.length === 0) {
        return null;
    }

    return (
        <React.Fragment>
            <h4>Følgende kriterier gir 0 treff:</h4>
            {unknownValues.map((sec) => (
                <Checkbox
                    key={sec}
                    name={`${namePrefix}-unknownFacetValue`}
                    value={sec}
                    onChange={onClick}
                    checked={checkedValues.includes(sec)}
                >
                    {`${shouldFixLocationName ? fixLocationName(sec, true) : sec} (0)`}
                </Checkbox>
            ))}
            {unknownNestedValues.map((second) => (
                <Checkbox
                    key={second}
                    name={`${namePrefix}-unknownFacetNestedValue`}
                    value={second}
                    onChange={onNestedLevelClick}
                    checked={checkedNestedValues.includes(second)}
                >
                    {`${shouldFixLocationName ? fixLocationName(second.split(".")[1]) : second} (0)`}
                </Checkbox>
            ))}
        </React.Fragment>
    );
}

UnknownSearchCriteriaValues.defaultProps = {
    unknownValues: [],
    checkedValues: [],
    unknownNestedValues: [],
    checkedNestedValues: [],
    onNestedLevelClick: undefined,
    shouldFixLocationName: false
};

UnknownSearchCriteriaValues.propTypes = {
    namePrefix: PropTypes.string.isRequired,
    unknownValues: PropTypes.array.isRequired,
    checkedValues: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    unknownNestedValues: PropTypes.array,
    checkedNestedValues: PropTypes.array,
    onNestedLevelClick: PropTypes.func,
    shouldFixLocationName: PropTypes.bool
};
