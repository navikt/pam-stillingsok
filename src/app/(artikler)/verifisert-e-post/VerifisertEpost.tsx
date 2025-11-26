import { BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import { CelebratingFigure } from "@navikt/arbeidsplassen-react";
import NextLink from "next/link";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";

type Props = {
    readonly meta: PageInfo;
};
export default function VerifisertEpost({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language} className="container-small mt-16 mb-16">
            <VStack align="center">
                <CelebratingFigure className="mb-8" />
                <Heading spacing size="large" level="1" className="text-center">
                    {meta.title}
                </Heading>
                <BodyLong className="mb-8 text-center">
                    Du vil nå kunne motta e-postvarsler på dine lagrede søk.
                </BodyLong>
                <Button variant="primary" as={NextLink} href="/stillinger" role="link">
                    Gå til ledige stillinger
                </Button>
            </VStack>
        </ArticleWrapper>
    );
}
