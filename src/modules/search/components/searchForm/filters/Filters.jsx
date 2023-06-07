import React from "react";
import PropTypes from "prop-types";
import Published from "./Published";
import CriteriaPanel from "./CriteriaPanel";
import Counties from "./Locations";
import Occupations from "./Occupations";
import Extent from "./Extent";
import Sector from "./Sector";
import EngagementType from "./Engagement";

function Filters({ query, dispatchQuery, initialSearchResult, searchResult }) {
    return (
        <div className="Filters">
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
    searchResult: PropTypes.shape({}),
};

export default Filters;
