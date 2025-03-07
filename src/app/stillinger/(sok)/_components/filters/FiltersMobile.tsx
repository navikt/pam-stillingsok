import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Heading, HStack, Label, Modal } from "@navikt/ds-react";
import { ChevronRightIcon, ChevronLeftIcon } from "@navikt/aksel-icons";
import { formatNumber } from "@/app/stillinger/_common/utils/utils";
import Remote from "@/app/stillinger/(sok)/_components/filters/Remote";
import Education from "@/app/stillinger/(sok)/_components/filters/Education";
import DriversLicense from "@/app/stillinger/(sok)/_components/filters/DriversLicense";
import NewFiltersMessage from "@/app/stillinger/(sok)/_components/filters/NewFiltersMessage";
import Experience from "@/app/stillinger/(sok)/_components/filters/Experience";
import DistanceOrLocation from "@/app/stillinger/(sok)/_components/filters/DistanceOrLocation";
import Occupations from "./Occupations";
import Published from "./Published";
import Extent from "./Extent";
import Sector from "./Sector";
import EngagementType from "./Engagement";
import WorkLanguage from "./WorkLanguage";
import useIsDebug from "@/app/stillinger/(sok)/_components/IsDebugProvider";
import Under18 from "@/app/stillinger/(sok)/_components/filters/Under18";
import FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { SearchLocation } from "@/app/stillinger/(sok)/page";
import { FetchError } from "@/app/stillinger/(sok)/_utils/fetchTypes";

type FiltersMobileProps = {
    onCloseClick: () => void;
    searchResult: SearchResult;
    aggregations: FilterAggregations;
    locations: SearchLocation[];
    postcodes: Postcode[];
    errors: FetchError[];
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
    const { isDebug } = useIsDebug();

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
                            "Yrkeskategori og sektor",
                            "Utdanning, erfaring og førerkort",
                            "Arbeidsspråk",
                            "Omfang og ansettelsesform",
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
                                {filter} <ChevronRightIcon fontSize="1.5rem" aria-hidden="true" />
                            </button>
                        ))}
                    </nav>
                )}
                <div className="mt-4">
                    {selectedFilter === "Publisert" && (
                        <Published
                            initialValues={aggregations.published}
                            updatedValues={searchResult && searchResult.aggregations.published}
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

                    {selectedFilter === "Yrkeskategori og sektor" && (
                        <>
                            <div className="mb-6">
                                <Occupations
                                    initialValues={aggregations.occupationFirstLevels}
                                    updatedValues={searchResult && searchResult.aggregations.occupationFirstLevels}
                                />
                            </div>
                            <Sector
                                initialValues={aggregations.sector}
                                updatedValues={searchResult.aggregations.sector}
                            />
                        </>
                    )}
                    {selectedFilter === "Utdanning, erfaring og førerkort" && (
                        <>
                            <Alert variant="info" className="mb-4">
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
                        </>
                    )}

                    {selectedFilter === "Arbeidsspråk" && (
                        <WorkLanguage
                            hideLegend
                            initialValues={aggregations.workLanguage}
                            updatedValues={searchResult && searchResult.aggregations.workLanguage}
                        />
                    )}

                    {selectedFilter === "Omfang og ansettelsesform" && (
                        <>
                            <div className="mb-6">
                                <Extent
                                    initialValues={aggregations.extent}
                                    updatedValues={searchResult && searchResult.aggregations.extent}
                                />
                            </div>
                            <EngagementType
                                initialValues={aggregations.engagementTypes}
                                updatedValues={searchResult && searchResult.aggregations.engagementTypes}
                            />
                        </>
                    )}

                    {selectedFilter === "Hjemmekontor" && (
                        <Remote initialValues={aggregations.remote} updatedValues={searchResult.aggregations.remote} />
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer className="filter-modal-footer">
                <HStack wrap justify="space-between" gap="2" className="full-width">
                    {selectedFilter !== "" && (
                        <Button icon={<ChevronLeftIcon aria-hidden />} variant="tertiary" onClick={changeView}>
                            Tilbake
                        </Button>
                    )}
                    <Button variant="primary" onClick={onCloseClick} className="flex-grow white-space-nowrap">
                        {searchResult && searchResult.totalAds
                            ? `Vis ${formatNumber(searchResult.totalAds)} treff`
                            : "Vis treff"}
                    </Button>
                </HStack>
            </Modal.Footer>
        </Modal>
    );
};

export default FiltersMobile;
