import React from "react";
import PropTypes from "prop-types";
import { Buldings3Icon, PinIcon } from "@navikt/aksel-icons";
import getWorkLocation from "../../../../server/common/getWorkLocation";
import getEmployer from "../../../../server/common/getEmployer";
import "./Summary.css";

export default function Summary({ stilling }) {
    const location = getWorkLocation(stilling.properties.location, stilling.locationList, false);
    const employer = getEmployer(stilling);

    return (
        <section className="Summary">
            {employer && (
                <div className="Summary__item">
                    <div>
                        <Buldings3Icon title="Arbeidsgiver" width="1.25em" height="1.25em" />
                    </div>
                    <div>{employer}</div>
                </div>
            )}
            {location && (
                <div className="Summary__item">
                    <div>
                        <PinIcon title="Sted" width="1.25em" height="1.25em" />
                    </div>
                    <div>{location}</div>
                </div>
            )}
        </section>
    );
}

Summary.propTypes = {
    stilling: PropTypes.shape({
        locationList: PropTypes.shape({}),
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
