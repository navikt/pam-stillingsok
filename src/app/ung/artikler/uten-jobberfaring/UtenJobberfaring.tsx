import womanInterview from "@images/woman-interview.jpeg";
import { BodyLong, Heading } from "@navikt/ds-react";
import ArticleBleedImage from "@/app/_common/article/ArticleBleedImage";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import ContentSection from "@/app/_common/ContentSection/ContentSection";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import TipsList from "@/app/_common/TipsList/TipsList";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { tipsList } from "@/app/ung/artikler/uten-jobberfaring/data";

type Props = {
    readonly meta: PageInfo;
};
export default function UtenJobberfaring({ meta }: Props) {
    return (
        <>
            <ArticleWrapper lang={meta.language}>
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>

                <BodyLong size="large" className="mb-12">
                    Mangler du jobberfaring og lurer på hvordan du skal finne din første jobb? Ikke stress. Alle må
                    starte et sted, og mange arbeidsgivere ser etter motivasjon og vilje til å lære, ikke bare erfaring.
                </BodyLong>

                <ArticleBleedImage src={womanInterview} alt="Kvinne som sitter i et jobbintervju" unoptimized />
            </ArticleWrapper>

            <ContentSection
                className="mb-12"
                heading="5 tips for å finne jobb"
                as="section"
                surface="peachSubtle"
                width="text"
                paddingBlock={{ xs: "space-32" }}
            >
                <TipsList tips={tipsList} aria-label="5 tips for å finne jobb" />
            </ContentSection>

            <ArticleWrapper lang={meta.language}>
                <BodyLong spacing>
                    Her finner du jobber som ikke krever arbeidserfaring:{" "}
                    <AkselNextLink href="/stillinger?hasSuperraskSoknad=true&v=6" inlineText>
                        Ledige stillinger - arbeidsplassen.no
                    </AkselNextLink>
                </BodyLong>
                <BodyLong spacing>
                    Ser du en arbeidsplass du kunne tenke deg å jobbe hos? Ring, send en melding eller stikk innom.
                    Initiativ kan gjøre at du blir lagt merke til.
                </BodyLong>
                <Heading size="medium" level="2" spacing>
                    Husk
                </Heading>
                <BodyLong>
                    Du trenger ikke en perfekt CV for å få jobb. Det viktigste er å vise at du er motivert, positiv og
                    klar for å lære. Den første jobben starter ofte med at du tør å ta kontakt eller sende den første
                    søknaden.
                </BodyLong>
            </ArticleWrapper>
        </>
    );
}
