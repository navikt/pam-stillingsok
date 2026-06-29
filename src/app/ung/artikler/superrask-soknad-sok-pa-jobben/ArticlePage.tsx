import superraskSoknad from "@images/superrask-soknad.jpg";
import { Bleed, BodyLong, Heading, Link } from "@navikt/ds-react";
import Image from "next/image";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import ContentSection from "@/app/_common/ContentSection/ContentSection";
import TipsList from "@/app/_common/TipsList/TipsList";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import SuperraskSoknadCallout from "@/app/ung/artikler/superrask-soknad-sok-pa-jobben/_components/SuperraskSoknadCallout";
import { tipsList } from "@/app/ung/artikler/superrask-soknad-sok-pa-jobben/data";

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

                <BodyLong size="large" className="mb-12">
                    Er du på jakt etter sommerjobb? Eller kanskje du leter etter din aller første jobb?
                </BodyLong>

                <Image
                    className="box-link-image mb-10"
                    src={superraskSoknad}
                    width={590}
                    height={448}
                    alt=""
                    unoptimized
                    quality={75}
                    loading="eager"
                />

                <BodyLong>
                    Da kan det være lurt å sjekke ut superrask søknad på{" "}
                    <Link href="https://arbeidsplassen.nav.no/ung">arbeidsplassen.no/ung</Link>. Du slipper å skrive en
                    lang søknad og legge ved CV. I stedet svarer du på noen korte spørsmål og forteller kort hvorfor du
                    passer til jobben.
                </BodyLong>
            </ArticleWrapper>

            <ContentSection
                className="mb-12"
                heading="Her er fem gode råd for å få mest mulig ut av å sende en superrask søknad"
                as="section"
                surface="peachSubtle"
                width="text"
                paddingBlock={{ xs: "space-32" }}
            >
                <TipsList
                    tips={tipsList}
                    aria-label="Her er fem gode råd for å få mest mulig ut av å sende en superrask søknad"
                />
            </ContentSection>

            <Bleed marginInline="full">
                <ContentSection
                    as="div"
                    surface="blueSubtle"
                    padding="space-0"
                    width="text"
                    paddingBlock="space-40 space-0"
                >
                    <SuperraskSoknadCallout />
                </ContentSection>
            </Bleed>
        </div>
    );
}
