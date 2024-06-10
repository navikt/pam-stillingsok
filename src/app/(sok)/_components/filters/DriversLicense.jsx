import PropTypes from "prop-types";
import React from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { ADD_NEEDDRIVERSLICENSE, REMOVE_NEEDDRIVERSLICENSE } from "@/app/(sok)/_utils/queryReducer";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";

function DriversLicense({ initialValues, updatedValues, query, dispatch }) {
    const sortedValues = sortDriverLicenseValues(initialValues);
    const values = mergeCount(sortedValues, updatedValues);

    function handleClick(e) {
        const { value, checked } = e.target;
        if (checked) {
            dispatch({ type: ADD_NEEDDRIVERSLICENSE, value });
        } else {
            dispatch({ type: REMOVE_NEEDDRIVERSLICENSE, value });
        }
        logFilterChanged({ name: "Førerkort", value, checked });
    }

    return (
        <CheckboxGroup
            name="needDriversLicense[]"
            defaultValue={query.needDriversLicense}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">Førerkort</span>
                </>
            }
        >
            {values.map((item) => (
                <Checkbox key={item.key} value={item.key} onChange={handleClick}>
                    {`${labelForNeedDriversLicense(item.key)} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}

DriversLicense.propTypes = {
    initialValues: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number,
        }),
    ).isRequired,
    updatedValues: PropTypes.arrayOf(PropTypes.shape({})),
    dispatch: PropTypes.func.isRequired,
};

export const labelForNeedDriversLicense = (key) => {
    switch (key) {
        case "true":
            return "Må ha førerkort";
        case "false":
            return "Trenger ikke førerkort";
        default:
            return key;
    }
};

function sortDriverLicenseValues(facets) {
    if (!facets) {
        return undefined;
    }
    const sortedPublishedValues = ["false", "true", "Ikke oppgitt"];
    return facets.sort((a, b) => sortedPublishedValues.indexOf(a.key) - sortedPublishedValues.indexOf(b.key));
}

export default DriversLicense;
