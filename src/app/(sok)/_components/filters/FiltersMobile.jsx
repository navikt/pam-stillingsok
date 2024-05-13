import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Heading, Modal, Tabs } from "@navikt/ds-react";
import { formatNumber } from "@/app/_common/utils/utils";
import Remote from "@/app/(sok)/_components/filters/Remote";
import Counties from "./Locations";
import Occupations from "./Occupations";
import Published from "./Published";
import Extent from "./Extent";
import Sector from "./Sector";
import EngagementType from "./Engagement";
import WorkLanguage from "./WorkLanguage";

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
                <Tabs defaultValue={selectedTab} value={selectedTab} onChange={setSelectedFilter}>
                    <Tabs.List className={`flex-direction-column ${selectedTab !== "" ? "hidden" : ""}`}>
                        <Tabs.Tab value="Publisert" label="Publisert" />
                        <Tabs.Tab value="Sted og hjemmekontor" label="Sted og hjemmekontor" />
                        <Tabs.Tab value="Yrke og sektor" label="Yrke og sektor" />
                        <Tabs.Tab value="Arbeidsspråk" label="Arbeidsspråk" />
                        <Tabs.Tab value="Omfang og ansettelsesform" label="Omfang og ansettelsesform" />
                    </Tabs.List>

                    {selectedTab === "Publisert" && (
                        <Tabs.Panel value="Publisert" className="mt-8">
                            <div className="mb-6">
                                <Published
                                    query={query}
                                    dispatch={dispatchQuery}
                                    initialValues={aggregations.published}
                                    updatedValues={searchResult && searchResult.aggregations.published}
                                />
                            </div>
                        </Tabs.Panel>
                    )}
                    {selectedTab === "Sted og hjemmekontor" && (
                        <Tabs.Panel value="Sted og hjemmekontor" className="mt-8">
                            <Counties
                                query={query}
                                dispatch={dispatchQuery}
                                locations={locations}
                                updatedValues={searchResult}
                            />
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
                        </Tabs.Panel>
                    )}

                    {selectedTab === "Yrke og sektor" && (
                        <Tabs.Panel value="Yrke og sektor" className="mt-8">
                            <Occupations
                                query={query}
                                dispatch={dispatchQuery}
                                initialValues={aggregations.occupationFirstLevels}
                                updatedValues={searchResult && searchResult.aggregations.occupationFirstLevels}
                            />
                        </Tabs.Panel>
                    )}

                    {selectedTab === "Arbeidsspråk" && (
                        <Tabs.Panel value="Arbeidsspråk">
                            <div className="mb-6">
                                <Heading level="2" size="small">
                                    Arbeidsspråk
                                </Heading>
                                <WorkLanguage
                                    query={query}
                                    dispatch={dispatchQuery}
                                    initialValues={aggregations.workLanguage}
                                    updatedValues={searchResult && searchResult.aggregations.workLanguage}
                                />
                            </div>
                        </Tabs.Panel>
                    )}

                    {selectedTab === "Omfang og ansettelsesform" && (
                        <Tabs.Panel value="Omfang og ansettelsesform" className="mt-8">
                            <div className="mb-6">
                                <Heading level="2" size="small">
                                    Heltid/deltid
                                </Heading>
                                <Extent
                                    query={query}
                                    dispatch={dispatchQuery}
                                    initialValues={aggregations.extent}
                                    updatedValues={searchResult && searchResult.aggregations.extent}
                                />
                            </div>
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
                        </Tabs.Panel>
                    )}
                </Tabs>
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
