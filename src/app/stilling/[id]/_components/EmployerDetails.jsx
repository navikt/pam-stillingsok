import React from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import { BodyLong, Heading, Label, Link as AkselLink } from "@navikt/ds-react";
import DOMPurify from "isomorphic-dompurify";
import { RichText } from "@navikt/arbeidsplassen-react";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import { isValidUrl } from "@/app/_common/utils/utils";
import getEmployer from "@/app/_common/utils/getEmployer";

function getEmployerLocation(employer) {
    let employerLocation = [];

    if (!employer || !employer.locationList) {
        return undefined;
    }

    const { locationList } = employer;

    for (let i = 0; i < locationList.length; i += 1) {
        if (locationList[i].postalCode) {
            let address = locationList[i].address ? `${locationList[i].address}, ` : "";
            address += `${locationList[i].postalCode} ${fixLocationName(locationList[i].city)}`;
            employerLocation.push(address);
        } else if (locationList[i].municipal) {
            employerLocation.push(`${fixLocationName(locationList[i].municipal)}`);
        } else if (locationList[i].country) {
            employerLocation.push(`${fixLocationName(locationList[i].country)}`);
        }
    }

    return employerLocation.join(", ");
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
                <RichText className="job-posting-text mt-4">
                    {parse(DOMPurify.sanitize(properties.employerdescription))}
                </RichText>
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
