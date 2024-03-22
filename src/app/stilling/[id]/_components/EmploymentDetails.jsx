import React from "react";
import PropTypes from "prop-types";
import { BodyLong, Heading, Label } from "@navikt/ds-react";
import { formatDate } from "@/app/_common/utils/utils";
import "./EmploymentDetails.css";
import joinStringWithSeperator from "@/app/_common/utils/joinStringWithSeperator";

export default function EmploymentDetails({ adData }) {
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
                {adData.workdays && (
                    <>
                        <dt>
                            <Label as="p">Arbeidsdager</Label>
                        </dt>
                        <dd>
                            <BodyLong>{joinStringWithSeperator(adData.workdays)}</BodyLong>
                        </dd>
                    </>
                )}
                {adData.workHours && (
                    <>
                        <dt>
                            <Label as="p">Arbeidstid</Label>
                        </dt>
                        <dd>
                            <BodyLong>{joinStringWithSeperator(adData.workHours)}</BodyLong>
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
                            <BodyLong>{joinStringWithSeperator(adData.workLanguages, "eller")}</BodyLong>
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
        workdays: PropTypes.arrayOf(PropTypes.string),
        workHours: PropTypes.arrayOf(PropTypes.string),
        jobArrangement: PropTypes.string,
        workLanguages: PropTypes.array,
        employer: PropTypes.shape({
            name: PropTypes.string,
        }),
    }).isRequired,
};
