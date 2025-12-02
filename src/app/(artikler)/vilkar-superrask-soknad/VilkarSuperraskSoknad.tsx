import { BodyLong, BodyShort, Heading, Link as AkselLink } from "@navikt/ds-react";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import NextLink from "next/link";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";

type Props = {
    readonly meta: PageInfo;
};

export default function VilkarSuperraskSoknad({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language}>
            <AkselLink as={NextLink} href="/vilkar-og-retningslinjer" className="mb-8">
                <ChevronLeftIcon aria-hidden="true" />
                <BodyShort>Til Vilkår og retningslinjer</BodyShort>
            </AkselLink>

            <Heading size="xlarge" level="1" spacing>
                {meta.title}
            </Heading>
            <BodyLong className="mb-12">
                Personopplysninger som du får frå jobbsøkjarar i “superrask søknad” kan berre brukast så lenge formålet
                er å bemanna og rekruttera til ei konkret stilling.
            </BodyLong>
            <BodyLong>Det er ikkje tillaten å bruka mottekne personopplysningar til andre formål, slik som å</BodyLong>
            <ul className="mb-12">
                <li>
                    <BodyLong>
                        bruka opplysningar i samband med sal eller marknadsføring av varer eller tenester
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>tilby arbeidssøkjarar stillingar der arbeidssøkjaren må betala for å søkja</BodyLong>
                </li>
                <li>
                    <BodyLong>tilby personar arbeidstreningsplassar</BodyLong>
                </li>
            </ul>

            <BodyLong className="mb-24">Nav vil følgja opp brot på desse vilkåra dersom det førekjem.</BodyLong>
        </ArticleWrapper>
    );
}
