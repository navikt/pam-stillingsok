import React from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import { Heading, Link as AkselLink } from "@navikt/ds-react";
import DOMPurify from "isomorphic-dompurify";
import fixLocationName from "../../../../server/common/fixLocationName";
import { isValidUrl } from "../../common/utils/utils";
import getEmployer from "../../../../server/common/getEmployer";
import "./EmployerDetails.css";

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
            <dl className="JobPosting__dl mb-4">
                {employer && (
                    <>
                        <dt>Arbeidsgiver</dt>
                        <dd>{employer}</dd>
                    </>
                )}
                {employerLocation && (
                    <>
                        <dt>Adresse</dt>
                        <dd>{employerLocation}</dd>
                    </>
                )}
                {properties.employerhomepage && (
                    <>
                        <dt>Hjemmeside</dt>
                        <dd>
                            {isValidUrl(properties.employerhomepage) ? (
                                <AkselLink href={properties.employerhomepage}>{properties.employerhomepage}</AkselLink>
                            ) : (
                                properties.employerhomepage
                            )}
                        </dd>
                    </>
                )}
                {properties.linkedinpage && (
                    <>
                        <dt>LinkedIn</dt>
                        <dd>
                            {isValidUrl(properties.linkedinpage) ? (
                                <AkselLink href={properties.linkedinpage}>{properties.linkedinpage}</AkselLink>
                            ) : (
                                properties.linkedinpage
                            )}
                        </dd>
                    </>
                )}
                {properties.twitteraddress && (
                    <>
                        <dt>Twitter</dt>
                        <dd>
                            {isValidUrl(properties.twitteraddress) ? (
                                <AkselLink href={properties.twitteraddress}>{properties.twitteraddress}</AkselLink>
                            ) : (
                                properties.twitteraddress
                            )}
                        </dd>
                    </>
                )}
                {properties.facebookpage && (
                    <>
                        <dt>Facebook</dt>
                        <dd>
                            {isValidUrl(properties.facebookpage) ? (
                                <AkselLink href={properties.facebookpage}>{properties.facebookpage}</AkselLink>
                            ) : (
                                properties.facebookpage
                            )}
                        </dd>
                    </>
                )}
            </dl>
            {properties.employerdescription && (
                <div className="EmployerDetails__description">
                    {parse(DOMPurify.sanitize(properties.employerdescription))}
                </div>
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
