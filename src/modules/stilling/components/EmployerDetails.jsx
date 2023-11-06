import React from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import { BodyLong, Heading, Label, Link as AkselLink } from "@navikt/ds-react";
import DOMPurify from "isomorphic-dompurify";
import fixLocationName from "../../../../server/common/fixLocationName";
import { isValidUrl } from "../../common/utils/utils";
import getEmployer from "../../../../server/common/getEmployer";

function getEmployerLocation(employer) {
    let employerLocation = null;

    if (employer && employer.location) {
        const { location } = employer;

        if (location.postalCode) {
            employerLocation = location.address ? `${location.address}, ` : "";
            employerLocation += `${location.postalCode} ${fixLocationName(location.city)}`;
        } else if (location.municipal) {
            employerLocation = `${fixLocationName(location.municipal)}`;
        } else if (location.country) {
            employerLocation = `${fixLocationName(location.country)}`;
        }
    }
    return employerLocation;
}

export default function EmployerDetails({ stilling }) {
    const { properties } = stilling;
    const employer = getEmployer(stilling);
    const employerLocation = getEmployerLocation(stilling.employer);
    return (
        <section className="mt-16 mb-16">
            <Heading level="2" size="large" spacing>
                Om arbeidsgiveren
            </Heading>
            <dl className="dl mb-4">
                {employer && (
                    <>
                        <dt>
                            <Label as="p">Arbeidsgiver</Label>
                        </dt>
                        <dd>
                            <BodyLong>{employer}</BodyLong>
                        </dd>
                    </>
                )}
                {employerLocation && (
                    <>
                        <dt>
                            <Label as="p">Adresse</Label>
                        </dt>
                        <dd>
                            <BodyLong>{employerLocation}</BodyLong>
                        </dd>
                    </>
                )}
                {properties.employerhomepage && (
                    <>
                        <dt>
                            <Label as="p">Hjemmeside</Label>
                        </dt>
                        <dd>
                            <BodyLong>
                                {isValidUrl(properties.employerhomepage) ? (
                                    <AkselLink href={properties.employerhomepage}>
                                        {properties.employerhomepage}
                                    </AkselLink>
                                ) : (
                                    properties.employerhomepage
                                )}
                            </BodyLong>
                        </dd>
                    </>
                )}
                {properties.linkedinpage && (
                    <>
                        <dt>
                            <Label as="p">LinkedIn</Label>
                        </dt>
                        <dd>
                            <BodyLong>
                                {isValidUrl(properties.linkedinpage) ? (
                                    <AkselLink href={properties.linkedinpage}>{properties.linkedinpage}</AkselLink>
                                ) : (
                                    properties.linkedinpage
                                )}
                            </BodyLong>
                        </dd>
                    </>
                )}
                {properties.twitteraddress && (
                    <>
                        <dt>
                            <Label as="p">Twitter</Label>
                        </dt>
                        <dd>
                            <BodyLong>
                                {isValidUrl(properties.twitteraddress) ? (
                                    <AkselLink href={properties.twitteraddress}>{properties.twitteraddress}</AkselLink>
                                ) : (
                                    properties.twitteraddress
                                )}
                            </BodyLong>
                        </dd>
                    </>
                )}
                {properties.facebookpage && (
                    <>
                        <dt>
                            <Label as="p">Facebook</Label>
                        </dt>
                        <dd>
                            <BodyLong>
                                {isValidUrl(properties.facebookpage) ? (
                                    <AkselLink href={properties.facebookpage}>{properties.facebookpage}</AkselLink>
                                ) : (
                                    properties.facebookpage
                                )}
                            </BodyLong>
                        </dd>
                    </>
                )}
            </dl>
            {properties.employerdescription && (
                <div className="ad-html-content mt-4">{parse(DOMPurify.sanitize(properties.employerdescription))}</div>
            )}
        </section>
    );
}

EmployerDetails.propTypes = {
    stilling: PropTypes.shape({
        properties: PropTypes.shape({
            employer: PropTypes.string,
            address: PropTypes.string,
            employerhomepage: PropTypes.string,
            linkedinpage: PropTypes.string,
            twitteraddress: PropTypes.string,
            facebookpage: PropTypes.string,
            employerdescription: PropTypes.string,
        }).isRequired,
        employer: PropTypes.shape({
            location: PropTypes.shape({
                postalCode: PropTypes.string,
                address: PropTypes.string,
                municipal: PropTypes.string,
                country: PropTypes.string,
                city: PropTypes.string,
            }),
        }),
    }).isRequired,
};
