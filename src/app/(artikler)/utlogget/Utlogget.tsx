import { BodyLong, Heading } from "@navikt/ds-react";
import { WavingFigure } from "@navikt/arbeidsplassen-react";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";

type Props = {
    readonly timeout: boolean;
    readonly meta: PageInfo;
};

export default function Utlogget({ timeout, meta }: Props) {
    return (
        <ArticleWrapper className="text-center">
            <WavingFigure className="mb-8" />
            <Heading spacing size="large" level="1">
                {meta.title}
            </Heading>
            <BodyLong>
                {timeout ? "Av sikkerhetsgrunner har du blitt automatisk logget ut. " : ""}
                Takk for denne gang.
            </BodyLong>
        </ArticleWrapper>
    );
}
