import { LinkCard, Stack } from "@navikt/ds-react";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { LinkCardAnchor, LinkCardDescription, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import React from "react";

type Props = {
    readonly meta: PageInfo;
};
export default function VelgRolle({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language} title={meta.title} width="lg">
            <Stack direction={{ xs: "column", md: "row" }} gap="space-16">
                <LinkCard className="arb-link-panel-primary flex-1">
                    <LinkCardTitle>
                        <LinkCardAnchor href="/oauth2/login?redirect=/min-side">Jeg er jobbsøker</LinkCardAnchor>
                    </LinkCardTitle>
                    <LinkCardDescription>Logg inn på min side</LinkCardDescription>
                </LinkCard>

                <LinkCard className="arb-link-panel-primary flex-1">
                    <LinkCardTitle>
                        <LinkCardAnchor href="/oauth2/login?redirect=/stillingsregistrering">
                            Jeg er arbeidsgiver
                        </LinkCardAnchor>
                    </LinkCardTitle>
                    <LinkCardDescription>Logg inn på min bedriftsside</LinkCardDescription>
                </LinkCard>
            </Stack>
        </ArticleWrapper>
    );
}
