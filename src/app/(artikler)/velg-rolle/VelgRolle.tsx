import { Stack } from "@navikt/ds-react";
import { LinkPanel, LinkPanelTitle, LinkPanelDescription } from "@navikt/ds-react/LinkPanel";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";

type Props = {
    readonly meta: PageInfo;
};
export default function VelgRolle({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language} title={meta.title} className="container-medium mt-5 mb-24">
            <Stack direction={{ xs: "column", md: "row" }} gap="4">
                <LinkPanel href="/oauth2/login?redirect=/min-side" className="arb-link-panel-secondary flex-1">
                    <LinkPanelTitle>Jeg er jobbsøker</LinkPanelTitle>
                    <LinkPanelDescription>Logg inn på min side</LinkPanelDescription>
                </LinkPanel>

                <LinkPanel
                    href="/oauth2/login?redirect=/stillingsregistrering"
                    className="arb-link-panel-secondary flex-1"
                >
                    <LinkPanelTitle>Jeg er arbeidsgiver</LinkPanelTitle>
                    <LinkPanelDescription>Logg inn på min bedriftsside</LinkPanelDescription>
                </LinkPanel>
            </Stack>
        </ArticleWrapper>
    );
}
