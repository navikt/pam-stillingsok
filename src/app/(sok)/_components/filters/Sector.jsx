import PropTypes from "prop-types";
import React from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import moveCriteriaToBottom from "@/app/(sok)/_components/utils/moveFacetToBottom";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import sortValuesByFirstLetter from "@/app/(sok)/_components/utils/sortValuesByFirstLetter";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { useSearchParams } from "next/navigation";
import { SearchQueryParams } from "@/app/(sok)/_utils/constants";
import useSearchRouter from "@/app/(sok)/_utils/useSearchRouter";

function Sector({ initialValues, updatedValues }) {
    const sortedValuesByFirstLetter = sortValuesByFirstLetter(initialValues);
    const sortedValues = moveCriteriaToBottom(sortedValuesByFirstLetter, "Ikke oppgitt");
    const values = mergeCount(sortedValues, updatedValues);
    const router = useSearchRouter();
    const searchParams = useSearchParams();

    function handleClick(e) {
        const { value, checked } = e.target;
        const newSearchParams = new URLSearchParams(searchParams);
        if (checked) {
            newSearchParams.append(SearchQueryParams.SECTOR, value);
        } else {
            newSearchParams.delete(SearchQueryParams.SECTOR, value);
        }
        router.replace(newSearchParams, { scroll: false });
        logFilterChanged({ name: "Sektor", value, checked });
    }

    return (
        <CheckboxGroup
            className="mt-4"
            value={searchParams.getAll(SearchQueryParams.SECTOR)}
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
                <Checkbox name={SearchQueryParams.SECTOR} key={item.key} value={item.key} onChange={handleClick}>
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
