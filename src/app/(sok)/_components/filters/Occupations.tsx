import React, { ReactElement } from "react";
import { BodyShort, Box, Checkbox, CheckboxGroup, ReadMore } from "@navikt/ds-react";
import moveFilterToBottom from "@/app/(sok)/_components/utils/moveFilterToBottom";
import { mergeCountOccupations } from "@/app/(sok)/_components/utils/mergeCount";
import sortValuesByFirstLetter from "@/app/(sok)/_components/utils/sortValuesByFirstLetter";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { OCCUPATION_FIRST_LEVEL, OCCUPATION_SECOND_LEVEL } from "@/app/(sok)/_components/searchParamNames";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import { OccupationFilterAggregation } from "@/app/(sok)/_types/FilterAggregations";

export function editedItemKey(key: string): string {
    return key === "Uoppgitt/ ikke identifiserbare" ? "Ikke oppgitt" : key;
}

const OCCUPATION_LEVEL_OTHER = "Uoppgitt/ ikke identifiserbare";

interface OccupationsProps {
    initialValues: OccupationFilterAggregation[];
    updatedValues: OccupationFilterAggregation[];
}

export default function Occupations({ initialValues, updatedValues }: OccupationsProps): ReactElement {
    const withSortedSecondLevelOccupations = initialValues.map((item) => {
        const secondLevel = sortValuesByFirstLetter(item.occupationSecondLevels);
        return {
            secondLevel,
            ...item,
        };
    });

    const sortedByLetterFirstLevelOccupations = sortValuesByFirstLetter(withSortedSecondLevelOccupations);
    const sortedValues = moveFilterToBottom(
        sortedByLetterFirstLevelOccupations,
        OCCUPATION_LEVEL_OTHER,
    ) as OccupationFilterAggregation[];
    const values = mergeCountOccupations(sortedValues, updatedValues);
    const searchQuery = useSearchQuery();

    function handleFirstLevelChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            searchQuery.append(OCCUPATION_FIRST_LEVEL, value);
        } else {
            searchQuery.remove(OCCUPATION_FIRST_LEVEL, value);
            searchQuery.getAll(OCCUPATION_SECOND_LEVEL).forEach((obj) => {
                if (obj.startsWith(`${value}.`)) {
                    searchQuery.remove(OCCUPATION_SECOND_LEVEL, obj);
                }
            });
        }
        logFilterChanged({ name: "Yrkeskategori", value, checked, level: "Yrkesnivå 1" });
    }

    function handleSecondLevelChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            searchQuery.append(OCCUPATION_SECOND_LEVEL, value);
        } else {
            searchQuery.remove(OCCUPATION_SECOND_LEVEL, value);
        }
        logFilterChanged({ name: "Yrkeskategori", value: value.split(".")[1], checked, level: "Yrkesnivå 2" });
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
    function editedSecondLevelItemKey(key: string): string {
        return key === "Tannhelse/-pleie" ? "Tannlege og tannpleier" : key;
    }

    return (
        <CheckboxGroup
            value={searchQuery.getAll(OCCUPATION_FIRST_LEVEL)}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">yrkeskategorier</span>
                </>
            }
            description={
                <ReadMore header="Hva er yrkeskategorier?">
                    Yrkeskategorier er brede grupper av relaterte stillinger. Leter du etter en spesifikk
                    stillingstittel? Bruk søkefeltet.
                </ReadMore>
            }
            className="FilterModal__fieldset"
        >
            {values &&
                values.map((firstLevel) => (
                    <React.Fragment key={firstLevel.key}>
                        <Checkbox
                            name="occupationFirstLevels[]"
                            value={firstLevel.key}
                            onChange={handleFirstLevelChange}
                        >
                            {`${editedItemKey(firstLevel.key)} (${firstLevel.count})`}
                        </Checkbox>
                        {searchQuery.has(OCCUPATION_FIRST_LEVEL, firstLevel.key) &&
                            firstLevel.key !== OCCUPATION_LEVEL_OTHER && (
                                <CheckboxGroup
                                    defaultValue={searchQuery.getAll(OCCUPATION_SECOND_LEVEL)}
                                    hideLegend
                                    legend={`Yrker innen ${firstLevel.key}`}
                                >
                                    <Box paddingInline="8 0">
                                        {firstLevel.occupationSecondLevels &&
                                            firstLevel.occupationSecondLevels.map((secondLevel) => (
                                                <Checkbox
                                                    name="occupationSecondLevels[]"
                                                    key={editedSecondLevelItemKey(secondLevel.key)}
                                                    value={secondLevel.key}
                                                    onChange={handleSecondLevelChange}
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
