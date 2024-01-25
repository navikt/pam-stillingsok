import React from "react";
import PropTypes from "prop-types";
import { BodyLong, HStack } from "@navikt/ds-react";
import { Buldings3Icon, EarthIcon } from "@navikt/aksel-icons";
import getWorkLocation from "../../../../server/common/getWorkLocation";
import getEmployer from "../../../../server/common/getEmployer";

export default function Summary({ stilling }) {
    const location = getWorkLocation(stilling.properties.location, stilling.locationList, false);
    const employer = getEmployer(stilling);

    return (
        <section className="mb-12">
            {employer && (
                <HStack className="mb-2" gap="3" align="center" wrap={false}>
                    <HStack align="center">
                        <Buldings3Icon title="Arbeidsgiver" width="1.5em" height="1.5em" />
                    </HStack>
                    <BodyLong weight="semibold">{employer}</BodyLong>
                </HStack>
            )}
            {location && (
                <HStack className="mb-2" gap="3" align="center" wrap={false}>
                    <HStack align="center">
                        <EarthIcon title="Sted" width="1.5em" height="1.5em" />
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
