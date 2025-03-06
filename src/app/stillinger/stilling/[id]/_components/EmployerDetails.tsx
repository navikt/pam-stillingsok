import React, { ReactElement } from "react";
import parse from "html-react-parser";
import { BodyLong, Heading, Label, Link as AkselLink } from "@navikt/ds-react";
import { RichText } from "@navikt/arbeidsplassen-react";
import { EmployerDTO } from "@/app/stillinger/lib/stillingSchema";

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
                                {employer.homepage && (
                                    <AkselLink href={employer.homepage}>{employer.homepage}</AkselLink>
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
                                    <AkselLink href={employer.linkedinPage}>{employer.linkedinPage}</AkselLink>
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
                                    <AkselLink href={employer.twitterAddress}>{employer.twitterAddress}</AkselLink>
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
                                    <AkselLink href={employer.facebookPage}>{employer.facebookPage}</AkselLink>
                                )}
                            </BodyLong>
                        </dd>
                    </div>
                )}
            </dl>
        </section>
    );
}
