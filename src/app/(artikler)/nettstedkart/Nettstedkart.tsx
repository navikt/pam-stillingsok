import { Heading, Link as AkselLink, BodyShort, BodyLong, List } from "@navikt/ds-react";
import NextLink from "next/link";

import styles from "./nettstedkart.module.css";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { buildSiteMapGroups } from "@/app/(artikler)/buildSiteMap";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { ListItem } from "@navikt/ds-react/List";

type Props = {
    readonly meta: PageInfo;
};
export function Nettstedkart({ meta }: Props): JSX.Element {
    const groups = buildSiteMapGroups({ basePath: "" });

    return (
        <ArticleWrapper lang={meta.language} title={meta.title}>
            <BodyLong spacing size="large">
                Her finner du en oversikt over informasjonssider og hjelpesider på arbeidsplassen.no.
            </BodyLong>
            <BodyLong spacing>
                Scroll nedover på siden, eller bruk nettleseren sitt innebygde søk (CTRL+F) for å finne det du leter
                etter
            </BodyLong>

            <div className={styles.grid}>
                {groups.map((group) => (
                    <section key={group.id} aria-labelledby={`site-map-${group.id}`}>
                        <Heading id={`site-map-${group.id}`} level="2" size="medium" spacing>
                            {group.heading}
                        </Heading>
                        {group.description != null ? <BodyShort>{group.description}</BodyShort> : null}

                        <List>
                            {group.entries.map((entry) => (
                                <ListItem key={entry.href}>
                                    <AkselLink as={NextLink} href={entry.href} prefetch={true}>
                                        {entry.title}
                                    </AkselLink>
                                </ListItem>
                            ))}
                        </List>
                    </section>
                ))}
            </div>
        </ArticleWrapper>
    );
}
