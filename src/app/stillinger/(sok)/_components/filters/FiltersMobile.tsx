"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@navikt/aksel-icons";
import { Button, Heading, HStack, Label, Modal, Tag, VStack } from "@navikt/ds-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import FilterIcon from "@/app/_common/components/FilterIcon";
import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import { track } from "@/app/_common/umami";
import type FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import type { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { formatNumber } from "@/app/stillinger/_common/utils/utils";
import DistanceOrLocation from "@/app/stillinger/(sok)/_components/filters/DistanceOrLocation";
import DriversLicense from "@/app/stillinger/(sok)/_components/filters/DriversLicense";
import Education from "@/app/stillinger/(sok)/_components/filters/Education";
import Experience from "@/app/stillinger/(sok)/_components/filters/Experience";
import HasSuperraskSoknad from "@/app/stillinger/(sok)/_components/filters/HasSuperraskSoknad";
import Remote from "@/app/stillinger/(sok)/_components/filters/Remote";
import Season from "@/app/stillinger/(sok)/_components/filters/Season";
import Under18 from "@/app/stillinger/(sok)/_components/filters/Under18";
import { countActiveFilters } from "@/app/stillinger/(sok)/_components/searchBox/searchParamsUtils";
import type { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import type { FetchError } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import EngagementType from "./Engagement";
import Extent from "./Extent";
import Occupations from "./Occupations";
import Published from "./Published";
import Sector from "./Sector";
import WorkLanguage from "./WorkLanguage";

const FILTER_GROUPS = [
    { label: "Publisert", keys: [QueryNames.PUBLISHED] },
    {
        label: "Sted",
        keys: [
            QueryNames.COUNTY,
            QueryNames.MUNICIPAL,
            QueryNames.POSTCODE,
            QueryNames.DISTANCE,
            QueryNames.COUNTRY,
            QueryNames.INTERNATIONAL,
        ],
    },
    {
        label: "Yrkeskategori",
        keys: [QueryNames.OCCUPATION, QueryNames.OCCUPATION_FIRST_LEVEL, QueryNames.OCCUPATION_SECOND_LEVEL],
    },
    { label: "Utdanning og arbeidserfaring", keys: [QueryNames.UNDER18, QueryNames.EDUCATION, QueryNames.EXPERIENCE] },
    { label: "Førerkort", keys: [QueryNames.NEED_DRIVERS_LICENSE] },
    { label: "Arbeidsspråk", keys: [QueryNames.WORK_LANGUAGE] },
    { label: "Heltid/deltid", keys: [QueryNames.EXTENT] },
    { label: "Sesong", keys: [QueryNames.IS_SUMMER_JOB, QueryNames.IS_XMAS_JOB] },
    { label: "Superrask søknad", keys: [QueryNames.HAS_SUPERRASK_SOKNAD] },
    { label: "Ansettelsesform", keys: [QueryNames.ENGAGEMENT_TYPE] },
    { label: "Sektor", keys: [QueryNames.SECTOR] },
    { label: "Hjemmekontor", keys: [QueryNames.REMOTE] },
] as const;

type FiltersMobileProps = {
    searchResult: SearchResult;
    aggregations: FilterAggregations;
    locations: readonly SearchLocation[];
    postcodes: readonly Postcode[];
    errors: readonly FetchError[];
};
const FiltersMobile = ({ searchResult, aggregations, locations, postcodes, errors }: FiltersMobileProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("");
    const headingRef = useRef<HTMLHeadingElement>(null);
    const searchParams = useSearchParams();
    const activeFilterCounts = Object.fromEntries(
        FILTER_GROUPS.map(({ label, keys }) => [
            label,
            countActiveFilters(new URLSearchParams(searchParams.toString()), keys),
        ]),
    );

    const changeView = () => {
        if (selectedFilter !== "") {
            setSelectedFilter("");
            return false;
        }
        return true;
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedFilter("");
    };

    useEffect(() => {
        if (isOpen && headingRef.current) {
            headingRef.current.focus();
        }
        // TODO: selectedFilter trigger re-fokus av heading ved filterbytte
    }, [selectedFilter, isOpen]);

    return (
        <>
            <Button
                type="button"
                variant="secondary"
                size="xsmall"
                onClick={() => {
                    track("Klikk - Vis filtre");
                    setIsOpen(true);
                }}
                icon={<FilterIcon />}
                aria-expanded={isOpen}
            >
                Filter
            </Button>

            {isOpen && (
                <Modal
                    aria-labelledby={"filterheading"}
                    className="filter-modal flex"
                    open
                    onBeforeClose={changeView}
                    onClose={closeModal}
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
                                {FILTER_GROUPS.map(({ label }) => {
                                    const filterCount = activeFilterCounts[label] ?? 0;

                                    return (
                                        <button
                                            key={label}
                                            type="button"
                                            onClick={() => {
                                                setSelectedFilter(label);
                                            }}
                                            className="filter-menu-button"
                                        >
                                            <HStack as="span" gap="space-8">
                                                {label}
                                                {label === "Superrask søknad" && (
                                                    <Tag variant="moderate" data-color="accent" size="xsmall">
                                                        <HStack as="span" gap="space-4">
                                                            <span aria-hidden="true">🎉</span>
                                                            <span>Ny</span>
                                                        </HStack>
                                                    </Tag>
                                                )}
                                                {filterCount > 0 && (
                                                    <Tag variant="moderate" data-color="accent" size="xsmall">
                                                        {filterCount} valgt
                                                    </Tag>
                                                )}
                                            </HStack>
                                            <ChevronRightIcon fontSize="1.5rem" aria-hidden="true" />
                                        </button>
                                    );
                                })}
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
                            {selectedFilter === "Utdanning og arbeidserfaring" && (
                                <VStack gap="space-24">
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
                                </VStack>
                            )}

                            {selectedFilter === "Sesong" && (
                                <Season
                                    initialSummerJobValues={aggregations.summerJob}
                                    updatedSummerJobValues={searchResult.aggregations.summerJob}
                                    initialXmasJobValues={aggregations.xmasJob}
                                    updatedXmasJobValues={searchResult.aggregations.xmasJob}
                                />
                            )}

                            {selectedFilter === "Superrask søknad" && (
                                <HasSuperraskSoknad
                                    initialValues={aggregations.hasSuperraskSoknad}
                                    updatedValues={searchResult.aggregations.hasSuperraskSoknad}
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
                                <Extent
                                    initialValues={aggregations.extent}
                                    updatedValues={searchResult?.aggregations.extent}
                                />
                            )}

                            {selectedFilter === "Ansettelsesform" && (
                                <EngagementType
                                    initialValues={aggregations.engagementTypes}
                                    updatedValues={searchResult?.aggregations.engagementTypes}
                                />
                            )}

                            {selectedFilter === "Sektor" && (
                                <Sector
                                    initialValues={aggregations.sector}
                                    updatedValues={searchResult.aggregations.sector}
                                />
                            )}

                            {selectedFilter === "Hjemmekontor" && (
                                <Remote
                                    initialValues={aggregations.remote}
                                    updatedValues={searchResult.aggregations.remote}
                                />
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
                            <Button variant="primary" onClick={closeModal} className="flex-grow white-space-nowrap">
                                {searchResult?.totalAds
                                    ? `Vis ${formatNumber(searchResult.totalAds)} treff`
                                    : "Vis treff"}
                            </Button>
                        </HStack>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};

export default FiltersMobile;
