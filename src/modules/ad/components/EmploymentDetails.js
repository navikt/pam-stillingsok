import React from "react";
import PropTypes from "prop-types";
import { formatDate } from "../../../common/components/utils";
import worktimeParser from "./worktimeParser";
import { Heading } from "@navikt/ds-react";

export default function EmploymentDetails({ stilling }) {
    const { properties } = stilling;

    return (
        <section className="JobPosting__section">
            <Heading level="2" size="large" spacing>
                Om stillingen
            </Heading>
            <dl className="JobPosting__dl JobPosting__dl--flex">
                {properties.jobtitle && (
                    <div>
                        <dt>Stillingstittel:</dt>
                        <dd>{properties.jobtitle}</dd>
                    </div>
                )}
                {properties.positioncount && (
                    <div>
                        <dt>Antall stillinger:</dt>
                        <dd>{properties.positioncount}</dd>
                    </div>
                )}
                {properties.starttime && (
                    <div>
                        <dt>Oppstart</dt>
                        <dd>{formatDate(properties.starttime)}</dd>
                    </div>
                )}
                {(properties.remote === "Hjemmekontor" || properties.remote === "Hybridkontor") && (
                    <div>
                        <dt>Hjemmekontor</dt>
                        <dd>{properties.remote === "Hjemmekontor" ? "Kun hjemmekontor" : "Hybrid"}</dd>
                    </div>
                )}
                {properties.engagementtype && (
                    <div>
                        <dt>Ansettelsesform</dt>
                        <dd>{properties.engagementtype}</dd>
                    </div>
                )}
                {properties.jobpercentage && (
                    <div>
                        <dt>Prosent</dt>
                        <dd>{properties.jobpercentage} %</dd>
                    </div>
                )}
                {properties.extent && (
                    <div>
                        <dt>Heltid/deltid</dt>
                        <dd>{properties.extent}</dd>
                    </div>
                )}
                {properties.sector && (
                    <div>
                        <dt>Sektor</dt>
                        <dd>{properties.sector}</dd>
                    </div>
                )}
                {properties.workday && (
                    <div>
                        <dt>Arbeidsdager</dt>
                        <dd>{worktimeParser(properties.workday)}</dd>
                    </div>
                )}
                {properties.workhours && (
                    <div>
                        <dt>Arbeidstid</dt>
                        <dd>{worktimeParser(properties.workhours)}</dd>
                    </div>
                )}
                {properties.jobarrangement && (
                    <div>
                        <dt>Arbeidstidsordning</dt>
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
