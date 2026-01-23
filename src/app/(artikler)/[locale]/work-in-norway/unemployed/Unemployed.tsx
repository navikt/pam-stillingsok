"use client";

import { BodyShort, Heading, BodyLong, Link, HGrid, LinkCard } from "@navikt/ds-react";
import { getTranslation } from "@/app/(artikler)/[locale]/work-in-norway/_common/translate";
import TableOfContents from "@/app/(artikler)/[locale]/work-in-norway/_common/TableOfContents";
import { TranslationResult } from "@/app/(artikler)/[locale]/work-in-norway/_common/types";
import { PageBlock } from "@navikt/ds-react/Page";
import { ReadableWidth } from "@/app/_common/ReadableWidth/ReadableWidth";
import { LinkCardAnchor, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import React from "react";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";

export default function Unemployed({ locale, translations }: { locale: string; translations: TranslationResult }) {
    const { t } = getTranslation(translations);

    return (
        <article className="ukraine-page" lang={locale}>
            <PageBlock as="header" width="xl" gutters className="green-box green-box-inner">
                <Heading size="small" level="1" className="mb-1">
                    {t("unemployed-title", { ns: "work-in-norway" })}
                </Heading>
                <BodyShort>{t("ukrainian-work-in-norway-title", { ns: "work-in-norway" })}</BodyShort>
            </PageBlock>
            <PageBlock as="div" width="xl" gutters>
                <HGrid gap="space-20" columns={{ sm: 1, md: "1fr 2fr" }}>
                    <TableOfContents locale={locale} selectorPrefix="main" />
                    <ReadableWidth>
                        <section>
                            <Heading id="unemployed" size="large" level="2" spacing>
                                {t("h2-unemployed.title")}
                            </Heading>
                            <BodyLong spacing>{t("h2-unemployed.p")}</BodyLong>

                            <Heading size="small" level="3" spacing>
                                {t("h3-benefit.title")}
                            </Heading>
                            <BodyLong spacing>
                                {t("h3-benefit.p-1")}
                                <Link
                                    className="display-inline"
                                    href="https://www.nav.no/arbeidsledig-permittert"
                                    hrefLang="no"
                                >
                                    {t("h3-benefit.1-link-title")}
                                </Link>{" "}
                                {t("h3-benefit.p-2")}{" "}
                                <Link
                                    className="display-inline"
                                    href="https://www.nav.no/arbeid/registrering"
                                    hrefLang="no"
                                >
                                    {t("h3-benefit.2-link-title")}
                                </Link>{" "}
                                {t("h3-benefit.p-3")}
                            </BodyLong>

                            <Heading size="small" level="3" spacing>
                                {t("h3-info.title")}
                            </Heading>
                            <BodyLong spacing>{t("h3-info.p")}</BodyLong>

                            <Heading size="small" level="3" spacing>
                                {t("h3-news-articles", { ns: "work-in-norway" })}
                            </Heading>
                            <div className="article-link-panel-container mb-12">
                                <LinkCard className="arb-link-panel-tertiary">
                                    <LinkCardTitle>
                                        <AkselNextLinkCardAnchor
                                            href="/stillinger?workLanguage=Engelsk&v=2"
                                            hrefLang="nb"
                                        >
                                            {t("1-link-panels.1-title")}
                                        </AkselNextLinkCardAnchor>
                                    </LinkCardTitle>
                                </LinkCard>
                            </div>
                        </section>
                        <section>
                            <Heading id="support" size="large" level="2" spacing>
                                {t("h2-support.title")} (Nav)
                            </Heading>
                            <BodyLong spacing>{t("h2-support.p1")}</BodyLong>
                            <BodyLong spacing>{t("h2-support.p2")}</BodyLong>
                            <BodyLong spacing>
                                {t("h2-support.p3-1")}{" "}
                                <Link
                                    className="display-inline"
                                    href="https://www.nav.no/opplysning-rad-veiledning/en"
                                    hrefLang="en"
                                >
                                    {t("h2-support.p3-link-title")}
                                </Link>{" "}
                                {t("h2-support.p3-2")}
                            </BodyLong>

                            <Heading size="small" level="3" spacing>
                                {t("h3-news-articles", { ns: "work-in-norway" })}
                            </Heading>
                            <div className="article-link-panel-container mb-12">
                                <LinkCard className="arb-link-panel-tertiary">
                                    <LinkCardTitle>
                                        <LinkCardAnchor href={t("2-link-panels.1-link")} hrefLang="nb">
                                            {t("2-link-panels.1-title")}
                                        </LinkCardAnchor>
                                    </LinkCardTitle>
                                </LinkCard>

                                <LinkCard className="arb-link-panel-tertiary">
                                    <LinkCardTitle>
                                        <LinkCardAnchor href="https://www.nav.no/tjenester/en" hrefLang="nb">
                                            {t("2-link-panels.2-title")}
                                        </LinkCardAnchor>
                                    </LinkCardTitle>
                                </LinkCard>
                            </div>
                        </section>
                    </ReadableWidth>
                </HGrid>
            </PageBlock>
        </article>
    );
}
