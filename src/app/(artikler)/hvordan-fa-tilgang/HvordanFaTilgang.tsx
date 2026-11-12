import { BodyLong, Heading, Link, List, VStack } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";

type Props = {
    readonly meta: PageInfo;
};
export default function HvordanFaTilgang({ meta }: Props) {
    return (
        <ArticleWrapper title={meta.title} lang={meta.language}>
            <VStack gap="space-24">
                <VStack gap="space-16">
                    <BodyLong>Personen som skal gi deg tilgang må enten være:</BodyLong>
                    <List>
                        <ListItem>
                            registrert i Enhetsregisteret som daglig leder, styreleder, bestyrende reder eller
                            innehaver.
                        </ListItem>
                        <ListItem>registrert som hovedadministrator i Altinn, eller</ListItem>
                        <ListItem>
                            registrert med Altinn-tilgangspakken «Tilgangsstyring», og i tillegg enten
                            «Stillingsannonser på arbeidsplassen.no» eller tilgangspakken «Ansettelsesforhold.
                        </ListItem>
                    </List>
                </VStack>

                <Heading level="2" size="large" spacing>
                    Hva må personen som skal gi deg tilgang gjøre?
                </Heading>
            </VStack>
            <BodyLong spacing>
                Personen som skal gi tilgang må logge inn i Altinn og følge en enkel trinn-for-trinn-guide. Guiden
                finner du på Altinns nettsider her:{" "}
                <Link
                    inlineText
                    href="https://info.altinn.no/hjelp/tilgang-og-fullmakt/#gi-eller-be-om-fullmakt-til-tilgangspakker"
                >
                    https://info.altinn.no/hjelp/tilgang-og-fullmakt/#gi-eller-be-om-fullmakt-til-tilgangspakker
                </Link>
            </BodyLong>
        </ArticleWrapper>
    );
}
