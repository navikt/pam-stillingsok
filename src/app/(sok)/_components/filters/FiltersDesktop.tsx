import React, { ReactElement } from "react";
import { Accordion, Alert, Button } from "@navikt/ds-react";
import Remote from "@/app/(sok)/_components/filters/Remote";
import Education from "@/app/(sok)/_components/filters/Education";
import DriversLicense from "@/app/(sok)/_components/filters/DriversLicense";
import Experience from "@/app/(sok)/_components/filters/Experience";
import NewFiltersMessage from "@/app/(sok)/_components/filters/NewFiltersMessage";
import DistanceOrLocation from "@/app/(sok)/_components/filters/DistanceOrLocation";
import FilterAggregations from "@/app/(sok)/_types/FilterAggregations";
import { SearchResult } from "@/app/(sok)/_types/SearchResult";
import { Postcode } from "@/app/(sok)/_utils/fetchPostcodes";
import { FetchError } from "@/app/(sok)/_utils/fetchTypes";
import FilterAccordionItem from "./FilterAccordionItem";
import Published from "./Published";
import Occupations from "./Occupations";
import Extent from "./Extent";
import Sector from "./Sector";
import EngagementType from "./Engagement";
import WorkLanguage from "./WorkLanguage";
import Under18 from "@/app/(sok)/_components/filters/Under18";
import useIsDebug from "@/app/(sok)/_components/IsDebugProvider";
import { SearchLocation } from "@/app/(sok)/page";

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
}: FiltersDesktopProps): ReactElement {
    const { isDebug } = useIsDebug();

    return (
        <div>
            <Accordion indent={false} headingSize="small">
                <FilterAccordionItem title="Publisert" panelId="publisert">
                    <Published
                        initialValues={aggregations.published}
                        updatedValues={searchResult.aggregations.published}
                        publishedTotalCount={searchResult.aggregations.publishedTotalCount}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Sted" panelId="sted">
                    <DistanceOrLocation
                        postcodes={postcodes}
                        locations={locations}
                        searchResult={searchResult}
                        errors={errors}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Yrkeskategori og sektor" panelId="yrke">
                    <Occupations
                        initialValues={aggregations.occupationFirstLevels}
                        updatedValues={searchResult.aggregations.occupationFirstLevels}
                    />
                    <Sector initialValues={aggregations.sector} updatedValues={searchResult.aggregations.sector} />
                </FilterAccordionItem>
                <FilterAccordionItem title="Utdanning, erfaring og førerkort" panelId="education">
                    <Alert variant="info" className="mb-6">
                        <NewFiltersMessage />
                    </Alert>
                    {isDebug && (
                        <Under18
                            initialValues={aggregations.under18}
                            updatedValues={searchResult.aggregations.under18}
                        />
                    )}
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
                <FilterAccordionItem title="Arbeidsspråk" panelId="workLanguage">
                    <WorkLanguage
                        initialValues={aggregations.workLanguage}
                        updatedValues={searchResult.aggregations.workLanguage}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Omfang og ansettelsesform" panelId="extent">
                    <Extent initialValues={aggregations.extent} updatedValues={searchResult.aggregations.extent} />
                    <EngagementType
                        initialValues={aggregations.engagementTypes}
                        updatedValues={searchResult.aggregations.engagementTypes}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Hjemmekontor" panelId="hjemmekontor">
                    <Remote initialValues={aggregations.remote} updatedValues={searchResult.aggregations.remote} />
                </FilterAccordionItem>
            </Accordion>
            <noscript>
                <Button type="submit">Søk</Button>
            </noscript>
        </div>
    );
}
