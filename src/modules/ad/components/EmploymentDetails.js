import React from "react";
import PropTypes from "prop-types";
import { formatDate, isValidISOString } from "../../../common/components/utils";
import worktimeParser from "./worktimeParser";
import { Heading } from "@navikt/ds-react";

export default function EmploymentDetails({ stilling }) {
    const { properties } = stilling;

    return (
        <section className="JobPosting__section">
            <Heading level="2" size="medium" spacing>
                Om stillingen
            </Heading>
            <dl className="JobPosting__dl">
                {properties.positioncount && (
                    <div className="JobPosting__dl--flex">
                        <dt>Antall stillinger:</dt>
                        <dd>{properties.positioncount}</dd>
                    </div>
                )}
                {properties.starttime && (
                    <div className="JobPosting__dl--flex">
                        <dt>Oppstart:</dt>
                        <dd>
                            {isValidISOString(properties.starttime)
                                ? formatDate(properties.starttime, "DD.MM.YYYY")
                                : properties.starttime}
                        </dd>
                    </div>
                )}
                {(properties.remote === "Hjemmekontor" || properties.remote === "Hybridkontor") && (
                    <div className="JobPosting__dl--flex">
                        <dt>Hjemmekontor:</dt>
                        <dd>
                            {properties.remote === "Hjemmekontor"
                                ? "Kun hjemmekontor"
                                : "Hybrid (noe hjemme, noe på arbeidsplassen)"}
                        </dd>
                    </div>
                )}
                {properties.engagementtype && (
                    <div className="JobPosting__dl--flex">
                        <dt>Ansettelsesform:</dt>
                        <dd>{properties.engagementtype}</dd>
                    </div>
                )}
                {properties.jobpercentage && (
                    <div className="JobPosting__dl--flex">
                        <dt>Prosent:</dt>
                        <dd>{properties.jobpercentage} %</dd>
                    </div>
                )}
                {properties.extent && (
                    <div className="JobPosting__dl--flex">
                        <dt>Heltid/deltid:</dt>
                        <dd>{properties.extent}</dd>
                    </div>
                )}
                {properties.sector && (
                    <div className="JobPosting__dl--flex">
                        <dt>Sektor:</dt>
                        <dd>{properties.sector}</dd>
                    </div>
                )}
                {properties.workday && (
                    <div className="JobPosting__dl--flex">
                        <dt>Arbeidsdager:</dt>
                        <dd>{worktimeParser(properties.workday)}</dd>
                    </div>
                )}
                {properties.workhours && (
                    <div className="JobPosting__dl--flex">
                        <dt>Arbeidstid:</dt>
                        <dd>{worktimeParser(properties.workhours)}</dd>
                    </div>
                )}
                {properties.jobarrangement && (
                    <div className="JobPosting__dl--flex">
                        <dt>Arbeidstidsordning:</dt>
                        <dd>{properties.jobarrangement}</dd>
                    </div>
                )}
            </dl>
        </section>
    );
}

EmploymentDetails.propTypes = {
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
