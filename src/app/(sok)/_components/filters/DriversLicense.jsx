import PropTypes from "prop-types";
import React from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { NEED_DRIVERS_LICENSE } from "@/app/(sok)/_components/searchParamNames";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";

function DriversLicense({ initialValues, updatedValues }) {
    const sortedValues = sortDriverLicenseValues(initialValues);
    const values = mergeCount(sortedValues, updatedValues);
    const searchQuery = useSearchQuery();

    function handleClick(e) {
        const { value, checked } = e.target;
        if (checked) {
            searchQuery.append(NEED_DRIVERS_LICENSE, value);
        } else {
            searchQuery.remove(NEED_DRIVERS_LICENSE, value);
        }
        logFilterChanged({ name: "Førerkort", value, checked });
    }

    return (
        <CheckboxGroup
            value={searchQuery.getAll(NEED_DRIVERS_LICENSE)}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">førerkort</span>
                </>
            }
        >
            {values.map((item) => (
                <Checkbox name="needDriversLicense[]" key={item.key} value={item.key} onChange={handleClick}>
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
