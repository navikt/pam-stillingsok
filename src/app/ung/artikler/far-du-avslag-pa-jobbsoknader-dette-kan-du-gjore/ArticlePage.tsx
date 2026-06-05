import { Bleed, BodyLong, Heading } from "@navikt/ds-react";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import ContentSection from "@/app/_common/ContentSection/ContentSection";
import QbrickVideo from "@/app/_common/QbrickVideo/QbrickVideo";
import TipsList from "@/app/_common/TipsList/TipsList";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { tipsList } from "@/app/ung/artikler/far-du-avslag-pa-jobbsoknader-dette-kan-du-gjore/data";

type Props = {
    readonly meta: PageInfo;
};
export default function ArticlePage({ meta }: Props) {
    return (
        <div>
            <ArticleWrapper lang={meta.language}>
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>

                <BodyLong size="large" spacing>
                    Det kan være tungt å få avslag når du søker jobb, og spesielt hvis du er ny i arbeidslivet. Mange
                    begynner å tvile på seg selv etter flere avslag.
                </BodyLong>

                <Bleed marginInline="full">
                    <ContentSection
                        className="mb-12"
                        as="div"
                        surface="blueSubtle"
                        padding="space-0"
                        width="text"
                        paddingBlock="space-40 space-40"
                    >
                        <QbrickVideo
                            mediaId="9df9557d-067a-42b8-979d-b50ff4a27e86"
                            title="Selv om du ikke får jobben (varighet 1 min)"
                            format="portrait"
                            posterUrl="/images/video-thumbnail-avslag-jobbsoknad.jpeg"
                            trackingData={{
                                articleSlug: "far-du-avslag-pa-jobbsoknader-dette-kan-du-gjore",
                                videoId: "b87f69fe-5b28-40e6-8446-6e08c8beb3d5",
                                videoTitle: "Selv om du ikke får jobben",
                                section: "ung",
                                location: "hero",
                                trigger: "play",
                            }}
                        />
                    </ContentSection>
                </Bleed>

                <BodyLong>
                    Husk at et avslag betyr ikke at du ikke er god nok. Det er helt normalt å bli skuffet eller lei seg.
                </BodyLong>
            </ArticleWrapper>

            <ContentSection
                as="section"
                surface="peachSubtle"
                width="text"
                ariaLabel="Selv om du ikke får jobben"
                paddingBlock={{ xs: "space-32" }}
            >
                <Heading size="large" level="2" spacing>
                    Her er fem råd som kan hjelpe deg videre
                </Heading>

                <TipsList tips={tipsList} aria-label="Selv om du ikke får jobben" />
            </ContentSection>
        </div>
    );
}
