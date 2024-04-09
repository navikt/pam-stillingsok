import React from "react";
import PropTypes from "prop-types";
import { Button, Heading, Modal, Tabs } from "@navikt/ds-react";
import { formatNumber } from "@/app/_common/utils/utils";
import Counties from "./Locations";
import Occupations from "./Occupations";
import Published from "./Published";
import Extent from "./Extent";
import Sector from "./Sector";
import EngagementType from "./Engagement";
import WorkLanguage from "./WorkLanguage";
import ShareYourOpinionPanel from "@/app/tilbakemelding-nye-filtre/_components/ShareYourOpinionPanel";
import Remote from "@/app/(sok)/_components/filters/Remote";

function FiltersMobile({ onCloseClick, searchResult, query, dispatchQuery, aggregations, locations }) {
    return (
        <Modal className="filter-modal" header={{ heading: "Filtre" }} open onClose={onCloseClick} width="100%">
            <Modal.Body>
                <Tabs defaultValue="sted">
                    <Tabs.List>
                        <Tabs.Tab value="sted" label="Sted" />
                        <Tabs.Tab value="yrke" label="Yrke" />
                        <Tabs.Tab value="andre" label="Andre filtre" />
                    </Tabs.List>
                    <Tabs.Panel value="sted" className="mt-8">
                        <Counties
                            query={query}
                            dispatch={dispatchQuery}
                            locations={locations}
                            updatedValues={searchResult}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value="yrke" className="mt-8">
                        <Occupations
                            query={query}
                            dispatch={dispatchQuery}
                            initialValues={aggregations.occupationFirstLevels}
                            updatedValues={searchResult && searchResult.aggregations.occupationFirstLevels}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value="andre" className="mt-8">
                        <ShareYourOpinionPanel />
                        <div className="mb-6">
                            <Published
                                query={query}
                                dispatch={dispatchQuery}
                                initialValues={aggregations.published}
                                updatedValues={searchResult && searchResult.aggregations.published}
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
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onCloseClick}>
                    {searchResult && searchResult.totalAds
                        ? `Vis ${formatNumber(searchResult.totalAds)} treff`
                        : "Vis treff"}
                </Button>
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
