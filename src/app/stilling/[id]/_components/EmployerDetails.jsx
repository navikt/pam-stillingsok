import React from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import { BodyLong, Heading, Label, Link as AkselLink } from "@navikt/ds-react";
import { RichText } from "@navikt/arbeidsplassen-react";

export default function EmployerDetails({ employer }) {
    return (
        <section className="mt-16 mb-16">
            <Heading level="2" size="large" spacing>
                Om arbeidsgiveren
            </Heading>
            <dl className="dl mb-4">
                {employer.name && (
                    <>
                        <dt>
                            <Label as="p">Arbeidsgiver</Label>
                        </dt>
                        <dd>
                            <BodyLong>{employer.name}</BodyLong>
                        </dd>
                    </>
                )}
                {employer.location && (
                    <>
                        <dt>
                            <Label as="p">Adresse</Label>
                        </dt>
                        <dd>
                            <BodyLong>{employer.location}</BodyLong>
                        </dd>
                    </>
                )}
                {employer.homepage && (
                    <>
                        <dt>
                            <Label as="p">Hjemmeside</Label>
                        </dt>
                        <dd>
                            <BodyLong>
                                {employer.homepage.url ? (
                                    <AkselLink href={employer.homepage.url}>{employer.homepage.url}</AkselLink>
                                ) : (
                                    employer.homepage.dangerouslyInvalidUrl
                                )}
                            </BodyLong>
                        </dd>
                    </>
                )}
                {employer.linkedinPage && (
                    <>
                        <dt>
                            <Label as="p">LinkedIn</Label>
                        </dt>
                        <dd>
                            <BodyLong>
                                {employer.linkedinPage.url ? (
                                    <AkselLink href={employer.linkedinPage.url}>{employer.linkedinPage.url}</AkselLink>
                                ) : (
                                    employer.linkedinPage.dangerouslyInvalidUrl
                                )}
                            </BodyLong>
                        </dd>
                    </>
                )}
                {employer.twitterAddress && (
                    <>
                        <dt>
                            <Label as="p">Twitter</Label>
                        </dt>
                        <dd>
                            <BodyLong>
                                {employer.twitterAddress.url ? (
                                    <AkselLink href={employer.twitterAddress.url}>
                                        {employer.twitterAddress.url}
                                    </AkselLink>
                                ) : (
                                    employer.twitterAddress.dangerouslyInvalidUrl
                                )}
                            </BodyLong>
                        </dd>
                    </>
                )}
                {employer.facebookPage && (
                    <>
                        <dt>
                            <Label as="p">Facebook</Label>
                        </dt>
                        <dd>
                            <BodyLong>
                                {employer.facebookPage.url ? (
                                    <AkselLink href={employer.facebookPage.url}>{employer.facebookPage.url}</AkselLink>
                                ) : (
                                    employer.facebookPage.dangerouslyInvalidUrl
                                )}
                            </BodyLong>
                        </dd>
                    </>
                )}
            </dl>
            {employer.description && (
                <RichText className="job-posting-text mt-4">{parse(employer.description)}</RichText>
            )}
        </section>
    );
}

EmployerDetails.propTypes = {
    employer: PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string,
        location: PropTypes.string,
        locationList: PropTypes.array,
        homepage: PropTypes.shape({
            url: PropTypes.string,
            dangerouslyInvalidUrl: PropTypes.string,
        }),
        linkedinPage: PropTypes.shape({
            url: PropTypes.string,
            dangerouslyInvalidUrl: PropTypes.string,
        }),
        twitterAddress: PropTypes.shape({
            url: PropTypes.string,
            dangerouslyInvalidUrl: PropTypes.string,
        }),
        facebookPage: PropTypes.shape({
            url: PropTypes.string,
            dangerouslyInvalidUrl: PropTypes.string,
        }),
    }).isRequired,
};
