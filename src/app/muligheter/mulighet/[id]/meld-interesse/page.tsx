import { ReactElement } from "react";
import { BodyLong, Heading } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { appLogger } from "@/app/_common/logging/appLogger";
import { checkMuligheterAccess } from "@/app/muligheter/_common/auth/checkAccess.server";
import GiveFeedbackMuligheter from "./_components/GiveFeedbackMuligheter";
import BackToMuligheterLink from "./_components/BackToMuligheterLink";

export const metadata: Metadata = {
    title: "Interesse meldt",
    description: "Du har nå delt din interesse med veileder",
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
        },
    },
};

export default async function Page(props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ submitted?: string }>;
}): Promise<ReactElement> {
    if (process.env.MULIGHETER_ENABLED !== "true") {
        appLogger.warn(
            "Muligheter error - Har prøvd å aksessere /muligheter/meld-interesse, men feature er deaktivert.",
        );
        notFound();
    }

    const hasAccess = await checkMuligheterAccess();
    if (!hasAccess) {
        notFound();
    }

    const [params, searchParams] = await Promise.all([props.params, props.searchParams]);

    if (searchParams.submitted !== "true") {
        redirect(`/muligheter/mulighet/${params.id}`);
    }

    return (
        <PageBlock className="mt-12" width="text" gutters>
            <Heading level="1" size="large" spacing>
                Interessen er sendt til din veileder!
            </Heading>
            <Heading level="2" className="mt-8" spacing size="medium">
                Hva skjer nå?
            </Heading>
            <BodyLong spacing>
                Hvis du er aktuell for stillingen, får du en forespørsel i aktivitetsplanen på nav.no om å dele CV-en
                din med arbeidsgiver. Du kan gjerne oppdatere CV-en før du deler den. Sjekk også at kontaktinformasjonen
                din er riktig.
            </BodyLong>
            <BodyLong className="mb-8">
                Arbeidsgiver vil så vurdere interessen din, og tar kontakt hvis de ønsker å gå videre med deg.
            </BodyLong>
            <BackToMuligheterLink />

            <GiveFeedbackMuligheter />
        </PageBlock>
    );
}
