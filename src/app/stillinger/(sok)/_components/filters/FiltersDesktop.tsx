import React from "react";
import { Accordion } from "@navikt/ds-react";
import Remote from "@/app/stillinger/(sok)/_components/filters/Remote";
import Education from "@/app/stillinger/(sok)/_components/filters/Education";
import DriversLicense from "@/app/stillinger/(sok)/_components/filters/DriversLicense";
import Experience from "@/app/stillinger/(sok)/_components/filters/Experience";
import DistanceOrLocation from "@/app/stillinger/(sok)/_components/filters/DistanceOrLocation";
import type FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import { type SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { type Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { type FetchError } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import FilterAccordionItem from "./FilterAccordionItem";
import Published from "./Published";
import Occupations from "./Occupations";
import Extent from "./Extent";
import Sector from "./Sector";
import EngagementType from "./Engagement";
import WorkLanguage from "./WorkLanguage";
import { type SearchLocation } from "@/app/stillinger/(sok)/page";
import Under18 from "@/app/stillinger/(sok)/_components/filters/Under18";

interface FiltersDesktopProps {
    aggregations: FilterAggregations;
    locations: SearchLocation[];
    postcodes: Postcode[];
    searchResult: SearchResult;
    errors: FetchError[];
}

export default function FiltersDesktop({
    aggregations,
    locations,
    postcodes,
    searchResult,
    errors,
}: FiltersDesktopProps) {
    return (
        <div>
            <Accordion>
                <FilterAccordionItem title="Publisert" watchKeys={["published"]}>
                    <Published
                        initialValues={aggregations.published}
                        updatedValues={searchResult.aggregations.published}
                        publishedTotalCount={searchResult.aggregations.publishedTotalCount}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Sted" watchKeys={["county", "postcode"]}>
                    <DistanceOrLocation
                        postcodes={postcodes}
                        locations={locations}
                        searchResult={searchResult}
                        errors={errors}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Yrkeskategori og sektor" watchKeys={["occupationLevel1"]}>
                    <Occupations
                        initialValues={aggregations.occupationFirstLevels}
                        updatedValues={searchResult.aggregations.occupationFirstLevels}
                    />
                    <Sector initialValues={aggregations.sector} updatedValues={searchResult.aggregations.sector} />
                </FilterAccordionItem>
                <FilterAccordionItem
                    title="Utdanning, erfaring og førerkort"
                    watchKeys={["education", "experience", "needDriversLicense"]}
                    openWhen="any"
                >
                    {/* TODO: Add Skyra survey
                    <Alert variant="info" className="mb-6">
                        <NewFiltersMessage />
                    </Alert> */}
                    <Under18 initialValues={aggregations.under18} updatedValues={searchResult.aggregations.under18} />
                    <Education
                        initialValues={aggregations.education}
                        updatedValues={searchResult.aggregations.education}
                    />
                    <Experience
                        initialValues={aggregations.experience}
                        updatedValues={searchResult.aggregations.experience}
                    />
                    <DriversLicense
                        initialValues={aggregations.needDriversLicense}
                        updatedValues={searchResult.aggregations.needDriversLicense}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Arbeidsspråk" watchKeys={["workLanguage"]}>
                    <WorkLanguage
                        initialValues={aggregations.workLanguage}
                        updatedValues={searchResult.aggregations.workLanguage}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem
                    title="Omfang og ansettelsesform"
                    watchKeys={["extent", "engagementType"]}
                    openWhen="any"
                >
                    <Extent initialValues={aggregations.extent} updatedValues={searchResult.aggregations.extent} />
                    <EngagementType
                        initialValues={aggregations.engagementTypes}
                        updatedValues={searchResult.aggregations.engagementTypes}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Hjemmekontor" watchKeys={["remote"]}>
                    <Remote initialValues={aggregations.remote} updatedValues={searchResult.aggregations.remote} />
                </FilterAccordionItem>
            </Accordion>
        </div>
    );
}
