import React from "react";
import PropTypes from "prop-types";
import { Accordion } from "@navikt/ds-react";
import FilterAccordionItem from "./FilterAccordionItem";
import Published from "./Published";
import Counties from "./Locations";
import Occupations from "./Occupations";
import Extent from "./Extent";
import Sector from "./Sector";
import EngagementType from "./Engagement";

function FiltersDesktop({ query, dispatchQuery, initialSearchResult, searchResult }) {
    function submitForm(e) {
        e.preventDefault();
    }

    return (
        <form aria-label="Filtre" onSubmit={submitForm}>
            <Accordion indent={false} headingSize="small">
                <FilterAccordionItem title="Publisert" panelId="publisert">
                    <Published
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={initialSearchResult.aggregations.published}
                        updatedValues={searchResult && searchResult.aggregations.published}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Sted" panelId="sted">
                    <Counties
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={initialSearchResult}
                        updatedValues={searchResult}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Yrke" panelId="yrke">
                    <Occupations
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={initialSearchResult.aggregations.occupationFirstLevels}
                        updatedValues={searchResult && searchResult.aggregations.occupationFirstLevels}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Heltid/deltid" panelId="extent">
                    <Extent
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={initialSearchResult.aggregations.extent}
                        updatedValues={searchResult && searchResult.aggregations.extent}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Sektor" panelId="sector">
                    <Sector
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={initialSearchResult.aggregations.sector}
                        updatedValues={searchResult && searchResult.aggregations.sector}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Ansettelsesform" panelId="engagementType">
                    <EngagementType
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={initialSearchResult.aggregations.engagementTypes}
                        updatedValues={searchResult && searchResult.aggregations.engagementTypes}
                    />
                </FilterAccordionItem>
            </Accordion>
        </form>
    );
}

FiltersDesktop.propTypes = {
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

export default FiltersDesktop;
