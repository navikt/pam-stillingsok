import React, { useState } from "react";
import { Button, Chips, Heading } from "@navikt/ds-react";
import { PublishedLabelsEnum } from "../searchForm/filters/Published";
import fixLocationName from "../../../../../server/common/fixLocationName";
import "./SelectedFilters.css";
import {
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
    SET_PUBLISHED
} from "../../query";

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
            secondLevel.startsWith(`${firstLevel}.`)
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

    chips.push(
        ...query.municipals.map((value) => (
            <Chips.Removable variant="neutral" key={value} onClick={() => removeMunicipal(value)}>
                {fixLocationName(value.split(".")[1])}
            </Chips.Removable>
        ))
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
        ))
    );

    chips.push(
        ...(query.international && query.countries.length === 0 && (
            <Chips.Removable
                variant="neutral"
                onClick={() => {
                    queryDispatch({ type: SET_INTERNATIONAL, value: false });
                }}
            >
                Utland
            </Chips.Removable>
        ))
    );

    chips.push(
        ...query.countries.map((value) => (
            <Chips.Removable variant="neutral" key={value} onClick={() => removeCountry(value)}>
                {fixLocationName(value)}
            </Chips.Removable>
        ))
    );

    chips.push(
        ...query.occupationSecondLevels.map((value) => (
            <Chips.Removable variant="neutral" key={value} onClick={() => removeOccupation(value)}>
                {value.split(".")[1]}
            </Chips.Removable>
        ))
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
        ))
    );

    if (query.published) {
        chips.push(
            <Chips.Removable variant="neutral" onClick={() => queryDispatch({ type: SET_PUBLISHED, undefined })}>
                {PublishedLabelsEnum[query.published]}
            </Chips.Removable>
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
        ))
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
        ))
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
        ))
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
            </Chips.Removable>
        );
    }

    if (chips.length === 0) {
        return null;
    }

    return (
        <div className="SelectedFilters">
            <Heading size="small" level="2" spacing>
                Valgte filter ({chips.length})
            </Heading>

            <div className="SelectedFilters__chips">
                {chips.length > MAX_CHIPS ? (
                    <React.Fragment>
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
                    </React.Fragment>
                ) : (
                    <React.Fragment>{chips}</React.Fragment>
                )}
            </div>
        </div>
    );
}

export default SelectedFilters;