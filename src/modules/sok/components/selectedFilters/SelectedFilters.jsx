import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Chips, HStack } from "@navikt/ds-react";
import { TrashIcon } from "@navikt/aksel-icons";
import fixLocationName from "../../../../../server/common/fixLocationName";
import {
    PublishedLabelsEnum,
    REMOVE_COUNTRY,
    REMOVE_COUNTY,
    REMOVE_ENGAGEMENT_TYPE,
    REMOVE_EXTENT,
    REMOVE_MUNICIPAL,
    REMOVE_OCCUPATION_FIRST_LEVEL,
    REMOVE_OCCUPATION_SECOND_LEVEL,
    REMOVE_REMOTE,
    REMOVE_SECTOR,
    SET_INTERNATIONAL,
    SET_PUBLISHED,
    SET_SEARCH_STRING,
} from "../../query";
import SaveSearchButton from "../../../lagrede-sok/components/SaveSearchButton";

function SelectedFilters({ query, queryDispatch }) {
    const MAX_CHIPS = 10;
    const [showAll, setShowAll] = useState(false);

    const removeMunicipal = (value) => {
        // Fjern kommunen fra filter
        queryDispatch({ type: REMOVE_MUNICIPAL, value });

        // Hvis dette var den siste valgte kommune i samme fylke, så skal fylket også fjernes
        const county = value.split(".")[0];
        const remainingMunicipalsInCounty = query.municipals.filter((municipal) => municipal.startsWith(`${county}.`));
        if (remainingMunicipalsInCounty.length === 1) {
            queryDispatch({ type: REMOVE_COUNTY, value: county });
        }
    };

    const removeCountry = (value) => {
        // Fjern land fra filter
        queryDispatch({ type: REMOVE_COUNTRY, value });

        // Hvis dette var den siste landet, så skal "Utland" også fjernes
        if (query.countries.length === 1) {
            queryDispatch({ type: SET_INTERNATIONAL, value: false });
        }
    };

    const removeOccupation = (value) => {
        // Fjern yrket fra filter
        queryDispatch({ type: REMOVE_OCCUPATION_SECOND_LEVEL, value });

        // Hvis dette var det siste yrket i samme yrkeskategori, så skal yrkeskategorien også fjernes
        const firstLevel = value.split(".")[0];
        const remainingOccupationsInCategory = query.occupationSecondLevels.filter((secondLevel) =>
            secondLevel.startsWith(`${firstLevel}.`),
        );
        if (remainingOccupationsInCategory.length === 1) {
            queryDispatch({ type: REMOVE_OCCUPATION_FIRST_LEVEL, value: firstLevel });
        }
    };

    // Ikke vis fylke hvis bruker har valgt en eller flere kommuner i dette fylket
    const counties = query.counties.filter((county) => {
        const found = query.municipals.find((obj) => obj.startsWith(`${county}.`));
        return !found;
    });

    // Ikke vis yrkeskategori hvis bruker har valgt et eller flere yrker i denne kategorien
    const occupationFirstLevels = query.occupationFirstLevels.filter((firstLevel) => {
        const found = query.occupationSecondLevels.find((obj) => obj.startsWith(`${firstLevel}.`));
        return !found;
    });

    // Opprett chips for alle filter
    const chips = [];

    if (query.q) {
        chips.push(
            <Chips.Removable variant="neutral" onClick={() => queryDispatch({ type: SET_SEARCH_STRING, value: "" })}>
                {query.q}
            </Chips.Removable>,
        );
    }

    chips.push(
        ...query.municipals.map((value) => (
            <Chips.Removable variant="neutral" key={value} onClick={() => removeMunicipal(value)}>
                {fixLocationName(value.split(".")[1])}
            </Chips.Removable>
        )),
    );

    chips.push(
        ...counties.map((value) => (
            <Chips.Removable
                variant="neutral"
                key={value}
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
            <Chips.Removable variant="neutral" key={value} onClick={() => removeCountry(value)}>
                {fixLocationName(value)}
            </Chips.Removable>
        )),
    );

    chips.push(
        ...query.occupationSecondLevels.map((value) => (
            <Chips.Removable variant="neutral" key={value} onClick={() => removeOccupation(value)}>
                {value.split(".")[1]}
            </Chips.Removable>
        )),
    );

    chips.push(
        ...occupationFirstLevels.map((value) => (
            <Chips.Removable
                variant="neutral"
                key={value}
                onClick={() => queryDispatch({ type: REMOVE_OCCUPATION_FIRST_LEVEL, value })}
            >
                {value}
            </Chips.Removable>
        )),
    );

    if (query.published) {
        chips.push(
            <Chips.Removable variant="neutral" onClick={() => queryDispatch({ type: SET_PUBLISHED, undefined })}>
                {PublishedLabelsEnum[query.published]}
            </Chips.Removable>,
        );
    }

    chips.push(
        ...query.sector.map((value) => (
            <Chips.Removable
                variant="neutral"
                key={value}
                onClick={() => queryDispatch({ type: REMOVE_SECTOR, value })}
            >
                {value}
            </Chips.Removable>
        )),
    );

    chips.push(
        ...query.engagementType.map((value) => (
            <Chips.Removable
                variant="neutral"
                key={value}
                onClick={() => queryDispatch({ type: REMOVE_ENGAGEMENT_TYPE, value })}
            >
                {value}
            </Chips.Removable>
        )),
    );

    chips.push(
        ...query.extent.map((value) => (
            <Chips.Removable
                variant="neutral"
                key={value}
                onClick={() => queryDispatch({ type: REMOVE_EXTENT, value })}
            >
                {value}
            </Chips.Removable>
        )),
    );

    if (query.remote.length > 0) {
        chips.push(
            <Chips.Removable
                variant="neutral"
                onClick={() => {
                    queryDispatch({ type: REMOVE_REMOTE, value: "Hjemmekontor" });
                    queryDispatch({ type: REMOVE_REMOTE, value: "Hybridkontor" });
                }}
            >
                Hjemmekontor
            </Chips.Removable>,
        );
    }

    if (chips.length === 0) {
        return null;
    }

    return (
        <div className="mb-8">
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
        </div>
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
        published: PropTypes.arrayOf(PropTypes.string),
        sector: PropTypes.arrayOf(PropTypes.string),
        engagementType: PropTypes.arrayOf(PropTypes.string),
        extent: PropTypes.arrayOf(PropTypes.string),
        remote: PropTypes.arrayOf(PropTypes.string),
    }),
    queryDispatch: PropTypes.func.isRequired,
};

export default SelectedFilters;
