import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Button, Heading, HStack, Label, Modal } from "@navikt/ds-react";
import { ChevronRightIcon, ChevronLeftIcon } from "@navikt/aksel-icons";
import { formatNumber } from "@/app/_common/utils/utils";
import Remote from "@/app/(sok)/_components/filters/Remote";
import Counties from "./Locations";
import Occupations from "./Occupations";
import Published from "./Published";
import Extent from "./Extent";
import Sector from "./Sector";
import EngagementType from "./Engagement";
import WorkLanguage from "./WorkLanguage";

function FilterMenuButton({ children, onClick }) {
    return (
        <button type="button" onClick={onClick} className="filter-menu-button">
            {children} <ChevronRightIcon fontSize="1.5rem" aria-hidden="true" />
        </button>
    );
}

function FiltersMobile({ onCloseClick, searchResult, query, dispatchQuery, aggregations, locations }) {
    const [selectedTab, setSelectedTab] = useState("");
    const headingRef = useRef();

    const changeView = () => {
        if (selectedTab !== "") {
            setSelectedTab("");
            return false;
        }
        return true;
    };

    const setSelectedFilter = (value) => {
        setSelectedTab(value);
    };

    useEffect(() => {
        if (headingRef.current) {
            headingRef.current.focus();
        }
    }, [selectedTab]);

    return (
        <Modal className="filter-modal flex" open onBeforeClose={changeView} onClose={onCloseClick} width="100%">
            <Modal.Header>
                {selectedTab !== "" && (
                    <Label textColor="subtle" size="small" spacing>
                        Filtre
                    </Label>
                )}
                <Heading level="1" size="medium" ref={headingRef} tabIndex={-1} className="no-focus-outline">
                    {selectedTab === "" ? "Filtre" : selectedTab}
                </Heading>
            </Modal.Header>
            <Modal.Body className="filter-modal-body flex-grow">
                {selectedTab === "" && (
                    <nav aria-label="Velg filter" className="mt-1">
                        <FilterMenuButton
                            onClick={() => {
                                setSelectedFilter("Publisert");
                            }}
                        >
                            Publisert
                        </FilterMenuButton>
                        <FilterMenuButton
                            onClick={() => {
                                setSelectedFilter("Sted og hjemmekontor");
                            }}
                        >
                            Sted og hjemmekontor
                        </FilterMenuButton>
                        <FilterMenuButton
                            onClick={() => {
                                setSelectedFilter("Yrke og sektor");
                            }}
                        >
                            Yrke og sektor
                        </FilterMenuButton>
                        <FilterMenuButton
                            onClick={() => {
                                setSelectedFilter("Arbeidsspråk");
                            }}
                        >
                            Arbeidsspråk
                        </FilterMenuButton>
                        <FilterMenuButton
                            onClick={() => {
                                setSelectedFilter("Omfang og ansettelsesform");
                            }}
                        >
                            Omfang og ansettelsesform
                        </FilterMenuButton>
                    </nav>
                )}
                <div className="mt-4">
                    {selectedTab === "Publisert" && (
                        <Published
                            query={query}
                            dispatch={dispatchQuery}
                            initialValues={aggregations.published}
                            updatedValues={searchResult && searchResult.aggregations.published}
                        />
                    )}
                    {selectedTab === "Sted og hjemmekontor" && (
                        <>
                            <div className="mb-6">
                                <Counties
                                    query={query}
                                    dispatch={dispatchQuery}
                                    locations={locations}
                                    updatedValues={searchResult}
                                />
                            </div>
                            <Remote
                                query={query}
                                dispatch={dispatchQuery}
                                initialValues={aggregations.remote}
                                updatedValues={searchResult.aggregations.remote}
                            />
                        </>
                    )}

                    {selectedTab === "Yrke og sektor" && (
                        <>
                            <div className="mb-6">
                                <Occupations
                                    query={query}
                                    dispatch={dispatchQuery}
                                    initialValues={aggregations.occupationFirstLevels}
                                    updatedValues={searchResult && searchResult.aggregations.occupationFirstLevels}
                                />
                            </div>
                            <Sector
                                query={query}
                                dispatch={dispatchQuery}
                                initialValues={aggregations.sector}
                                updatedValues={searchResult.aggregations.sector}
                            />
                        </>
                    )}

                    {selectedTab === "Arbeidsspråk" && (
                        <WorkLanguage
                            hideLegend
                            query={query}
                            dispatch={dispatchQuery}
                            initialValues={aggregations.workLanguage}
                            updatedValues={searchResult && searchResult.aggregations.workLanguage}
                        />
                    )}

                    {selectedTab === "Omfang og ansettelsesform" && (
                        <>
                            <div className="mb-6">
                                <Extent
                                    query={query}
                                    dispatch={dispatchQuery}
                                    initialValues={aggregations.extent}
                                    updatedValues={searchResult && searchResult.aggregations.extent}
                                />
                            </div>
                            <EngagementType
                                query={query}
                                dispatch={dispatchQuery}
                                initialValues={aggregations.engagementTypes}
                                updatedValues={searchResult && searchResult.aggregations.engagementTypes}
                            />

                            {/* TODO: COMMENT IN WHEN FILTER IS READY BACKEND
                            <Education
                                query={query}
                                dispatch={dispatchQuery}
                                initialValues={aggregations.education}
                                updatedValues={searchResult && searchResult.aggregations.education}
                            />
                       */}
                        </>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <HStack wrap justify="space-between" gap="1" className="full-width">
                    {selectedTab !== "" && (
                        <Button icon={<ChevronLeftIcon aria-hidden />} variant="tertiary" onClick={changeView}>
                            Tilbake
                        </Button>
                    )}
                    <Button variant="primary" onClick={onCloseClick} className="flex-1">
                        {searchResult && searchResult.totalAds
                            ? `Vis ${formatNumber(searchResult.totalAds)} treff`
                            : "Vis treff"}
                    </Button>
                </HStack>
            </Modal.Footer>
        </Modal>
    );
}

FiltersMobile.propTypes = {
    onCloseClick: PropTypes.func.isRequired,
    query: PropTypes.shape({}),
    dispatchQuery: PropTypes.func,
    aggregations: PropTypes.shape({
        engagementTypes: PropTypes.arrayOf(PropTypes.shape({})),
        occupationFirstLevels: PropTypes.arrayOf(PropTypes.shape({})),
        published: PropTypes.arrayOf(PropTypes.shape({})),
        extent: PropTypes.arrayOf(PropTypes.shape({})),
        sector: PropTypes.arrayOf(PropTypes.shape({})),
        workLanguage: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    locations: PropTypes.arrayOf(PropTypes.shape({})),
    searchResult: PropTypes.shape({
        totalAds: PropTypes.string,
        aggregations: PropTypes.shape({
            engagementTypes: PropTypes.arrayOf(PropTypes.shape({})),
            occupationFirstLevels: PropTypes.arrayOf(PropTypes.shape({})),
            published: PropTypes.arrayOf(PropTypes.shape({})),
            extent: PropTypes.arrayOf(PropTypes.shape({})),
            sector: PropTypes.arrayOf(PropTypes.shape({})),
            workLanguage: PropTypes.arrayOf(PropTypes.shape({})),
        }),
    }),
};

export default FiltersMobile;
