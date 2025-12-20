import React, { ReactElement } from "react";
import parse from "html-react-parser";
import { BodyLong, Heading, Label, Link } from "@navikt/ds-react";
import { RichText } from "@navikt/arbeidsplassen-react";
import { type Employer } from "@/app/(nonce)/stillinger/_common/lib/ad-model";

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
                                {employer.homepage && <Link href={employer.homepage}>{employer.homepage}</Link>}
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
                                    <Link href={employer.linkedinPage}>{employer.linkedinPage}</Link>
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
                                    <Link href={employer.twitterAddress}>{employer.twitterAddress}</Link>
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
                                    <Link href={employer.facebookPage}>{employer.facebookPage}</Link>
                                )}
                            </BodyLong>
                        </dd>
                    </div>
                )}
            </dl>
        </section>
    );
}
