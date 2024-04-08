import React from "react";
import PropTypes from "prop-types";
import { Accordion, Button } from "@navikt/ds-react";
import FilterAccordionItem from "./FilterAccordionItem";
import Published from "./Published";
import Counties from "./Locations";
import Occupations from "./Occupations";
import Extent from "./Extent";
import Sector from "./Sector";
import EngagementType from "./Engagement";
import WorkLanguage from "./WorkLanguage";
import ShareYourOpinionPanel from "@/app/tilbakemelding-nye-filtre/_components/ShareYourOpinionPanel";

function FiltersDesktop({ query, dispatchQuery, aggregations, locations, searchResult }) {
    return (
        <div>
            <ShareYourOpinionPanel />
            <Accordion indent={false} headingSize="small">
                <FilterAccordionItem title="Publisert" panelId="publisert">
                    <Published
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={aggregations.published}
                        updatedValues={searchResult.aggregations.published}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Sted" panelId="sted">
                    <Counties
                        query={query}
                        dispatch={dispatchQuery}
                        locations={locations}
                        updatedValues={searchResult}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Yrke" panelId="yrke">
                    <Occupations
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={aggregations.occupationFirstLevels}
                        updatedValues={searchResult.aggregations.occupationFirstLevels}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Heltid/deltid" panelId="extent">
                    <Extent
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={aggregations.extent}
                        updatedValues={searchResult.aggregations.extent}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Sektor" panelId="sector">
                    <Sector
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={aggregations.sector}
                        updatedValues={searchResult.aggregations.sector}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Ansettelsesform" panelId="engagementType">
                    <EngagementType
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={aggregations.engagementTypes}
                        updatedValues={searchResult.aggregations.engagementTypes}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Arbeidsspråk" panelId="workLanguage">
                    <WorkLanguage
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={aggregations.workLanguage}
                        updatedValues={searchResult.aggregations.workLanguage}
                    />
                </FilterAccordionItem>
            </Accordion>
            <noscript>
                <Button type="submit">Søk</Button>
            </noscript>
        </div>
    );
}

FiltersDesktop.propTypes = {
    query: PropTypes.shape({}),
    dispatchQuery: PropTypes.func,
    locations: PropTypes.arrayOf(PropTypes.shape({})),
    aggregations: PropTypes.shape({
        engagementTypes: PropTypes.arrayOf(PropTypes.shape({})),
        occupationFirstLevels: PropTypes.arrayOf(PropTypes.shape({})),
        published: PropTypes.arrayOf(PropTypes.shape({})),
        extent: PropTypes.arrayOf(PropTypes.shape({})),
        sector: PropTypes.arrayOf(PropTypes.shape({})),
        workLanguage: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    searchResult: PropTypes.shape({
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

export default FiltersDesktop;
