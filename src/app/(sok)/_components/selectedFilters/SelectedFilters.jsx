import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Chips, HStack } from "@navikt/ds-react";
import { TrashIcon } from "@navikt/aksel-icons";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import {
    filterCounties,
    filterOccupationFirstLevels,
    removeCountry,
    removeMunicipal,
    removeOccupationSecondLevel,
} from "@/app/(sok)/_components/utils/selectedFiltersUtils";
import {
    REMOVE_COUNTY,
    REMOVE_ENGAGEMENT_TYPE,
    REMOVE_EXTENT,
    REMOVE_EDUCATION,
    REMOVE_WORKLANGUAGE,
    REMOVE_OCCUPATION_FIRST_LEVEL,
    REMOVE_REMOTE,
    REMOVE_SECTOR,
    SET_INTERNATIONAL,
    SET_PUBLISHED,
    SET_SEARCH_STRING,
} from "../../_utils/queryReducer";
import { PublishedLabelsEnum } from "../../_utils/query";
import SaveSearchButton from "../../../lagrede-sok/_components/SaveSearchButton";
import { editedItemKey } from "../filters/Engagement";

function SelectedFilters({ query, queryDispatch }) {
    const MAX_CHIPS = 10;
    const [showAll, setShowAll] = useState(false);

    // Opprett chips for alle filter
    const chips = [];

    if (query.q) {
        chips.push(
            <Chips.Removable
                key={`q-${query.q}`}
                variant="neutral"
                onClick={() => queryDispatch({ type: SET_SEARCH_STRING, value: "" })}
            >
                {query.q}
            </Chips.Removable>,
        );
    }

    chips.push(
        ...query.municipals.map((value) => (
            <Chips.Removable
                variant="neutral"
                key={`municipals-${value}`}
                onClick={() => removeMunicipal(queryDispatch, query, value)}
            >
                {fixLocationName(value.split(".")[1])}
            </Chips.Removable>
        )),
    );

    chips.push(
        ...filterCounties(query).map((value) => (
            <Chips.Removable
                variant="neutral"
                key={`counties-${value}`}
                onClick={() => queryDispatch({ type: REMOVE_COUNTY, value })}
            >
                {fixLocationName(value)}
            </Chips.Removable>
        )),
    );

    if (query.international && query.countries.length === 0) {
        chips.push(
            <Chips.Removable
                variant="neutral"
                key="utland-filter"
                onClick={() => {
                    queryDispatch({ type: SET_INTERNATIONAL, value: false });
                }}
            >
                Utland
            </Chips.Removable>,
        );
    }

    chips.push(
        ...query.countries.map((value) => (
            <Chips.Removable
                variant="neutral"
                key={`countries-${value}`}
                onClick={() => removeCountry(queryDispatch, query, value)}
            >
                {fixLocationName(value)}
            </Chips.Removable>
        )),
    );

    chips.push(
        ...query.occupationSecondLevels.map((value) => (
            <Chips.Removable
                variant="neutral"
                key={`occupationSecondLevels-${value}`}
                onClick={() => removeOccupationSecondLevel(queryDispatch, query, value)}
            >
                {value.split(".")[1]}
            </Chips.Removable>
        )),
    );

    chips.push(
        ...filterOccupationFirstLevels(query).map((value) => (
            <Chips.Removable
                variant="neutral"
                key={`occupationFirstLevels-${value}`}
                onClick={() => queryDispatch({ type: REMOVE_OCCUPATION_FIRST_LEVEL, value })}
            >
                {value}
            </Chips.Removable>
        )),
    );

    if (query.published) {
        chips.push(
            <Chips.Removable
                key="published-filter"
                variant="neutral"
                onClick={() => queryDispatch({ type: SET_PUBLISHED, undefined })}
            >
                {PublishedLabelsEnum[query.published]}
            </Chips.Removable>,
        );
    }

    chips.push(
        ...query.sector.map((value) => (
            <Chips.Removable
                variant="neutral"
                key={`sector-${value}`}
                onClick={() => queryDispatch({ type: REMOVE_SECTOR, value })}
            >
                {value === "Ikke oppgitt" ? "Sektor ikke oppgitt" : value}
            </Chips.Removable>
        )),
    );

    chips.push(
        ...query.engagementType.map((value) => (
            <Chips.Removable
                variant="neutral"
                key={`engagementType-${value}`}
                onClick={() => queryDispatch({ type: REMOVE_ENGAGEMENT_TYPE, value })}
            >
                {editedItemKey(value) === "Ikke oppgitt" ? "Ansettelsesform ikke oppgitt" : value}
            </Chips.Removable>
        )),
    );

    chips.push(
        ...query.extent.map((value) => (
            <Chips.Removable
                variant="neutral"
                key={`extent-${value}`}
                onClick={() => queryDispatch({ type: REMOVE_EXTENT, value })}
            >
                {value}
            </Chips.Removable>
        )),
    );

    chips.push(
        ...query.workLanguage.map((value) => (
            <Chips.Removable
                variant="neutral"
                key={`workLanguage-${value}`}
                onClick={() => queryDispatch({ type: REMOVE_WORKLANGUAGE, value })}
            >
                {value === "Ikke oppgitt" ? "Arbeidsspråk ikke oppgitt" : value}
            </Chips.Removable>
        )),
    );

    chips.push(
        ...query.education.map((value) => (
            <Chips.Removable
                variant="neutral"
                key={`education-${value}`}
                onClick={() => queryDispatch({ type: REMOVE_EDUCATION, value })}
            >
                {value === "Ingen" ? "Utdanning ikke krav" : value}
            </Chips.Removable>
        )),
    );

    if (query.remote.length > 0) {
        chips.push(
            ...query.remote.map((value) => (
                <Chips.Removable
                    variant="neutral"
                    key={`remote-filter-${value}`}
                    onClick={() => queryDispatch({ type: REMOVE_REMOTE, value })}
                >
                    {value === "Ikke oppgitt" ? "Hjemmekontor ikke oppgitt" : value}
                </Chips.Removable>
            )),
        );
    }

    if (chips.length === 0) {
        return null;
    }

    return (
        <HStack gap="2" align="center">
            {chips.length > MAX_CHIPS ? (
                <>
                    {showAll ? chips : chips.slice(0, MAX_CHIPS)}
                    {!showAll && (
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => {
                                setShowAll(!showAll);
                            }}
                        >
                            {`Vis ${chips.length - MAX_CHIPS} til`}
                        </Button>
                    )}
                </>
            ) : (
                chips
            )}
            <Button
                type="button"
                variant="tertiary"
                onClick={() => {
                    queryDispatch({ type: "RESET" });
                }}
                icon={<TrashIcon aria-hidden="true" />}
            >
                Fjern alle
            </Button>
            <SaveSearchButton query={query} />
        </HStack>
    );
}

SelectedFilters.propTypes = {
    query: PropTypes.shape({
        q: PropTypes.string,
        municipals: PropTypes.arrayOf(PropTypes.string),
        counties: PropTypes.arrayOf(PropTypes.string),
        countries: PropTypes.arrayOf(PropTypes.string),
        international: PropTypes.bool,
        occupationFirstLevels: PropTypes.arrayOf(PropTypes.string),
        occupationSecondLevels: PropTypes.arrayOf(PropTypes.string),
        published: PropTypes.string,
        sector: PropTypes.arrayOf(PropTypes.string),
        engagementType: PropTypes.arrayOf(PropTypes.string),
        extent: PropTypes.arrayOf(PropTypes.string),
        education: PropTypes.arrayOf(PropTypes.string),
        workLanguage: PropTypes.arrayOf(PropTypes.string),
        remote: PropTypes.arrayOf(PropTypes.string),
    }),
    queryDispatch: PropTypes.func.isRequired,
};

export default SelectedFilters;
