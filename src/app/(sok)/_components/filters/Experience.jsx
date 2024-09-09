import PropTypes from "prop-types";
import React from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { EXPERIENCE } from "@/app/(sok)/_components/searchParamNames";
import useSearchQuery from "@/app/(sok)/_components/SearchStateProvider";

function Experience({ initialValues, updatedValues }) {
    const sortedValues = sortExperienceValues(initialValues);
    const values = mergeCount(sortedValues, updatedValues);
    const searchQuery = useSearchQuery();

    function handleClick(e) {
        const { value, checked } = e.target;
        if (checked) {
            searchQuery.append(EXPERIENCE, value);
        } else {
            searchQuery.remove(EXPERIENCE, value);
        }
        logFilterChanged({ name: "Erfaring", value, checked });
    }

    return (
        <CheckboxGroup
            className="mb-4"
            value={searchQuery.getAll(EXPERIENCE)}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter erfaring
                    </BodyShort>
                    <span className="capitalize">Erfaring</span>
                </>
            }
        >
            {values.map((item) => (
                <Checkbox key={item.key} name="experience[]" value={item.key} onChange={handleClick}>
                    {`${labelForExperience(item.key)} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}

export const labelForExperience = (key) => {
    switch (key) {
        case "Ingen":
            return "Ingen krav til arbeidserfaring";
        case "Noe":
            return "Noe arbeidserfaring (1-3år)";
        case "Mye":
            return "Mye arbeidserfaring (4år+)";
        default:
            return key;
    }
};

function sortExperienceValues(facets) {
    if (!facets) {
        return undefined;
    }
    const sortedPublishedValues = ["Ingen", "Noe", "Mye", "Ikke oppgitt"];
    return facets.sort((a, b) => sortedPublishedValues.indexOf(a.key) - sortedPublishedValues.indexOf(b.key));
}

Experience.propTypes = {
    initialValues: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number,
        }),
    ).isRequired,
    updatedValues: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Experience;
