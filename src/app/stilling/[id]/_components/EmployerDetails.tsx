import React, { ReactElement } from "react";
import parse from "html-react-parser";
import { BodyLong, Heading, Label, Link as AkselLink } from "@navikt/ds-react";
import { RichText } from "@navikt/arbeidsplassen-react";
import { EmployerDTO } from "@/app/lib/stillingSoekSchema";

type EmployerDetailsProps = {
    employer: EmployerDTO;
};
export default function EmployerDetails({ employer }: EmployerDetailsProps): ReactElement {
    return (
        <section className="mt-8 mb-8 about-company">
            <Heading level="2" size="large" spacing>
                Om bedriften
            </Heading>
            {employer.description && (
                <RichText className="job-posting-text mt-4">{parse(employer.description)}</RichText>
            )}
            <dl className="ad-description-list">
                {employer.sector && (
                    <div>
                        <dt>
                            <Label as="p">Sektor</Label>
                        </dt>
                        <dd>
                            <BodyLong>{employer.sector}</BodyLong>
                        </dd>
                    </div>
                )}
                {employer.homepage && (
                    <div>
                        <dt>
                            <Label as="p">Nettsted</Label>
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
                    </div>
                )}
                {employer.linkedinPage && (
                    <div>
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
                    </div>
                )}
                {employer.twitterAddress && (
                    <div>
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
                    </div>
                )}
                {employer.facebookPage && (
                    <div>
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
                    </div>
                )}
            </dl>
        </section>
    );
}
