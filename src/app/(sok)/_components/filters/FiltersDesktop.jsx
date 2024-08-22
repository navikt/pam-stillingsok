import React from "react";
import PropTypes from "prop-types";
import { Accordion, Alert, Button } from "@navikt/ds-react";
import Remote from "@/app/(sok)/_components/filters/Remote";
import Education from "@/app/(sok)/_components/filters/Education";
import DriversLicense from "@/app/(sok)/_components/filters/DriversLicense";
import DrivingDistance from "@/app/(sok)/_components/filters/DrivingDistance";
import Experience from "@/app/(sok)/_components/filters/Experience";
import NewFiltersMessage from "@/app/(sok)/_components/filters/NewFiltersMessage";
import FilterAccordionItem from "./FilterAccordionItem";
import Published from "./Published";
import Counties from "./Locations";
import Occupations from "./Occupations";
import Extent from "./Extent";
import Sector from "./Sector";
import EngagementType from "./Engagement";
import WorkLanguage from "./WorkLanguage";

function FiltersDesktop({ query, dispatchQuery, aggregations, locations, postcodes, searchResult }) {
    return (
        <div>
            <Accordion indent={false} headingSize="small">
                <FilterAccordionItem title="Publisert" panelId="publisert">
                    <Published
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={aggregations.published}
                        updatedValues={searchResult.aggregations.published}
                        publishedTotalCount={searchResult.aggregations.publishedTotalCount}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Område og hjemmekontor" panelId="sted">
                    <DrivingDistance query={query} dispatch={dispatchQuery} postcodes={postcodes} />
                    <Counties
                        query={query}
                        dispatch={dispatchQuery}
                        locations={locations}
                        updatedValues={searchResult}
                    />
                    <Remote
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={aggregations.remote}
                        updatedValues={searchResult.aggregations.remote}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Yrke og sektor" panelId="yrke">
                    <Occupations
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={aggregations.occupationFirstLevels}
                        updatedValues={searchResult.aggregations.occupationFirstLevels}
                    />
                    <Sector
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={aggregations.sector}
                        updatedValues={searchResult.aggregations.sector}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Utdanning, erfaring og førerkort" panelId="education">
                    <Alert variant="info" className="mb-6">
                        <NewFiltersMessage />
                    </Alert>
                    <Education
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={aggregations.education}
                        updatedValues={searchResult.aggregations.education}
                    />
                    <Experience
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={aggregations.experience}
                        updatedValues={searchResult.aggregations.experience}
                    />
                    <DriversLicense
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={aggregations.needDriversLicense}
                        updatedValues={searchResult.aggregations.needDriversLicense}
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
                <FilterAccordionItem title="Omfang og ansettelsesform" panelId="extent">
                    <Extent
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={aggregations.extent}
                        updatedValues={searchResult.aggregations.extent}
                    />
                    <EngagementType
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={aggregations.engagementTypes}
                        updatedValues={searchResult.aggregations.engagementTypes}
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
        needDriversLicense: PropTypes.arrayOf(PropTypes.shape({})),
        engagementTypes: PropTypes.arrayOf(PropTypes.shape({})),
        occupationFirstLevels: PropTypes.arrayOf(PropTypes.shape({})),
        published: PropTypes.arrayOf(PropTypes.shape({})),
        extent: PropTypes.arrayOf(PropTypes.shape({})),
        sector: PropTypes.arrayOf(PropTypes.shape({})),
        workLanguage: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    searchResult: PropTypes.shape({
        aggregations: PropTypes.shape({
            needDriversLicense: PropTypes.arrayOf(PropTypes.shape({})),
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
