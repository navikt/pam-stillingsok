import PropTypes from "prop-types";
import React from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import moveCriteriaToBottom from "@/app/(sok)/_components/utils/moveFacetToBottom";
import { useSearchParams } from "next/navigation";
import { SearchQueryParams } from "@/app/(sok)/_utils/constants";
import useSearchRouter from "@/app/(sok)/_utils/useSearchRouter";

function WorkLanguage({ initialValues, updatedValues, hideLegend = false }) {
    const sortedValues = moveCriteriaToBottom(initialValues, "Ikke oppgitt");
    const values = mergeCount(sortedValues, updatedValues);
    const searchParams = useSearchParams();
    const router = useSearchRouter();

    function handleClick(e) {
        const { value, checked } = e.target;
        const newSearchParams = new URLSearchParams(searchParams);
        if (checked) {
            newSearchParams.append(SearchQueryParams.WORK_LANGUAGE, value);
        } else {
            newSearchParams.delete(SearchQueryParams.WORK_LANGUAGE, value);
        }
        router.replace(newSearchParams, { scroll: false });
        logFilterChanged({ name: "Arbeidsspråk", value, checked });
    }

    return (
        <CheckboxGroup
            value={searchParams.getAll(SearchQueryParams.WORK_LANGUAGE)}
            hideLegend={hideLegend}
            legend={
                <BodyShort as="span" visuallyHidden>
                    Filtrer etter arbeidsspråk
                </BodyShort>
            }
        >
            {values.map((item) => (
                <Checkbox name={SearchQueryParams.WORK_LANGUAGE} key={item.key} value={item.key} onChange={handleClick}>
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
