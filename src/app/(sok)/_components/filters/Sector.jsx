import PropTypes from "prop-types";
import React from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import moveCriteriaToBottom from "@/app/(sok)/_components/utils/moveFacetToBottom";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import sortValuesByFirstLetter from "@/app/(sok)/_components/utils/sortValuesByFirstLetter";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { SECTOR } from "@/app/(sok)/_components/searchParamNames";
import useSearchQuery from "@/app/(sok)/_components/SearchStateProvider";

function Sector({ initialValues, updatedValues }) {
    const sortedValuesByFirstLetter = sortValuesByFirstLetter(initialValues);
    const sortedValues = moveCriteriaToBottom(sortedValuesByFirstLetter, "Ikke oppgitt");
    const values = mergeCount(sortedValues, updatedValues);
    const searchQuery = useSearchQuery();

    function handleClick(e) {
        const { value, checked } = e.target;
        if (checked) {
            searchQuery.append(SECTOR, value);
        } else {
            searchQuery.remove(SECTOR, value);
        }
        logFilterChanged({ name: "Sektor", value, checked });
    }

    return (
        <CheckboxGroup
            className="mt-4"
            value={searchQuery.getAll(SECTOR)}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">sektor</span>
                </>
            }
        >
            {values.map((item) => (
                <Checkbox name="sector[]" key={item.key} value={item.key} onChange={handleClick}>
                    {`${item.key} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}

Sector.propTypes = {
    initialValues: PropTypes.arrayOf(PropTypes.shape({})),
    updatedValues: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Sector;
