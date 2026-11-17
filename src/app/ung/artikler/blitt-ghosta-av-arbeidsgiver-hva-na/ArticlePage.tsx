import { Bleed, BodyLong, Heading, VStack } from "@navikt/ds-react";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import ContentSection from "@/app/_common/ContentSection/ContentSection";
import QbrickVideo from "@/app/_common/QbrickVideo/QbrickVideo";
import TipsList from "@/app/_common/TipsList/TipsList";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import GhostedEmployerCallout from "@/app/ung/artikler/blitt-ghosta-av-arbeidsgiver-hva-na/_components/GhostedEmployerCallout";
import { tipsList } from "@/app/ung/artikler/blitt-ghosta-av-arbeidsgiver-hva-na/data";

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
                    <VStack gap="space-48">
                        <ContentSection
                            as="div"
                            surface="blueSubtle"
                            padding="space-0"
                            width="text"
                            paddingBlock="space-48 space-48"
                        >
                            <div style={{ maxWidth: "343px", width: "100%", margin: "0 auto" }}>
                                <QbrickVideo
                                    mediaId="f2ae8eb5-bd00-465b-9152-1e46edec1d59"
                                    title="Blitt ghosta av arbeidsgiver (varighet 1 min)"
                                    format="portrait"
                                    posterUrl="/images/video-thumbnail-blitt-ghosta.jpg"
                                    trackingData={{
                                        provider: "qbrick",
                                        articleSlug: "blitt-ghosta-av-arbeidsgiver-hva-na",
                                        videoId: "f2ae8eb5-bd00-465b-9152-1e46edec1d59",
                                        videoTitle: "Blitt ghosta av arbeidsgiver",
                                        section: "ung",
                                        location: "hero",
                                        trigger: "play",
                                    }}
                                />
                            </div>
                        </ContentSection>

                        <ContentSection
                            as="div"
                            surface="blueSubtle"
                            padding="space-0"
                            width="text"
                            paddingBlock="space-40 space-0"
                        >
                            <GhostedEmployerCallout />
                        </ContentSection>
                    </VStack>
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
