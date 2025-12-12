import { Heading, BodyShort, BodyLong, List, HGrid } from "@navikt/ds-react";

import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { buildSiteMapGroups } from "@/app/(artikler)/siteMap/buildSiteMap";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { ListItem } from "@navikt/ds-react/List";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

type Props = {
    readonly meta: PageInfo;
};
export async function Nettstedkart({ meta }: Props) {
    const groups = await buildSiteMapGroups({ basePath: "" });

    return (
        <ArticleWrapper lang={meta.language} title={meta.title} width="lg">
            <BodyLong spacing size="large">
                Her finner du en oversikt over informasjonssider og hjelpesider på arbeidsplassen.no.
            </BodyLong>
            <BodyLong spacing>
                Scroll nedover på siden, eller bruk nettleseren sitt innebygde søk (CTRL+F) for å finne det du leter
                etter
            </BodyLong>

            <HGrid gap="space-24" columns={{ sm: 1, md: 2 }}>
                {groups.map((group) => (
                    <section key={group.id} aria-labelledby={`site-map-${group.id}`}>
                        <Heading id={`site-map-${group.id}`} level="2" size="medium" spacing>
                            {group.heading}
                        </Heading>
                        {group.description != null ? <BodyShort>{group.description}</BodyShort> : null}

                        <List>
                            {group.entries.map((entry) => (
                                <ListItem key={entry.href}>
                                    <AkselNextLink href={entry.href} prefetch>
                                        {entry.title}
                                    </AkselNextLink>
                                </ListItem>
                            ))}
                        </List>
                    </section>
                ))}
            </HGrid>
        </ArticleWrapper>
    );
}
