import { BodyLong, Button, Heading } from "@navikt/ds-react";
import FigureSleeping from "@/app/_common/components/FigureSleeping";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const pageInfo: PageInfo = {
    title: "Jobbtreff (bedrift)",
    language: "nb",
    proofread: true,
    category: "support-and-contact",
    description:
        "Les om jobbtreff der arbeidsgivere og jobbsøkere møtes for å utforske jobbmuligheter og bygge nettverk.",
    updatedAt: "2025-04-11",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: pageInfo,
    robots: { index: false, follow: false },
});

export default function Page() {
    return (
        <article
            lang={pageInfo.language !== "nb" ? pageInfo.language : undefined}
            className="container-small mt-10 mb-24 text-center"
        >
            <Heading size="xlarge" level="1" spacing>
                {pageInfo.title}
            </Heading>
            <BodyLong>
                Tjenesten ble avsluttet 13. juni 2024, fordi bruken rett og slett var for lav til å forsvare videre
                drift. Vi forstår at dette kan være skuffende, men vi er mer engasjert enn noensinne i å utvikle og
                forbedre våre tilbud til deg som ser etter nye medarbeidere.
            </BodyLong>

            <div className="mt-12 mb-6">
                <FigureSleeping />
            </div>

            <BodyLong spacing>
                Trenger du nye medarbeidere? Opprett en stillingsannonse i dag og bli synlig i ett av Norges største
                stillingssøk!
            </BodyLong>
            <Button variant="primary" as="a" href="/stillingsregistrering/stillingsannonser">
                Lag ny annonse
            </Button>
        </article>
    );
}
