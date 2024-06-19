import PropTypes from "prop-types";
import React from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import moveCriteriaToBottom from "@/app/(sok)/_components/utils/moveFacetToBottom";
import sortEducationValues from "@/app/(sok)/_components/utils/sortEducationValues";
import { useSearchParams } from "next/navigation";
import { SearchQueryParams } from "@/app/(sok)/_utils/constants";
import useSearchRouter from "@/app/(sok)/_utils/useSearchRouter";

function Education({ initialValues, updatedValues }) {
    const sortedValuesByEducation = sortEducationValues(initialValues);
    const sortedValues = moveCriteriaToBottom(sortedValuesByEducation, "Ikke oppgitt");
    const values = mergeCount(sortedValues, updatedValues);
    const router = useSearchRouter();
    const searchParams = useSearchParams();

    function handleClick(e) {
        const { value, checked } = e.target;
        const newSearchParams = new URLSearchParams(searchParams);
        if (checked) {
            newSearchParams.append(SearchQueryParams.EDUCATION, value);
        } else {
            newSearchParams.delete(SearchQueryParams.EDUCATION, value);
        }
        router.replace(newSearchParams, { scroll: false });
        logFilterChanged({ name: "Utdanningsnivå", value, checked });
    }

    return (
        <CheckboxGroup
            className="mb-4"
            value={searchParams.getAll(SearchQueryParams.EDUCATION)}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">utdanning</span>
                </>
            }
        >
            {values.map((item) => (
                <Checkbox key={item.key} name={SearchQueryParams.EDUCATION} value={item.key} onChange={handleClick}>
                    {`${labelForEducation(item.key)} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}

export const labelForEducation = (key) => {
    switch (key) {
        case "Ingen krav":
            return "Ingen krav til utdanning";
        case "Master":
            return "Master eller tilsvarende";
        case "Videregående":
            return "Videregående skole";
        case "Fagbrev":
            return "Fag- eller svennebrev";
        case "Fagskole":
            return "Fagskole eller tilsvarende";
        case "Bachelor":
            return "Bachelor eller tilsvarende";
        default:
            return key;
    }
};

Education.propTypes = {
    initialValues: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number,
        }),
    ).isRequired,
    updatedValues: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Education;
