import React from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import { BodyLong, Heading, Label, Link as AkselLink } from "@navikt/ds-react";
import { RichText } from "@navikt/arbeidsplassen-react";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import { isValidUrl } from "@/app/_common/utils/utils";
import Ad from "@/app/stilling/[id]/_components/Ad";

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
                                <AkselLink href={employer.homepage}>{employer.homepage}</AkselLink>
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
                                <AkselLink href={employer.linkedinPage}>{employer.linkedinPage}</AkselLink>
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
                                <AkselLink href={employer.twitterAddress}>{employer.twitterAddress}</AkselLink>
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
                                <AkselLink href={employer.facebookPage}>{employer.facebookPage}</AkselLink>
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
        homepage: PropTypes.string,
        linkedinPage: PropTypes.string,
        twitterAddress: PropTypes.string,
        facebookPage: PropTypes.string,
        location: PropTypes.string,
        locationList: PropTypes.array,
    }).isRequired,
};
