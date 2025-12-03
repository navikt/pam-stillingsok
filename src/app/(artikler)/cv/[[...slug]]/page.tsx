import { BodyLong, Heading } from "@navikt/ds-react";
import FigureSleeping from "@/app/_common/components/FigureSleeping";
import { Metadata } from "next";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { buildPageMetadata } from "@/app/(artikler)/buildPageMetadata";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

const pageInfo: PageInfo = {
    title: "Min CV på arbeidsplassen.no",
    language: "nb",
    proofread: true,
    category: "jobseeker-guides",
    description: "CV-tjenesten ble lagt ned 1. oktober 2025.",
    updatedAt: "2025-04-11",
};

export const metadata: Metadata = buildPageMetadata({
    robots: { index: false, follow: false },
    meta: pageInfo,
});

export default function Page() {
    return (
        <div className="container-small mt-10 mb-24 text-center">
            <Heading size="xlarge" level="1" spacing>
                {pageInfo.title}
            </Heading>

            <BodyLong spacing>CV-tjenesten ble lagt ned 1. oktober 2025.</BodyLong>

            <BodyLong>
                Du kan isteden bruke{" "}
                <AkselNextLink href="https://europass.europa.eu/no">CV-løsningen til Europass</AkselNextLink>. Den er
                gratis.
            </BodyLong>

            <div className="mt-12 mb-6">
                <FigureSleeping />
            </div>

            <BodyLong spacing>
                Dersom du er under oppfølging av Nav, vil CV-en din fremdeles være tilgjengelig på{" "}
                <AkselNextLink href="https://www.nav.no/min-cv">nav.no/min-cv</AkselNextLink>.
            </BodyLong>

            <BodyLong spacing>
                Med hilsen <AkselNextLink href="https://arbeidsplassen.nav.no/">arbeidsplassen.no</AkselNextLink>
            </BodyLong>
        </div>
    );
}
