import React from "react";
import PropTypes from "prop-types";
import getWorkLocation from "../../../../server/common/getWorkLocation";
import getEmployer from "../../../../server/common/getEmployer";
import "./Summary.css";
import { Buldings3Icon, PinIcon } from "@navikt/aksel-icons";

export default function Summary({ stilling }) {
    const location = getWorkLocation(stilling.properties.location, stilling.locationList, false);
    const employer = getEmployer(stilling);

    return (
        <section className="Summary">
            {employer && (
                <p className="Summary__item">
                    <Buldings3Icon title="Arbeidsgiver" width="1.25em" height="1.25em" />
                    {employer}
                </p>
            )}
            {location && (
                <p className="Summary__item">
                    <PinIcon title="Sted" width="1.25em" height="1.25em" />
                    {location}
                </p>
            )}
        </section>
    );
}

Summary.propTypes = {
    stilling: PropTypes.shape({
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
            starttime: PropTypes.string
        }),
        location: PropTypes.shape({})
    }).isRequired
};
