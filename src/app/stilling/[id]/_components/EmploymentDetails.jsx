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
                Om jobben
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
                {adData.engagementType && (
                    <>
                        <dt>
                            <Label as="p">Type ansettelse</Label>
                        </dt>
                        <dd>
                            <BodyLong>
                                {adData.engagementType}
                                {adData.extent ? `, ${adData.extent}` : ""}
                            </BodyLong>
                        </dd>
                    </>
                )}
                {(adData.jobArrangement || adData.workdays || adData.workHours) && (
                    <>
                        <dt>
                            <Label as="p">Arbeidstid</Label>
                        </dt>
                        <dd>
                            <BodyLong>
                                {adData.jobArrangement} {adData.workdays} {adData.workHours}
                            </BodyLong>
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
            </dl>
        </section>
    );
}

EmploymentDetails.propTypes = {
    adData: PropTypes.shape({
        jobTitle: PropTypes.string,
        positionCount: PropTypes.string,
        startTime: PropTypes.string,
        engagementType: PropTypes.string,
        jobPercentage: PropTypes.string,
        extent: PropTypes.string,
        workdays: PropTypes.string,
        workHours: PropTypes.string,
        jobArrangement: PropTypes.string,
        workLanguages: PropTypes.array,
        employer: PropTypes.shape({
            name: PropTypes.string,
        }),
    }).isRequired,
};
