import React from "react";
import PropTypes from "prop-types";
import { BodyLong, HStack } from "@navikt/ds-react";
import { Buldings3Icon, LocationPinIcon } from "@navikt/aksel-icons";
import getWorkLocation from "@/app/_common/utils/getWorkLocation";
import getEmployer from "@/app/_common/utils/getEmployer";

export default function Summary({ adData }) {
    const location = getWorkLocation(adData.location, adData.locationList, false);

    return (
        <section className="mb-12">
            {adData.employer && (
                <HStack className="mb-2" gap="3" align="center" wrap={false}>
                    <HStack align="center">
                        <Buldings3Icon title="Arbeidsgiver" fontSize="1.5rem" />
                    </HStack>
                    <BodyLong weight="semibold">{adData.employer.name}</BodyLong>
                </HStack>
            )}
            {location && (
                <HStack className="mb-2" gap="3" align="center" wrap={false}>
                    <HStack align="center">
                        <LocationPinIcon title="Sted" fontSize="1.5rem" />
                    </HStack>
                    <BodyLong weight="semibold">{location}</BodyLong>
                </HStack>
            )}
        </section>
    );
}

Summary.propTypes = {
    stilling: PropTypes.shape({
        locationList: PropTypes.arrayOf(PropTypes.object),
        properties: PropTypes.shape({
            jobtitle: PropTypes.string,
            location: PropTypes.string,
            engagementtype: PropTypes.string,
            jobpercentage: PropTypes.string,
            extent: PropTypes.string,
            positioncount: PropTypes.string,
            sector: PropTypes.string,
            workday: PropTypes.string,
            workhours: PropTypes.string,
            jobarrangement: PropTypes.string,
            starttime: PropTypes.string,
        }),
        location: PropTypes.shape({}),
    }).isRequired,
};
