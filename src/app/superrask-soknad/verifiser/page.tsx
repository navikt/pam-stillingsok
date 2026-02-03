import type { ReactElement } from "react";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import Link from "next/link";
import { PageBlock } from "@navikt/ds-react/Page";
import GiveFeedback from "@/app/stillinger/stilling/[id]/superrask-soknad/_components/GiveFeedback";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { verifyApplication } from "./verifyApplication";

export const metadata: Metadata = {
    title: "Superrask søknad",
    robots: "noindex",
};

export default async function Page(props: { searchParams: Promise<{ token: string }> }): Promise<ReactElement> {
    const searchParams = await props.searchParams;
    const token = searchParams.token;

    if (token === null || token.trim().length === 0) {
        notFound();
    }

    // JWE tokens have 5 Base64URL parts separated by .
    const tokenPattern = /^([\w-]+\.){4}[\w-]+$/;

    if (!tokenPattern.test(token)) {
        throw Error("Invalid JWE token format");
    }

    await verifyApplication(token);

    return (
        <div className="mb-16 mt-16">
            <PageBlock width="text" gutters>
                <Heading level="1" size="large" spacing>
                    Din e-post er bekreftet og søknad er sendt til arbeidsgiver
                </Heading>
                <BodyLong spacing>
                    Du vil straks få en bekreftelse på din e-post. Ønsker du å trekke din søknad finner du informasjon
                    om dette i e-posten.
                </BodyLong>
                <Heading level="2" spacing size="medium">
                    Hva skjer nå?
                </Heading>
                <BodyLong className="mb-8">
                    Bedriften vil vurdere din søknad og ta kontakt dersom de synes du passer for jobben. Du får beskjed
                    på e-post så fort bedriften har gjort en vurdering.
                </BodyLong>
                <Button variant="secondary" as={Link} href="/stillinger">
                    Søk etter flere jobber
                </Button>

                <GiveFeedback />
            </PageBlock>
        </div>
    );
}
