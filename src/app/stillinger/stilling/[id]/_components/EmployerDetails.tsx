import React, { ReactElement } from "react";
import parse from "html-react-parser";
import { BodyLong, Heading, Label } from "@navikt/ds-react";
import { RichText } from "@navikt/arbeidsplassen-react";
import { type Employer } from "@/app/stillinger/_common/lib/ad-model";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

type EmployerDetailsProps = {
    employer: Employer;
};
export default function EmployerDetails({ employer }: EmployerDetailsProps): ReactElement {
    return (
        <section className="mt-8 mb-8 about-company">
            <Heading level="2" size="large" spacing>
                Om bedriften
            </Heading>
            {employer.descriptionHtml && (
                <RichText className="job-posting-text mt-4">{parse(employer.descriptionHtml)}</RichText>
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
                                {employer.homepage && (
                                    <AkselNextLink href={employer.homepage}>{employer.homepage}</AkselNextLink>
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
                                {employer.linkedinPage && (
                                    <AkselNextLink href={employer.linkedinPage}>{employer.linkedinPage}</AkselNextLink>
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
                                {employer.twitterAddress && (
                                    <AkselNextLink href={employer.twitterAddress}>
                                        {employer.twitterAddress}
                                    </AkselNextLink>
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
                                {employer.facebookPage && (
                                    <AkselNextLink href={employer.facebookPage}>{employer.facebookPage}</AkselNextLink>
                                )}
                            </BodyLong>
                        </dd>
                    </div>
                )}
            </dl>
        </section>
    );
}
