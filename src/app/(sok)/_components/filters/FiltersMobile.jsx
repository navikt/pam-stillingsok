import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Heading, Modal } from "@navikt/ds-react";
import { ChevronRightIcon } from "@navikt/aksel-icons";
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
    const [modalHeading, setModalHeading] = useState({ heading: "Filtre" });

    const changeView = () => {
        if (selectedTab !== "") {
            setSelectedTab("");
            setModalHeading({ heading: "Filtre" });
            return false;
        }
        return true;
    };

    const setSelectedFilter = (value) => {
        setSelectedTab(value);
        setModalHeading({
            label: "Filtre",
            heading: value,
        });
    };

    return (
        <Modal
            className="filter-modal"
            header={modalHeading}
            open
            onBeforeClose={changeView}
            onClose={onCloseClick}
            width="100%"
        >
            <Modal.Body>
                {selectedTab === "" && (
                    <nav aria-label="Velg filter">
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
                        <div className="mb-6">
                            <Heading level="2" size="small">
                                Hjemmekontor
                            </Heading>
                            <Remote
                                query={query}
                                dispatch={dispatchQuery}
                                initialValues={aggregations.remote}
                                updatedValues={searchResult.aggregations.remote}
                            />
                        </div>
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
                    <>
                        <Heading level="2" size="small">
                            Arbeidsspråk
                        </Heading>
                        <WorkLanguage
                            query={query}
                            dispatch={dispatchQuery}
                            initialValues={aggregations.workLanguage}
                            updatedValues={searchResult && searchResult.aggregations.workLanguage}
                        />
                    </>
                )}

                {selectedTab === "Omfang og ansettelsesform" && (
                    <div>
                        <Heading level="2" size="small">
                            Heltid/deltid
                        </Heading>
                        <Extent
                            query={query}
                            dispatch={dispatchQuery}
                            initialValues={aggregations.extent}
                            updatedValues={searchResult && searchResult.aggregations.extent}
                        />
                        <div className="mb-6">
                            <Heading level="2" size="small">
                                Sektor
                            </Heading>
                            <Sector
                                query={query}
                                dispatch={dispatchQuery}
                                initialValues={aggregations.sector}
                                updatedValues={searchResult && searchResult.aggregations.sector}
                            />
                        </div>
                        <div className="mb-6">
                            <Heading level="2" size="small">
                                Ansettelsesform
                            </Heading>
                            <EngagementType
                                query={query}
                                dispatch={dispatchQuery}
                                initialValues={aggregations.engagementTypes}
                                updatedValues={searchResult && searchResult.aggregations.engagementTypes}
                            />
                        </div>

                        {/* TODO: COMMENT IN WHEN FILTER IS READY BACKEND
                        <div className="mb-6">
                            <Heading level="2" size="small">
                                Utdanning
                            </Heading>
                            <Education
                                query={query}
                                dispatch={dispatchQuery}
                                initialValues={aggregations.education}
                                updatedValues={searchResult && searchResult.aggregations.education}
                            />
                        </div> */}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onCloseClick}>
                    {searchResult && searchResult.totalAds
                        ? `Vis ${formatNumber(searchResult.totalAds)} treff`
                        : "Vis treff"}
                </Button>
                {selectedTab !== "" && <Button onClick={changeView}>Tilbake</Button>}
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
