import { BodyLong, Heading, VStack } from "@navikt/ds-react";
import { CelebratingFigure } from "@navikt/arbeidsplassen-react";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import StillingerLinkKnapp from "@/app/(static)/(artikler)/verifisert-e-post/StillingerLinkKnapp";

type Props = {
    readonly meta: PageInfo;
};
export default function VerifisertEpost({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language}>
            <VStack align="center">
                <CelebratingFigure className="mb-8" />
                <Heading spacing size="large" level="1" className="text-center">
                    {meta.title}
                </Heading>
                <BodyLong className="mb-8 text-center">
                    Du vil nå kunne motta e-postvarsler på dine lagrede søk.
                </BodyLong>
                <StillingerLinkKnapp />
            </VStack>
        </ArticleWrapper>
    );
}
