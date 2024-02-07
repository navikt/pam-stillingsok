import React from "react";
import PropTypes from "prop-types";
import { BodyLong, Heading, Label } from "@navikt/ds-react";
import { formatDate } from "../../../../../modules/common/utils/utils";
import worktimeParser from "./worktimeParser";
import "./EmploymentDetails.css";

export default function EmploymentDetails({ stilling }) {
    const { properties } = stilling;

    const formatWorkLanguage = (languages) => {
        if (languages.length === 1) {
            return languages[0];
        }
        let languageString = "";
        for (let i = 0; i < languages.length; i += 1) {
            // Add "eller" before the last language
            if (i === languages.length - 1) {
                languageString += " eller ";
            }

            languageString += languages[i];

            // Separate languages with ", ", except the last language
            if (i < languages.length - 2) {
                languageString += ", ";
            }
        }
        return languageString;
    };

    return (
        <section className="full-width">
            <Heading level="2" size="large" spacing>
                Om stillingen
            </Heading>

            <dl className="dl" id="employment-details">
                {properties.jobtitle && (
                    <>
                        <dt>
                            <Label as="p">Stillingstittel</Label>
                        </dt>
                        <dd>
                            <BodyLong>{properties.jobtitle}</BodyLong>
                        </dd>
                    </>
                )}
                {properties.positioncount && (
                    <>
                        <dt>
                            <Label as="p">Antall stillinger</Label>
                        </dt>
                        <dd>
                            <BodyLong>{properties.positioncount}</BodyLong>
                        </dd>
                    </>
                )}
                {properties.starttime && (
                    <>
                        <dt>
                            <Label as="p">Oppstart</Label>
                        </dt>
                        <dd>
                            <BodyLong>{formatDate(properties.starttime)}</BodyLong>
                        </dd>
                    </>
                )}
                {(properties.remote === "Hjemmekontor" || properties.remote === "Hybridkontor") && (
                    <>
                        <dt>
                            <Label as="p">Hjemmekontor</Label>
                        </dt>
                        <dd>
                            <BodyLong>{properties.remote === "Hjemmekontor" ? "Kun hjemmekontor" : "Hybrid"}</BodyLong>
                        </dd>
                    </>
                )}
                {properties.engagementtype && (
                    <>
                        <dt>
                            <Label as="p">Ansettelsesform</Label>
                        </dt>
                        <dd>
                            <BodyLong>{properties.engagementtype}</BodyLong>
                        </dd>
                    </>
                )}
                {properties.jobpercentage && (
                    <>
                        <dt>
                            <Label as="p">Prosent</Label>
                        </dt>
                        <dd>
                            <BodyLong>{properties.jobpercentage} %</BodyLong>
                        </dd>
                    </>
                )}
                {properties.extent && (
                    <>
                        <dt>
                            <Label as="p">Heltid/deltid</Label>
                        </dt>
                        <dd>
                            <BodyLong>{properties.extent}</BodyLong>
                        </dd>
                    </>
                )}
                {properties.sector && (
                    <>
                        <dt>
                            <Label as="p">Sektor</Label>
                        </dt>
                        <dd>
                            <BodyLong>{properties.sector}</BodyLong>
                        </dd>
                    </>
                )}
                {properties.workday && (
                    <>
                        <dt>
                            <Label as="p">Arbeidsdager</Label>
                        </dt>
                        <dd>
                            <BodyLong>{worktimeParser(properties.workday)}</BodyLong>
                        </dd>
                    </>
                )}
                {properties.workhours && (
                    <>
                        <dt>
                            <Label as="p">Arbeidstid</Label>
                        </dt>
                        <dd>
                            <BodyLong>{worktimeParser(properties.workhours)}</BodyLong>
                        </dd>
                    </>
                )}
                {properties.jobarrangement && (
                    <>
                        <dt>
                            <Label as="p">Arbeidstidsordning</Label>
                        </dt>
                        <dd>
                            <BodyLong>{properties.jobarrangement}</BodyLong>
                        </dd>
                    </>
                )}
                {properties.workLanguage && (
                    <>
                        <dt>
                            <Label as="p">Arbeidsspråk</Label>
                        </dt>
                        <dd>
                            <BodyLong>{formatWorkLanguage(properties.workLanguage)}</BodyLong>
                        </dd>
                    </>
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
            workLanguage: PropTypes.array,
        }),
        location: PropTypes.shape({}),
    }).isRequired,
};
