"use client";

import { BodyShort, LinkPanel, Heading, BodyLong, Link, HGrid } from "@navikt/ds-react";
import { getTranslation } from "@/app/(nonce)/(artikler)/[locale]/work-in-norway/_common/translate";
import TableOfContents from "@/app/(nonce)/(artikler)/[locale]/work-in-norway/_common/TableOfContents";
import { TranslationResult } from "@/app/(nonce)/(artikler)/[locale]/work-in-norway/_common/types";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { PageBlock } from "@navikt/ds-react/Page";
import { ReadableWidth } from "@/app/_common/ReadableWidth/ReadableWidth";

export default function FindingAJob({ locale, translations }: { locale: string; translations: TranslationResult }) {
    const { t } = getTranslation(translations);

    return (
        <article className="ukraine-page" lang={locale}>
            <PageBlock as="header" width="xl" gutters className="green-box green-box-inner">
                <Heading size="small" level="1" className="mb-1">
                    {t("finding-a-job-title", { ns: "work-in-norway" })}
                </Heading>
                <BodyShort>{t("ukrainian-work-in-norway-title", { ns: "work-in-norway" })}</BodyShort>
            </PageBlock>
            <PageBlock as="div" width="xl" gutters>
                <HGrid gap="space-20" columns={{ sm: 1, md: "1fr 2fr" }}>
                    <TableOfContents locale={locale} selectorPrefix="main" />
                    <ReadableWidth>
                        <section>
                            <Heading id="when-can-i-start-looking" size="large" level="2" spacing>
                                {t("h2-start-looking.title")}
                            </Heading>
                            <BodyLong spacing>
                                {t("h2-start-looking.p1")}{" "}
                                <Link className="display-inline" href={t("h2-start-looking.p1-link")}>
                                    {t("h2-start-looking.p1-link-text")}
                                </Link>{" "}
                                {t("h2-start-looking.p1-2")}
                            </BodyLong>
                            <BodyLong spacing>{t("h2-start-looking.p2")}</BodyLong>

                            <Heading size="small" level="3" spacing>
                                {t("h3-news-articles", { ns: "work-in-norway" })}
                            </Heading>
                            <div className="article-link-panel-container mb-12">
                                <LinkPanel className="arb-link-panel-tertiary" href={t("1-link-panels.1-link")}>
                                    <LinkPanel.Title className="navds-heading--small">
                                        {t("1-link-panels.1-title")}
                                    </LinkPanel.Title>
                                </LinkPanel>
                                <LinkPanel className="arb-link-panel-tertiary" href={t("1-link-panels.2-link")}>
                                    <LinkPanel.Title className="navds-heading--small">
                                        {t("1-link-panels.2-title")}
                                    </LinkPanel.Title>
                                </LinkPanel>
                                <LinkPanel className="arb-link-panel-tertiary" href={t("1-link-panels.3-link")}>
                                    <LinkPanel.Title className="navds-heading--small">
                                        {t("1-link-panels.3-title")}
                                    </LinkPanel.Title>
                                </LinkPanel>
                            </div>
                        </section>

                        <section>
                            <Heading id="where-can-i-find" size="large" level="2" spacing>
                                {t("h2-find-job.title")}
                            </Heading>
                            <BodyLong spacing>
                                {t("h2-find-job.p1")}{" "}
                                <AkselNextLink
                                    className="display-inline"
                                    hrefLang="no"
                                    href="/src/app/(nonce)/stillinger?workLanguage=Engelsk&v=2"
                                >
                                    {t("h2-find-job.p1-link-text")}
                                </AkselNextLink>{" "}
                                {t("h2-find-job.p1-after-link")}
                            </BodyLong>

                            <Heading size="small" level="3" spacing>
                                {t("h3-news-articles", { ns: "work-in-norway" })}
                            </Heading>
                            <div className="article-link-panel-container mb-12">
                                <LinkPanel
                                    className="arb-link-panel-tertiary"
                                    href="/stillinger?workLanguage=Engelsk&v=2"
                                    hrefLang="no"
                                >
                                    <LinkPanel.Title className="navds-heading--small">
                                        {t("2-link-panels.1-title")}
                                    </LinkPanel.Title>
                                </LinkPanel>
                            </div>
                        </section>

                        <section>
                            <Heading id="who-can-i-contact" size="large" level="2" spacing>
                                {t("h2-assistance.title")}
                            </Heading>
                            <BodyLong spacing>
                                {t("h2-assistance.p1")}{" "}
                                <Link className="display-inline" hrefLang="en" href="https://www.nav.no/kontaktoss/en">
                                    {t("h2-assistance.p1-link-text-1")}
                                </Link>{" "}
                                {t("h2-assistance.p1-2")}
                                <Link
                                    className="display-inline"
                                    href="https://www.nav.no/arbeid/registrering"
                                    hrefLang="no"
                                >
                                    {t("h2-assistance.p1-link-text-2")}
                                </Link>{" "}
                                {t("h2-assistance.p1-3")}
                            </BodyLong>

                            <BodyLong>{t("h2-assistance.p2")}</BodyLong>
                            <Link href={t("h2-assistance.link-3")} className="mb-8">
                                {t("h2-assistance.link-text-3")}
                            </Link>

                            <BodyLong>{t("h2-assistance.p3")}</BodyLong>
                            <Link href={t("h2-assistance.link-4")} className="mb-8">
                                {t("h2-assistance.link-text-4")}
                            </Link>

                            <BodyLong>{t("h2-assistance.p5")}</BodyLong>
                            <Link href={t("h2-assistance.link-5")} className="mb-8">
                                {t("h2-assistance.link-text-5")}
                            </Link>

                            <BodyLong spacing>{t("h2-assistance.p6")}</BodyLong>

                            <Heading size="small" level="3" spacing>
                                {t("h3-news-articles", { ns: "work-in-norway" })}
                            </Heading>
                            <div className="article-link-panel-container mb-12">
                                <LinkPanel
                                    className="arb-link-panel-tertiary"
                                    href="https://www.nav.no/sok-nav-kontor/en"
                                    hrefLang="en"
                                >
                                    <LinkPanel.Title className="navds-heading--small">
                                        {t("3-link-panels.1-title")}
                                    </LinkPanel.Title>
                                </LinkPanel>
                                <LinkPanel
                                    className="arb-link-panel-tertiary"
                                    href="https://www.nav.no/soker-jobb"
                                    hrefLang="no"
                                >
                                    <LinkPanel.Title className="navds-heading--small">
                                        {t("3-link-panels.2-title")}
                                    </LinkPanel.Title>
                                </LinkPanel>
                            </div>
                        </section>

                        <section>
                            <Heading id="where-can-i-work" size="large" level="2" spacing>
                                {t("h2-working-wo-norwegian.title")}
                            </Heading>
                            <BodyLong spacing>
                                {t("h2-working-wo-norwegian.p1")}{" "}
                                <AkselNextLink
                                    className="display-inline"
                                    href="/src/app/(nonce)/stillinger?workLanguage=Engelsk&v=2"
                                >
                                    {t("h2-working-wo-norwegian.p-link-text")}
                                </AkselNextLink>{" "}
                                {t("h2-working-wo-norwegian.p1-2")}
                            </BodyLong>
                            <BodyLong spacing>{t("h2-working-wo-norwegian.p2")}</BodyLong>

                            <Heading size="small" level="3" spacing>
                                {t("h3-norwegian-courses.title")}
                            </Heading>
                            <BodyLong spacing>
                                {t("h3-norwegian-courses.p1")}{" "}
                                <Link className="display-inline" href={t("h3-norwegian-courses.p1-link")}>
                                    {t("h3-norwegian-courses.p1-link-text")}
                                </Link>{" "}
                                {t("h3-norwegian-courses.p1-2")}
                            </BodyLong>

                            <Heading size="small" level="3" spacing>
                                {t("h3-news-articles", { ns: "work-in-norway" })}
                            </Heading>
                            <div className="article-link-panel-container mb-12">
                                <LinkPanel className="arb-link-panel-tertiary" href={t("4-link-panel.link")}>
                                    <LinkPanel.Title className="navds-heading--small">
                                        {t("4-link-panel.title")}
                                    </LinkPanel.Title>
                                </LinkPanel>
                            </div>
                        </section>
                    </ReadableWidth>
                </HGrid>
            </PageBlock>
        </article>
    );
}
