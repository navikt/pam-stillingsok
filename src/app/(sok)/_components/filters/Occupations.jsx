import PropTypes from "prop-types";
import React from "react";
import { BodyShort, Box, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import moveCriteriaToBottom from "@/app/(sok)/_components/utils/moveFacetToBottom";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import sortValuesByFirstLetter from "@/app/(sok)/_components/utils/sortValuesByFirstLetter";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { useSearchParams } from "next/navigation";
import { SearchQueryParams } from "@/app/(sok)/_utils/constants";
import useSearchRouter from "@/app/(sok)/_utils/useSearchRouter";

export function editedItemKey(key) {
    return key === "Uoppgitt/ ikke identifiserbare" ? "Ikke oppgitt" : key;
}

const OCCUPATION_LEVEL_OTHER = "Uoppgitt/ ikke identifiserbare";

function Occupations({ initialValues, updatedValues }) {
    const withSortedSecondLevelOccupations = initialValues.map((item) => {
        const secondLevel = sortValuesByFirstLetter(item.occupationSecondLevels);
        return {
            secondLevel,
            ...item,
        };
    });

    const sortedByLetterFirstLevelOccupations = sortValuesByFirstLetter(withSortedSecondLevelOccupations);
    const sortedValues = moveCriteriaToBottom(sortedByLetterFirstLevelOccupations, OCCUPATION_LEVEL_OTHER);
    const values = mergeCount(sortedValues, updatedValues, "occupationSecondLevels");
    const router = useSearchRouter();
    const searchParams = useSearchParams();

    function handleFirstLevelClick(e) {
        const { value, checked } = e.target;
        const newSearchParams = new URLSearchParams(searchParams);
        if (checked) {
            newSearchParams.append(SearchQueryParams.OCCUPATION_LEVEL_1, value);
        } else {
            newSearchParams.delete(SearchQueryParams.OCCUPATION_LEVEL_1, value);

            // Remove all checked occupations on level 2, when level 1 is unchecked
            newSearchParams.getAll(SearchQueryParams.OCCUPATION_LEVEL_2).forEach((obj) => {
                if (obj.startsWith(`${value}.`)) newSearchParams.delete(SearchQueryParams.OCCUPATION_LEVEL_2, obj);
            });
        }
        router.replace(newSearchParams, { scroll: false });

        logFilterChanged({ name: "Yrke", value, checked, level: "Yrkesnivå 1" });
    }

    function handleSecondLevelClick(e) {
        const { value, checked } = e.target;
        const newSearchParams = new URLSearchParams(searchParams);
        if (checked) {
            newSearchParams.append(SearchQueryParams.OCCUPATION_LEVEL_2, value);
        } else {
            newSearchParams.delete(SearchQueryParams.OCCUPATION_LEVEL_2, value);
        }
        router.replace(newSearchParams, { scroll: false });

        logFilterChanged({ name: "Yrke", value: value.split(".")[1], checked, level: "Yrkesnivå 2" });
    }

    /**
     * This ensures that 'Tannhelse/-pleie' is displayed as 'Tannlege og tannpleier'
     * in the search filters. It's a mere cosmetic change since the value attributed
     * to the checkbox remains the same. The decision behind this particular change
     * came due to a problem in the categorization of STYRK codes.
     *
     * "Tannhelsesekretærer ligger under samme STYRK som legesekretærer så
     * det er ikke mulig å skille de fra hverandre, og nå er det nærliggende
     * å tro at også tannhelsesekretær-annonser ligger i denne kategorien."
     *
     * @param key
     * @returns {string|*}
     */
    function editedSecondLevelItemKey(key) {
        return key === "Tannhelse/-pleie" ? "Tannlege og tannpleier" : key;
    }

    return (
        <CheckboxGroup
            value={searchParams.getAll(SearchQueryParams.OCCUPATION_LEVEL_1)}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">yrke</span>
                </>
            }
            className="FilterModal__fieldset"
        >
            {values &&
                values.map((firstLevel) => (
                    <React.Fragment key={firstLevel.key}>
                        <Checkbox
                            name={SearchQueryParams.OCCUPATION_LEVEL_1}
                            label={`${firstLevel.key} (${firstLevel.count})`}
                            value={firstLevel.key}
                            onChange={handleFirstLevelClick}
                        >
                            {`${editedItemKey(firstLevel.key)} (${firstLevel.count})`}
                        </Checkbox>
                        {searchParams.getAll(SearchQueryParams.OCCUPATION_LEVEL_1).includes(firstLevel.key) &&
                            firstLevel.key !== OCCUPATION_LEVEL_OTHER && (
                                <CheckboxGroup
                                    value={searchParams.getAll(SearchQueryParams.OCCUPATION_LEVEL_2)}
                                    hideLegend
                                    legend={`Yrker innen ${firstLevel.key}`}
                                >
                                    <Box paddingInline="8 0">
                                        {firstLevel.occupationSecondLevels &&
                                            firstLevel.occupationSecondLevels.map((secondLevel) => (
                                                <Checkbox
                                                    name={SearchQueryParams.OCCUPATION_LEVEL_2}
                                                    key={editedSecondLevelItemKey(secondLevel.key)}
                                                    value={secondLevel.key}
                                                    onChange={handleSecondLevelClick}
                                                >
                                                    {`${editedSecondLevelItemKey(secondLevel.label)} (${
                                                        secondLevel.count
                                                    })`}
                                                </Checkbox>
                                            ))}
                                    </Box>
                                </CheckboxGroup>
                            )}
                    </React.Fragment>
                ))}
        </CheckboxGroup>
    );
}

Occupations.propTypes = {
    initialValues: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number,
            occupationSecondLevels: PropTypes.arrayOf(
                PropTypes.shape({
                    key: PropTypes.string,
                    count: PropTypes.number,
                }),
            ),
        }),
    ).isRequired,
    updatedValues: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Occupations;
