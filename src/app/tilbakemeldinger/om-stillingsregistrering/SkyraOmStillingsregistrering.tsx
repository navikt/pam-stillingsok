"use client";

import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { SkyraSurveyEmbed } from "@/app/tilbakemeldinger/_skyra/SkyraSurveyEmbed";

type Props = {
    readonly meta: PageInfo;
};

function SkyraOmStillingsregistrering({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language} title={meta.title}>
            <SkyraSurveyEmbed
                slug="arbeids-og-velferdsetaten-nav/tilbakemeldinger-stillingsregistrering"
                lang={meta.language}
            />
        </ArticleWrapper>
    );
}

export default SkyraOmStillingsregistrering;
