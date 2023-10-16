import React from "react";
import PropTypes from "prop-types";
import { BodyLong, Heading, Label } from "@navikt/ds-react";
import { formatDate } from "../../common/utils/utils";
import worktimeParser from "./worktimeParser";

export default function EmploymentDetails({ stilling }) {
    const { properties } = stilling;

    return (
        <section className="full-width">
            <Heading level="2" size="large" spacing>
                Om stillingen
            </Heading>
            <dl className="dl JobPosting__dl--flex">
                {properties.jobtitle && (
                    <div>
                        <dt>
                            <Label as="p">Stillingstittel</Label>
                        </dt>
                        <dd>
                            <BodyLong>{properties.jobtitle}</BodyLong>
                        </dd>
                    </div>
                )}
                {properties.positioncount && (
                    <div>
                        <dt>
                            <Label as="p">Antall stillinger</Label>
                        </dt>
                        <dd>
                            <BodyLong>{properties.positioncount}</BodyLong>
                        </dd>
                    </div>
                )}
                {properties.starttime && (
                    <div>
                        <dt>
                            <Label as="p">Oppstart</Label>
                        </dt>
                        <dd>
                            <BodyLong>{formatDate(properties.starttime)}</BodyLong>
                        </dd>
                    </div>
                )}
                {(properties.remote === "Hjemmekontor" || properties.remote === "Hybridkontor") && (
                    <div>
                        <dt>
                            <Label as="p">Hjemmekontor</Label>
                        </dt>
                        <dd>
                            <BodyLong>{properties.remote === "Hjemmekontor" ? "Kun hjemmekontor" : "Hybrid"}</BodyLong>
                        </dd>
                    </div>
                )}
                {properties.engagementtype && (
                    <div>
                        <dt>
                            <Label as="p">Ansettelsesform</Label>
                        </dt>
                        <dd>
                            <BodyLong>{properties.engagementtype}</BodyLong>
                        </dd>
                    </div>
                )}
                {properties.jobpercentage && (
                    <div>
                        <dt>
                            <Label as="p">Prosent</Label>
                        </dt>
                        <dd>
                            <BodyLong>{properties.jobpercentage} %</BodyLong>
                        </dd>
                    </div>
                )}
                {properties.extent && (
                    <div>
                        <dt>
                            <Label as="p">Heltid/deltid</Label>
                        </dt>
                        <dd>
                            <BodyLong>{properties.extent}</BodyLong>
                        </dd>
                    </div>
                )}
                {properties.sector && (
                    <div>
                        <dt>
                            <Label as="p">Sektor</Label>
                        </dt>
                        <dd>
                            <BodyLong>{properties.sector}</BodyLong>
                        </dd>
                    </div>
                )}
                {properties.workday && (
                    <div>
                        <dt>
                            <Label as="p">Arbeidsdager</Label>
                        </dt>
                        <dd>
                            <BodyLong>{worktimeParser(properties.workday)}</BodyLong>
                        </dd>
                    </div>
                )}
                {properties.workhours && (
                    <div>
                        <dt>
                            <Label as="p">Arbeidstid</Label>
                        </dt>
                        <dd>
                            <BodyLong>{worktimeParser(properties.workhours)}</BodyLong>
                        </dd>
                    </div>
                )}
                {properties.jobarrangement && (
                    <div>
                        <dt>
                            <Label as="p">Arbeidstidsordning</Label>
                        </dt>
                        <dd>
                            <BodyLong>{properties.jobarrangement}</BodyLong>
                        </dd>
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
            starttime: PropTypes.string,
            remote: PropTypes.string,
        }),
        location: PropTypes.shape({}),
    }).isRequired,
};
