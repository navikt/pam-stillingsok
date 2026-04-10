import React from "react";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { BodyLong, Heading, HGrid, LinkCard, Show } from "@navikt/ds-react";
import QbrickVideo from "@/app/_common/QbrickVideo/QbrickVideo";
import { LinkCardIcon, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import FigureHoldingFlower from "@/features/ung/ui/FigureHoldingFlower";
import ContentSection from "@/app/_common/ContentSection/ContentSection";
import TipsList from "@/app/_common/TipsList/TipsList";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { tipsList } from "@/app/ung/artikler/5-tips-til-deg-som-skal-soke-sommerjobb/data";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import TrackedUngArticleCtaLink from "@/app/ung/artikler/_components/TrackedUngArticleCtaLink";

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
                    En god søknad handler mer om motivasjon enn erfaring. Her er tipsene som hjelper deg i gang.
                </BodyLong>

                <HGrid
                    gap="space-16"
                    columns={{ xs: 1, md: 2 }}
                    align="center"
                    marginBlock={{ xs: "space-40", md: "space-64" }}
                >
                    <QbrickVideo
                        mediaId="b87f69fe-5b28-40e6-8446-6e08c8beb3d5"
                        title="5 tips til deg som skal søke sommerjobb (varighet 1 min)"
                        format="portrait"
                        posterUrl="/images/video-thumbnail-sommerjobb-tips.jpeg"
                        trackingData={{
                            articleSlug: "5-tips-til-deg-som-skal-soke-sommerjobb",
                            videoId: "b87f69fe-5b28-40e6-8446-6e08c8beb3d5",
                            videoTitle: "Noen tips om hvordan du kan finne jobb og sommerjobb",
                            section: "ung",
                            location: "hero",
                            trigger: "play",
                        }}
                    />

                    <BodyLong>
                        Nye muligheter dukker opp hele tida og arbeidsgivere legger ut ledige jobber på
                        <AkselNextLink href="/">arbeidsplassen.no</AkselNextLink> hver dag. I tillegg samler vi inn
                        stillinger fra mange andre steder, så du får full oversikt på ett sted.
                        <br />
                        <br />
                        Er du under 18 år? Bruk filteret «Kan passe for deg under 18». Da får du opp jobber som er
                        aktuelle for deg. Enklere, raskere – og mindre stress.
                    </BodyLong>
                </HGrid>

                <LinkCard data-ung-link-card="blue">
                    <LinkCardIcon>
                        <Show above="md">
                            <FigureHoldingFlower />{" "}
                        </Show>
                    </LinkCardIcon>

                    <LinkCardTitle>
                        <TrackedUngArticleCtaLink
                            href="/sommerjobb"
                            trackingData={{
                                articleSlug: "5-tips-til-deg-som-skal-soke-sommerjobb",
                                ctaId: "utforsk-sommerjobber-naer-deg",
                                ctaLabel: "Utforsk sommerjobber nær deg",
                                destination: "sommerjobber",
                                href: "/sommerjobb",
                            }}
                        >
                            Utforsk sommerjobber nær deg
                        </TrackedUngArticleCtaLink>
                    </LinkCardTitle>
                </LinkCard>
            </ArticleWrapper>
            <ContentSection
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
