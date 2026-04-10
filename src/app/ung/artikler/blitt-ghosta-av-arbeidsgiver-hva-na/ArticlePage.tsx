import React from "react";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { Bleed, BodyLong, Heading } from "@navikt/ds-react";
import ContentSection from "@/app/_common/ContentSection/ContentSection";
import TipsList from "@/app/_common/TipsList/TipsList";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { tipsList } from "@/app/ung/artikler/blitt-ghosta-av-arbeidsgiver-hva-na/data";
import InfoCardWithThinkingFigure from "@/app/ung/artikler/blitt-ghosta-av-arbeidsgiver-hva-na/_components/InfoCardWithThinkingFigure";

type Props = {
    readonly meta: PageInfo;
};
function ArticlePage({ meta }: Props) {
    return (
        <div>
            <ArticleWrapper lang={meta.language}>
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>

                <BodyLong size="large" spacing>
                    Mange opplever å ikke få svar etter å ha søkt jobb. Her er hva du kan gjøre når du ikke får svar.
                </BodyLong>

                <Bleed marginInline="full">
                    <ContentSection
                        as="section"
                        surface="blueSubtle"
                        padding="space-0"
                        width="text"
                        ariaLabel="5 tips til deg som søker sommerjobb"
                        paddingBlock="space-40 space-0"
                    >
                        <InfoCardWithThinkingFigure />
                    </ContentSection>
                </Bleed>
            </ArticleWrapper>
            <ContentSection
                heading="Dette kan du gjøre"
                as="section"
                surface="peachSubtle"
                width="text"
                ariaLabel="5 tips til deg som søker sommerjobb"
                paddingBlock={{ xs: "space-32" }}
            >
                <TipsList tips={tipsList} aria-label="5 tips til deg som søker sommerjobb" />
            </ContentSection>
        </div>
    );
}

export default ArticlePage;
