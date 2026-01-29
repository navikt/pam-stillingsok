import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import type { ReactElement } from "react";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import Link from "next/link";
import { PageBlock } from "@navikt/ds-react/Page";
import GiveFeedback from "@/app/stillinger/stilling/[id]/superrask-soknad/_components/GiveFeedback";
import type { ValidateApplicationRequest } from "../../stillinger/stilling/[id]/superrask-soknad/_types/Application";
import { notFound } from "next/navigation";
import { Metadata } from "next";

async function verifyApplication(token: string) {
    "use server";
    const headers = await getDefaultHeaders();

    const validateRequest: ValidateApplicationRequest = {
        token: token,
    };

    const res = await fetch(`${process.env.INTEREST_API_URL}/application-form/application/verify`, {
        headers: headers,
        method: "POST",
        body: JSON.stringify(validateRequest),
    });

    if (res.status === 404) {
        notFound();
    }

    if (!res.ok) {
        throw new Error("Failed to validate application email");
    }
}

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Superrask søknad",
        robots: "noindex",
    };
}

export default async function Page(props: { searchParams: Promise<{ token: string }> }): Promise<ReactElement> {
    const searchParams = await props.searchParams;
    const token = searchParams.token;

    await verifyApplication(token);

    return (
        <div className="mb-16 mt-16">
            <PageBlock width="text" gutters>
                <Heading level="1" size="large" spacing>
                    Din e-post er verifisert og søknad er sendt til arbeidsgiver
                </Heading>
                <BodyLong spacing>
                    Du vil straks få en bekreftelse på din e-post. Ønsker du å trekke din søknad finner du informasjon
                    om dette i e-posten.
                </BodyLong>
                <Heading level="2" spacing size="medium">
                    Hva skjer nå?
                </Heading>
                <BodyLong className="mb-8">
                    Bedriften vil vurdere din søknad og ta kontakt dersom de syns du passer for jobben. Du får beskjed
                    på e-post så fort bedriften har gjort en vurdering.
                </BodyLong>
                <Button variant="secondary" as={Link} href="/stillinger">
                    Søk etter fler jobber
                </Button>

                <GiveFeedback />
            </PageBlock>
        </div>
    );
}
