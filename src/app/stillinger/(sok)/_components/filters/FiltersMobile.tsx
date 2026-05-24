import { ChevronRightIcon } from "@navikt/aksel-icons";
import { Box, Button, Heading, HStack, Modal } from "@navikt/ds-react";
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
import Under18 from "@/app/stillinger/(sok)/_components/filters/Under18";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import type { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import type { FetchError } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
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
    const query = useQuery();

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

    const getNumberOfSelectedFilters = (filter: string | string[]) => {
        if (Array.isArray(filter)) {
            return filter.some((it) => query.has(it));
        } else if (query.has(filter)) {
            return true;
        }
        return false;
    };

    const isFirstPage = selectedFilter === "";

    return (
        <Modal
            aria-labelledby={"filterheading"}
            className="filter-modal flex"
            open
            onBeforeClose={changeView}
            onClose={onCloseClick}
            width="100%"
        >
            <Modal.Header className="filter-modal-header" closeButton={false}>
                <HStack gap="space-4" align="center" wrap={false}>
                    <div className="flex-1">
                        <Button onClick={isFirstPage ? onCloseClick : changeView} size="small" variant="tertiary">
                            Tilbake
                        </Button>
                    </div>
                    <div className="flex-1">
                        <Heading
                            id="filterheading"
                            level="1"
                            size="xsmall"
                            ref={headingRef}
                            tabIndex={-1}
                            className="no-focus-outline text-center"
                        >
                            Filtre
                        </Heading>
                    </div>
                    <HStack justify="end" className="flex-1">
                        <Button
                            className="white-space-nowrap flex-1"
                            variant="tertiary"
                            size="small"
                            onClick={() => {
                                query.reset();
                            }}
                        >
                            Nullstill søk
                        </Button>
                    </HStack>
                </HStack>
            </Modal.Header>
            <Modal.Body className="filter-modal-body flex-grow">
                {isFirstPage && (
                    <nav aria-label="Velg filter">
                        {[
                            { key: QueryNames.PUBLISHED, label: "Publisert" },
                            { key: [QueryNames.INTERNATIONAL, QueryNames.COUNTY], label: "Sted" },
                            { key: QueryNames.OCCUPATION_FIRST_LEVEL, label: "Yrkeskategori" },
                            {
                                key: [QueryNames.EDUCATION, QueryNames.EXPERIENCE, QueryNames.UNDER18],
                                label: "Utdanning og erfaring",
                            },
                            { key: QueryNames.NEED_DRIVERS_LICENSE, label: "Førerkort" },
                            { key: QueryNames.WORK_LANGUAGE, label: "Arbeidsspråk" },
                            { key: QueryNames.EXTENT, label: "Heltid/deltid" },
                            { key: QueryNames.ENGAGEMENT_TYPE, label: "Ansettelsesform" },
                            { key: QueryNames.SECTOR, label: "Sektor" },
                            { key: QueryNames.REMOTE, label: "Hjemmekontor" },
                        ].map((filter) => (
                            <button
                                key={filter.label}
                                type="button"
                                onClick={() => {
                                    setSelectedFilter(filter.label);
                                }}
                                className="filter-menu-button"
                            >
                                {filter.label}
                                <HStack as="span" gap="space-8" wrap={false}>
                                    {getNumberOfSelectedFilters(filter.key) && (
                                        <Box borderRadius="4" paddingInline="space-8" className="bg-brand-blue-subtle">
                                            Valgt
                                        </Box>
                                    )}
                                    <ChevronRightIcon fontSize="1.5rem" aria-hidden="true" />
                                </HStack>
                            </button>
                        ))}
                    </nav>
                )}

                {!isFirstPage && (
                    <Heading
                        id="filterheading"
                        level="1"
                        size="small"
                        ref={headingRef}
                        tabIndex={-1}
                        className="no-focus-outline mt-4"
                    >
                        {selectedFilter}
                    </Heading>
                )}

                <div className="mt-2">
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
                    {selectedFilter === "Sektor" && (
                        <Sector initialValues={aggregations.sector} updatedValues={searchResult.aggregations.sector} />
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

                    {selectedFilter === "Hjemmekontor" && (
                        <Remote initialValues={aggregations.remote} updatedValues={searchResult.aggregations.remote} />
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer className="filter-modal-footer">
                <Button variant="primary" onClick={onCloseClick} className="full-width white-space-nowrap">
                    {searchResult?.totalAds ? `Vis ${formatNumber(searchResult.totalAds)} treff` : "Vis treff"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FiltersMobile;
