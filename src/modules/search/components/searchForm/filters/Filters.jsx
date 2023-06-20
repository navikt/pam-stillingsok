import React from "react";
import PropTypes from "prop-types";
import { Tabs, Heading } from "@navikt/ds-react";
import Published from "./Published";
import CriteriaPanel from "./CriteriaPanel";
import Counties from "./Locations";
import Occupations from "./Occupations";
import Extent from "./Extent";
import Sector from "./Sector";
import EngagementType from "./Engagement";

function Filters({ query, dispatchQuery, initialSearchResult, searchResult }) {
    return (
        <>
            <div className="Filters Filters__desktop">
                <div className="Filter__section">
                    <Published
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={initialSearchResult.aggregations.published}
                        updatedValues={searchResult && searchResult.aggregations.published}
                    />
                </div>
                <CriteriaPanel title="Sted" panelId="sted">
                    <Counties
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={initialSearchResult}
                        updatedValues={searchResult}
                    />
                </CriteriaPanel>
                <CriteriaPanel title="Yrke" panelId="yrke">
                    <Occupations
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={initialSearchResult.aggregations.occupationFirstLevels}
                        updatedValues={searchResult && searchResult.aggregations.occupationFirstLevels}
                    />
                </CriteriaPanel>
                <CriteriaPanel title="Heltid/deltid" panelId="extent">
                    <Extent
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={initialSearchResult.aggregations.extent}
                        updatedValues={searchResult && searchResult.aggregations.extent}
                    />
                </CriteriaPanel>
                <CriteriaPanel title="Sektor" panelId="sector">
                    <Sector
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={initialSearchResult.aggregations.sector}
                        updatedValues={searchResult && searchResult.aggregations.sector}
                    />
                </CriteriaPanel>
                <CriteriaPanel title="Ansettelsesform" panelId="engagementType">
                    <EngagementType
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={initialSearchResult.aggregations.engagementTypes}
                        updatedValues={searchResult && searchResult.aggregations.engagementTypes}
                    />
                </CriteriaPanel>
            </div>
            <div className="Filters Filters__mobile">
                <Tabs defaultValue="sted">
                    <Tabs.List>
                        <Tabs.Tab value="sted" label="Sted" />
                        <Tabs.Tab value="yrke" label="Yrke" />
                        <Tabs.Tab value="andre" label="Andre filtre" />
                    </Tabs.List>
                    <Tabs.Panel value="sted" className="mt-2 h-24 w-full bg-gray-50 p-4">
                        <Counties
                            query={query}
                            dispatch={dispatchQuery}
                            initialValues={initialSearchResult}
                            updatedValues={searchResult}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value="yrke" className="mt-2 h-24 w-full bg-gray-50 p-4">
                        <Occupations
                            query={query}
                            dispatch={dispatchQuery}
                            initialValues={initialSearchResult.aggregations.occupationFirstLevels}
                            updatedValues={searchResult && searchResult.aggregations.occupationFirstLevels}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value="andre" className="mt-2 h-24  w-full bg-gray-50 p-4">
                        <div className="mb-1_5">
                            <Published
                                query={query}
                                dispatch={dispatchQuery}
                                initialValues={initialSearchResult.aggregations.published}
                                updatedValues={searchResult && searchResult.aggregations.published}
                            />
                        </div>
                        <div className="mb-1_5">
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
                        <div className="mb-1_5">
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
                        <div className="mb-1_5">
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
            </div>
        </>
    );
}

Filters.propTypes = {
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
        aggregations: PropTypes.shape({
            engagementTypes: PropTypes.arrayOf(PropTypes.shape({})),
            occupationFirstLevels: PropTypes.arrayOf(PropTypes.shape({})),
            published: PropTypes.arrayOf(PropTypes.shape({})),
            extent: PropTypes.arrayOf(PropTypes.shape({})),
            sector: PropTypes.arrayOf(PropTypes.shape({})),
        }),
    }),
};

export default Filters;
