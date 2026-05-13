import { WorriedFigure } from "@navikt/arbeidsplassen-react";
import { BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";

type Props = {
    readonly meta: PageInfo;
};
export default function EpostVerifiseringUtgaatt({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language}>
            <VStack align="center">
                <WorriedFigure className="mb-8" />
                <Heading spacing size="large" level="1" className="text-center">
                    {meta.title}
                </Heading>
                <BodyLong className="mb-8 text-center">
                    Du kan sende en ny bekreftelse inne i samtykker og innstillinger.
                </BodyLong>

                <Button variant="primary" as="a" href="/min-side/innstillinger">
                    Gå til samtykker og innstillinger
                </Button>
            </VStack>
        </ArticleWrapper>
    );
}
