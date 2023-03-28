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
                {properties.jobtitle && (
                    <React.Fragment>
                        <dt>Stillingstittel:</dt>
                        <dd>{properties.jobtitle}</dd>
                    </React.Fragment>
                )}
                {properties.positioncount && (
                    <React.Fragment>
                        <dt>Antall stillinger:</dt>
                        <dd>{properties.positioncount}</dd>
                    </React.Fragment>
                )}
                {(properties.remote === "Hjemmekontor" || properties.remote === "Hybridkontor") && (
                    <React.Fragment>
                        <dt>Hjemmekontor:</dt>
                        <dd>
                            {properties.remote === "Hjemmekontor"
                                ? "Kun hjemmekontor"
                                : "Hybrid (noe hjemme, noe på arbeidsplassen)"}
                        </dd>
                    </React.Fragment>
                )}
                {properties.engagementtype && (
                    <React.Fragment>
                        <dt>Ansettelsesform:</dt>
                        <dd>{properties.engagementtype}</dd>
                    </React.Fragment>
                )}
                {properties.jobpercentage && (
                    <React.Fragment>
                        <dt>Prosent:</dt>
                        <dd>{properties.jobpercentage} %</dd>
                    </React.Fragment>
                )}
                {properties.extent && (
                    <React.Fragment>
                        <dt>Heltid/deltid:</dt>
                        <dd>{properties.extent}</dd>
                    </React.Fragment>
                )}
                {properties.sector && (
                    <React.Fragment>
                        <dt>Sektor:</dt>
                        <dd>{properties.sector}</dd>
                    </React.Fragment>
                )}
                {properties.workday && (
                    <React.Fragment>
                        <dt>Arbeidsdager:</dt>
                        <dd>{worktimeParser(properties.workday)}</dd>
                    </React.Fragment>
                )}
                {properties.workhours && (
                    <React.Fragment>
                        <dt>Arbeidstid:</dt>
                        <dd>{worktimeParser(properties.workhours)}</dd>
                    </React.Fragment>
                )}
                {properties.jobarrangement && (
                    <React.Fragment>
                        <dt>Arbeidstidsordning:</dt>
                        <dd>{properties.jobarrangement}</dd>
                    </React.Fragment>
                )}
                {properties.starttime && (
                    <React.Fragment>
                        <dt>Oppstart:</dt>
                        <dd>
                            {isValidISOString(properties.starttime)
                                ? formatDate(properties.starttime, "DD.MM.YYYY")
                                : properties.starttime}
                        </dd>
                    </React.Fragment>
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
