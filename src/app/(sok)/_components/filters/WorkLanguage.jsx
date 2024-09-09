import PropTypes from "prop-types";
import React from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import moveCriteriaToBottom from "@/app/(sok)/_components/utils/moveFacetToBottom";
import { WORK_LANGUAGE } from "@/app/(sok)/_components/searchParamNames";
import useSearchQuery from "@/app/(sok)/_components/SearchStateProvider";

function WorkLanguage({ initialValues, updatedValues, hideLegend = false }) {
    const sortedValues = moveCriteriaToBottom(initialValues, "Ikke oppgitt");
    const values = mergeCount(sortedValues, updatedValues);
    const searchQuery = useSearchQuery();

    function handleClick(e) {
        const { value, checked } = e.target;
        if (checked) {
            searchQuery.append(WORK_LANGUAGE, value);
        } else {
            searchQuery.remove(WORK_LANGUAGE, value);
        }
        logFilterChanged({ name: "Arbeidsspråk", value, checked });
    }

    return (
        <CheckboxGroup
            value={searchQuery.getAll(WORK_LANGUAGE)}
            hideLegend={hideLegend}
            legend={
                <BodyShort as="span" visuallyHidden>
                    Filtrer etter arbeidsspråk
                </BodyShort>
            }
        >
            {values.map((item) => (
                <Checkbox name="workLanguage[]" key={item.key} value={item.key} onChange={handleClick}>
                    {`${item.key} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}

WorkLanguage.propTypes = {
    initialValues: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number,
        }),
    ).isRequired,
    updatedValues: PropTypes.arrayOf(PropTypes.shape({})),
};

export default WorkLanguage;
