import React from "react";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { Bleed, BodyLong, Heading } from "@navikt/ds-react";
import ContentSection from "@/app/_common/ContentSection/ContentSection";
import TipsList from "@/app/_common/TipsList/TipsList";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { tipsList } from "@/app/ung/artikler/blitt-ghosta-av-arbeidsgiver-hva-na/data";
import GhostedEmployerCallout from "@/app/ung/artikler/blitt-ghosta-av-arbeidsgiver-hva-na/_components/GhostedEmployerCallout";

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
                    Mange opplever å ikke få svar etter å ha søkt jobb. Her er hva du kan gjøre når du ikke hører noe
                    fra arbeidsgiver.
                </BodyLong>

                <Bleed marginInline="full">
                    <ContentSection
                        as="div"
                        surface="blueSubtle"
                        padding="space-0"
                        width="text"
                        paddingBlock="space-40 space-0"
                    >
                        <GhostedEmployerCallout />
                    </ContentSection>
                </Bleed>
            </ArticleWrapper>
            <ContentSection
                heading="Dette kan du gjøre"
                as="section"
                surface="peachSubtle"
                width="text"
                paddingBlock={{ xs: "space-32" }}
            >
                <TipsList tips={tipsList} aria-label="Tips til deg som har blitt ghostet av arbeidsgiver" />
            </ContentSection>
        </div>
    );
}

export default ArticlePage;
