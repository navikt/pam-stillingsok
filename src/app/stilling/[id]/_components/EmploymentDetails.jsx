import React from "react";
import PropTypes from "prop-types";
import { BodyLong, Heading, Label } from "@navikt/ds-react";
import { formatDate } from "@/app/_common/utils/utils";
import worktimeParser from "./worktimeParser";
import "./EmploymentDetails.css";
import Ad from "@/app/stilling/[id]/_components/Ad";

export default function EmploymentDetails({ adData }) {
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
                {adData.jobTitle && (
                    <>
                        <dt>
                            <Label as="p">Stillingstittel</Label>
                        </dt>
                        <dd>
                            <BodyLong>{adData.jobTitle}</BodyLong>
                        </dd>
                    </>
                )}
                {adData.positionCount && (
                    <>
                        <dt>
                            <Label as="p">Antall stillinger</Label>
                        </dt>
                        <dd>
                            <BodyLong>{adData.positionCount}</BodyLong>
                        </dd>
                    </>
                )}
                {adData.startTime && (
                    <>
                        <dt>
                            <Label as="p">Oppstart</Label>
                        </dt>
                        <dd>
                            <BodyLong>{formatDate(adData.startTime)}</BodyLong>
                        </dd>
                    </>
                )}
                {(adData.remote === "Hjemmekontor" || adData.remote === "Hybridkontor") && (
                    <>
                        <dt>
                            <Label as="p">Hjemmekontor</Label>
                        </dt>
                        <dd>
                            <BodyLong>{adData.remote === "Hjemmekontor" ? "Kun hjemmekontor" : "Hybrid"}</BodyLong>
                        </dd>
                    </>
                )}
                {adData.engagementType && (
                    <>
                        <dt>
                            <Label as="p">Ansettelsesform</Label>
                        </dt>
                        <dd>
                            <BodyLong>{adData.engagementType}</BodyLong>
                        </dd>
                    </>
                )}
                {adData.jobPercentage && (
                    <>
                        <dt>
                            <Label as="p">Prosent</Label>
                        </dt>
                        <dd>
                            <BodyLong>{adData.jobPercentage}</BodyLong>
                        </dd>
                    </>
                )}
                {adData.extent && (
                    <>
                        <dt>
                            <Label as="p">Heltid/deltid</Label>
                        </dt>
                        <dd>
                            <BodyLong>{adData.extent}</BodyLong>
                        </dd>
                    </>
                )}
                {adData.sector && (
                    <>
                        <dt>
                            <Label as="p">Sektor</Label>
                        </dt>
                        <dd>
                            <BodyLong>{adData.sector}</BodyLong>
                        </dd>
                    </>
                )}
                {adData.workday && (
                    <>
                        <dt>
                            <Label as="p">Arbeidsdager</Label>
                        </dt>
                        <dd>
                            <BodyLong>{adData.workday}</BodyLong>
                        </dd>
                    </>
                )}
                {adData.workhours && (
                    <>
                        <dt>
                            <Label as="p">Arbeidstid</Label>
                        </dt>
                        <dd>
                            <BodyLong>{adData.workhours}</BodyLong>
                        </dd>
                    </>
                )}
                {adData.jobArrangement && (
                    <>
                        <dt>
                            <Label as="p">Arbeidstidsordning</Label>
                        </dt>
                        <dd>
                            <BodyLong>{adData.jobArrangement}</BodyLong>
                        </dd>
                    </>
                )}
                {adData.workLanguages && (
                    <>
                        <dt>
                            <Label as="p">Arbeidsspråk</Label>
                        </dt>
                        <dd>
                            <BodyLong>{formatWorkLanguage(adData.workLanguages)}</BodyLong>
                        </dd>
                    </>
                )}
            </dl>
        </section>
    );
}

EmploymentDetails.propTypes = {
    adData: PropTypes.shape({
        jobTitle: PropTypes.string,
        positionCount: PropTypes.string,
        startTime: PropTypes.string,
        remote: PropTypes.string,
        engagementType: PropTypes.string,
        jobPercentage: PropTypes.string,
        extent: PropTypes.string,
        workday: PropTypes.string,
        workhours: PropTypes.string,
        jobArrangement: PropTypes.string,
        workLanguages: PropTypes.array,
        employer: PropTypes.shape({
            name: PropTypes.string,
        }),
    }).isRequired,
};
