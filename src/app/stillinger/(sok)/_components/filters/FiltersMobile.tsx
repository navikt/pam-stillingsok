import { ChevronLeftIcon, ChevronRightIcon } from "@navikt/aksel-icons";
import { Button, Heading, HStack, Label, Modal, Tag } from "@navikt/ds-react";
import { useEffect, useRef, useState } from "react";
import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import type FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import type { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { formatNumber } from "@/app/stillinger/_common/utils/utils";
import DistanceOrLocation from "@/app/stillinger/(sok)/_components/filters/DistanceOrLocation";
import DriversLicense from "@/app/stillinger/(sok)/_components/filters/DriversLicense";
import Education from "@/app/stillinger/(sok)/_components/filters/Education";
import Experience from "@/app/stillinger/(sok)/_components/filters/Experience";
import Remote from "@/app/stillinger/(sok)/_components/filters/Remote";
import SummerJob from "@/app/stillinger/(sok)/_components/filters/SummerJob";
import Under18 from "@/app/stillinger/(sok)/_components/filters/Under18";
import type { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import type { FetchError } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import EngagementType from "./Engagement";
import Extent from "./Extent";
import Occupations from "./Occupations";
import Published from "./Published";
import Sector from "./Sector";
import WorkLanguage from "./WorkLanguage";

type FiltersMobileProps = {
    onCloseClick: () => void;
    searchResult: SearchResult;
    aggregations: FilterAggregations;
    locations: readonly SearchLocation[];
    postcodes: readonly Postcode[];
    errors: readonly FetchError[];
};
const FiltersMobile = ({
    onCloseClick,
    searchResult,
    aggregations,
    locations,
    postcodes,
    errors,
}: FiltersMobileProps) => {
    const [selectedFilter, setSelectedFilter] = useState("");
    const headingRef = useRef<HTMLHeadingElement>(null);

    const changeView = () => {
        if (selectedFilter !== "") {
            setSelectedFilter("");
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (headingRef.current) {
            headingRef.current.focus();
        }
        // TODO: selectedFilter trigger re-fokus av heading ved filterbytte
    }, [selectedFilter]);

    return (
        <Modal
            aria-labelledby={"filterheading"}
            className="filter-modal flex"
            open
            onBeforeClose={changeView}
            onClose={onCloseClick}
            width="100%"
        >
            <Modal.Header className="filter-modal-header">
                {selectedFilter !== "" && (
                    <Label textColor="subtle" size="small" spacing>
                        Filtre
                    </Label>
                )}

                <Heading
                    id="filterheading"
                    level="1"
                    size={selectedFilter === "" ? "medium" : "small"}
                    ref={headingRef}
                    tabIndex={-1}
                    className="no-focus-outline"
                >
                    {selectedFilter === "" ? "Filtre" : selectedFilter}
                </Heading>
            </Modal.Header>
            <Modal.Body className="filter-modal-body flex-grow">
                {selectedFilter === "" && (
                    <nav aria-label="Velg filter">
                        {[
                            "Publisert",
                            "Sted",
                            "Yrkeskategori",
                            "Utdanning og erfaring",
                            "Førerkort",
                            "Arbeidsspråk",
                            "Heltid/deltid",
                            "Sommerjobb",
                            "Ansettelsesform",
                            "Sektor",
                            "Hjemmekontor",
                        ].map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => {
                                    setSelectedFilter(filter);
                                }}
                                className="filter-menu-button"
                            >
                                <HStack as="span" gap="space-8">
                                    {filter}
                                    {filter === "Sommerjobb" && (
                                        <>
                                            {" "}
                                            <Tag variant="moderate" data-color="accent" size="xsmall">
                                                🎉 Ny
                                            </Tag>
                                        </>
                                    )}
                                </HStack>
                                <ChevronRightIcon fontSize="1.5rem" aria-hidden="true" />
                            </button>
                        ))}
                    </nav>
                )}
                <div>
                    {selectedFilter === "Publisert" && (
                        <Published
                            initialValues={aggregations.published}
                            updatedValues={searchResult?.aggregations.published}
                            publishedTotalCount={searchResult.aggregations.publishedTotalCount}
                        />
                    )}

                    {selectedFilter === "Sted" && (
                        <DistanceOrLocation
                            postcodes={postcodes}
                            locations={locations}
                            searchResult={searchResult}
                            errors={errors}
                        />
                    )}

                    {selectedFilter === "Yrkeskategori" && (
                        <Occupations
                            initialValues={aggregations.occupationFirstLevels}
                            updatedValues={searchResult?.aggregations.occupationFirstLevels}
                        />
                    )}
                    {selectedFilter === "Utdanning og erfaring" && (
                        <>
                            <Under18
                                initialValues={aggregations.under18}
                                updatedValues={searchResult.aggregations.under18}
                            />
                            <Education
                                initialValues={aggregations.education}
                                updatedValues={searchResult.aggregations.education}
                            />
                            <Experience
                                initialValues={aggregations.experience}
                                updatedValues={searchResult.aggregations.experience}
                            />
                        </>
                    )}

                    {selectedFilter === "Sommerjobb" && (
                        <SummerJob
                            initialValues={aggregations.summerJob}
                            updatedValues={searchResult.aggregations.summerJob}
                        />
                    )}

                    {selectedFilter === "Førerkort" && (
                        <DriversLicense
                            initialValues={aggregations.needDriversLicense}
                            updatedValues={searchResult.aggregations.needDriversLicense}
                        />
                    )}

                    {selectedFilter === "Arbeidsspråk" && (
                        <WorkLanguage
                            hideLegend
                            initialValues={aggregations.workLanguage}
                            updatedValues={searchResult?.aggregations.workLanguage}
                        />
                    )}

                    {selectedFilter === "Heltid/deltid" && (
                        <Extent initialValues={aggregations.extent} updatedValues={searchResult?.aggregations.extent} />
                    )}

                    {selectedFilter === "Ansettelsesform" && (
                        <EngagementType
                            initialValues={aggregations.engagementTypes}
                            updatedValues={searchResult?.aggregations.engagementTypes}
                        />
                    )}

                    {selectedFilter === "Sektor" && (
                        <Sector initialValues={aggregations.sector} updatedValues={searchResult.aggregations.sector} />
                    )}

                    {selectedFilter === "Hjemmekontor" && (
                        <Remote initialValues={aggregations.remote} updatedValues={searchResult.aggregations.remote} />
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer className="filter-modal-footer">
                <HStack wrap justify="space-between" gap="space-8" className="full-width">
                    {selectedFilter !== "" && (
                        <Button icon={<ChevronLeftIcon aria-hidden />} variant="tertiary" onClick={changeView}>
                            Tilbake
                        </Button>
                    )}
                    <Button variant="primary" onClick={onCloseClick} className="flex-grow white-space-nowrap">
                        {searchResult?.totalAds ? `Vis ${formatNumber(searchResult.totalAds)} treff` : "Vis treff"}
                    </Button>
                </HStack>
            </Modal.Footer>
        </Modal>
    );
};

export default FiltersMobile;
