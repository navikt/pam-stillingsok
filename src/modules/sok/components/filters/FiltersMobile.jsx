import React from "react";
import PropTypes from "prop-types";
import { Button, Heading, Modal, Tabs } from "@navikt/ds-react";
import { formatNumber } from "../../../common/utils/utils";
import Counties from "./Locations";
import Occupations from "./Occupations";
import Published from "./Published";
import Extent from "./Extent";
import Sector from "./Sector";
import EngagementType from "./Engagement";

function FiltersMobile({ onCloseClick, searchResult, query, dispatchQuery, initialSearchResult }) {
    function submitForm(e) {
        e.preventDefault();
    }

    return (
        <form onSubmit={submitForm}>
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
                                initialValues={initialSearchResult}
                                updatedValues={searchResult}
                            />
                        </Tabs.Panel>
                        <Tabs.Panel value="yrke" className="mt-8">
                            <Occupations
                                query={query}
                                dispatch={dispatchQuery}
                                initialValues={initialSearchResult.aggregations.occupationFirstLevels}
                                updatedValues={searchResult && searchResult.aggregations.occupationFirstLevels}
                            />
                        </Tabs.Panel>
                        <Tabs.Panel value="andre" className="mt-8">
                            <div className="mb-6">
                                <Published
                                    query={query}
                                    dispatch={dispatchQuery}
                                    initialValues={initialSearchResult.aggregations.published}
                                    updatedValues={searchResult && searchResult.aggregations.published}
                                />
                            </div>
                            <div className="mb-6">
                                <Heading level="2" size="small">
                                    Heltid/deltid
                                </Heading>
                                <Extent
                                    query={query}
                                    dispatch={dispatchQuery}
                                    initialValues={initialSearchResult.aggregations.extent}
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
                                    initialValues={initialSearchResult.aggregations.sector}
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
                                    initialValues={initialSearchResult.aggregations.engagementTypes}
                                    updatedValues={searchResult && searchResult.aggregations.engagementTypes}
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
        </form>
    );
}

FiltersMobile.propTypes = {
    onCloseClick: PropTypes.func.isRequired,
    query: PropTypes.shape({}),
    dispatchQuery: PropTypes.func,
    initialSearchResult: PropTypes.shape({
        aggregations: PropTypes.shape({
            engagementTypes: PropTypes.arrayOf(PropTypes.shape({})),
            occupationFirstLevels: PropTypes.arrayOf(PropTypes.shape({})),
            published: PropTypes.arrayOf(PropTypes.shape({})),
            extent: PropTypes.arrayOf(PropTypes.shape({})),
            sector: PropTypes.arrayOf(PropTypes.shape({})),
        }),
    }),
    searchResult: PropTypes.shape({
        totalAds: PropTypes.string,
        aggregations: PropTypes.shape({
            engagementTypes: PropTypes.arrayOf(PropTypes.shape({})),
            occupationFirstLevels: PropTypes.arrayOf(PropTypes.shape({})),
            published: PropTypes.arrayOf(PropTypes.shape({})),
            extent: PropTypes.arrayOf(PropTypes.shape({})),
            sector: PropTypes.arrayOf(PropTypes.shape({})),
        }),
    }),
};

export default FiltersMobile;
