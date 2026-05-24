import { Accordion } from "@navikt/ds-react";
import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import type FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import type { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import DistanceOrLocation from "@/app/stillinger/(sok)/_components/filters/DistanceOrLocation";
import DriversLicense from "@/app/stillinger/(sok)/_components/filters/DriversLicense";
import Education from "@/app/stillinger/(sok)/_components/filters/Education";
import Experience from "@/app/stillinger/(sok)/_components/filters/Experience";
import Remote from "@/app/stillinger/(sok)/_components/filters/Remote";
import Under18 from "@/app/stillinger/(sok)/_components/filters/Under18";
import type { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import type { FetchError } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import EngagementType from "./Engagement";
import Extent from "./Extent";
import FilterAccordionItem from "./FilterAccordionItem";
import Occupations from "./Occupations";
import Published from "./Published";
import Sector from "./Sector";
import WorkLanguage from "./WorkLanguage";

interface FiltersDesktopProps {
    aggregations: FilterAggregations;
    locations: readonly SearchLocation[];
    postcodes: readonly Postcode[];
    searchResult: SearchResult;
    errors: readonly FetchError[];
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
            <Accordion indent={false}>
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
                <FilterAccordionItem title="Yrkeskategori" watchKeys={["occupationLevel1"]}>
                    <Occupations
                        initialValues={aggregations.occupationFirstLevels}
                        updatedValues={searchResult.aggregations.occupationFirstLevels}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem
                    title="Utdanning og erfaring"
                    watchKeys={["education", "under18", "experience"]}
                    openWhen="any"
                >
                    <Under18 initialValues={aggregations.under18} updatedValues={searchResult.aggregations.under18} />
                    <Education
                        initialValues={aggregations.education}
                        updatedValues={searchResult.aggregations.education}
                    />
                    <Experience
                        initialValues={aggregations.experience}
                        updatedValues={searchResult.aggregations.experience}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Førerkort" watchKeys={["needDriversLicense"]}>
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
                <FilterAccordionItem title="Heltid/deltid" watchKeys={["extent"]}>
                    <Extent initialValues={aggregations.extent} updatedValues={searchResult.aggregations.extent} />
                </FilterAccordionItem>
                <FilterAccordionItem title="Ansettelsesform" watchKeys={["engagementType"]}>
                    <EngagementType
                        initialValues={aggregations.engagementTypes}
                        updatedValues={searchResult.aggregations.engagementTypes}
                    />
                </FilterAccordionItem>
                <FilterAccordionItem title="Sektor" watchKeys={["sector"]}>
                    <Sector initialValues={aggregations.sector} updatedValues={searchResult.aggregations.sector} />
                </FilterAccordionItem>
                <FilterAccordionItem title="Hjemmekontor" watchKeys={["remote"]}>
                    <Remote initialValues={aggregations.remote} updatedValues={searchResult.aggregations.remote} />
                </FilterAccordionItem>
            </Accordion>
        </div>
    );
}
