import React from "react";
import PropTypes from "prop-types";
import { Checkbox, Heading } from "@navikt/ds-react";
import fixLocationName from "../../../../../../server/common/fixLocationName";

export default function UnknownSearchCriteriaValues({
    namePrefix,
    unknownValues,
    checkedValues,
    onClick,
    unknownNestedValues,
    checkedNestedValues,
    onNestedLevelClick,
    shouldFixLocationName,
}) {
    if (unknownValues.length + unknownNestedValues.length === 0) {
        return null;
    }

    return (
        <>
            <Heading level="4" size="small" spacing>
                Følgende kriterier gir 0 treff:
            </Heading>
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
        </>
    );
}

UnknownSearchCriteriaValues.defaultProps = {
    unknownValues: [],
    checkedValues: [],
    unknownNestedValues: [],
    checkedNestedValues: [],
    onNestedLevelClick: undefined,
    shouldFixLocationName: false,
};

UnknownSearchCriteriaValues.propTypes = {
    namePrefix: PropTypes.string.isRequired,
    unknownValues: PropTypes.array,
    checkedValues: PropTypes.array,
    onClick: PropTypes.func.isRequired,
    unknownNestedValues: PropTypes.array,
    checkedNestedValues: PropTypes.array,
    onNestedLevelClick: PropTypes.func,
    shouldFixLocationName: PropTypes.bool,
};
