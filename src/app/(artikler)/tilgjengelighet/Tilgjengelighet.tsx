import { BodyLong } from "@navikt/ds-react";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

type Props = {
    readonly meta: PageInfo;
};

export default function Tilgjengelighet({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language} title={meta.title}>
            <BodyLong>
                Arbeidsplassen.no er etter beste evne utviklet i tråd med forskrift om universell utforming av IKT. Les
                vår{" "}
                <AkselNextLink href="https://uustatus.no/nb/erklaringer/publisert/9f7beaf9-ea64-4a93-8e20-8282f8fd1fce">
                    tilgjengelighetserklæring på uustatus.no
                </AkselNextLink>
            </BodyLong>
        </ArticleWrapper>
    );
}
