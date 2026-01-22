"use client";

import { BodyShort, Heading, BodyLong, Link, HGrid, LinkCard } from "@navikt/ds-react";
import { getTranslation } from "@/app/(artikler)/[locale]/work-in-norway/_common/translate";
import TableOfContents from "@/app/(artikler)/[locale]/work-in-norway/_common/TableOfContents";
import { TranslationResult } from "@/app/(artikler)/[locale]/work-in-norway/_common/types";
import { PageBlock } from "@navikt/ds-react/Page";
import { ReadableWidth } from "@/app/_common/ReadableWidth/ReadableWidth";
import { FilePdfIcon } from "@navikt/aksel-icons";

export default function StartingANewJob({ locale, translations }: { locale: string; translations: TranslationResult }) {
    const { t } = getTranslation(translations);

    return (
        <article className="ukraine-page" lang={locale}>
            <PageBlock as="header" width="xl" gutters className="green-box green-box-inner">
                <Heading size="small" level="1" className="mb-1">
                    {t("starting-a-new-job-title", { ns: "work-in-norway" })}
                </Heading>
                <BodyShort>{t("ukrainian-work-in-norway-title", { ns: "work-in-norway" })}</BodyShort>
            </PageBlock>
            <PageBlock as="div" width="xl" gutters>
                <HGrid gap="space-20" columns={{ sm: 1, md: "1fr 2fr" }}>
                    <TableOfContents locale={locale} selectorPrefix="main" />
                    <ReadableWidth>
                        <section>
                            <Heading id="start-working" size="large" level="2" spacing>
                                {t("h2-start-working")}
                            </Heading>
                            <Heading size="small" level="3" spacing>
                                {t("h3-bank-account.title")} (bankkonto)
                            </Heading>
                            <BodyLong spacing>{t("h3-bank-account.p1")}</BodyLong>
                            <BodyLong spacing>
                                <Link
                                    className="display-inline"
                                    href="https://www.finansnorge.no/tema/ny-i-norge/artikkel-bli-bankkunde-i-norge/"
                                    hrefLang="no"
                                >
                                    {t("h3-bank-account.a")}
                                </Link>
                            </BodyLong>
                            <BodyLong spacing>{t("h3-bank-account.p2")}</BodyLong>
                            <Heading size="small" level="3" spacing>
                                {t("h3-tax.title")} (skattekort)
                            </Heading>
                            <BodyLong spacing>{t("h3-tax.p1")}</BodyLong>
                            <BodyLong spacing>{t("h3-tax.p2")}</BodyLong>
                            <Heading size="small" level="3" spacing>
                                {t("h3-contract.title")} (arbeidskontrakt)
                            </Heading>
                            <BodyLong spacing>{t("h3-contract.p")}</BodyLong>
                            <Heading size="small" level="3" spacing>
                                {t("h3-news-articles", { ns: "work-in-norway" })}
                            </Heading>
                            <div className="article-link-panel-container mb-12">
                                <LinkCard className="arb-link-panel-tertiary">
                                    <LinkCard.Title>
                                        <LinkCard.Anchor
                                            href="https://www.finansportalen.no/bank/dagligbank/"
                                            hrefLang="nb"
                                        >
                                            {t("1-link-panels.1-title")}
                                        </LinkCard.Anchor>
                                    </LinkCard.Title>
                                </LinkCard>

                                <LinkCard className="arb-link-panel-tertiary">
                                    <LinkCard.Title>
                                        <LinkCard.Anchor
                                            href="https://www.skatteetaten.no/en/person/foreign/are-you-intending-to-work-in-norway/tax-deduction-cards"
                                            hrefLang="en"
                                        >
                                            {t("1-link-panels.2-title")}
                                        </LinkCard.Anchor>
                                    </LinkCard.Title>
                                </LinkCard>

                                <LinkCard className="arb-link-panel-tertiary">
                                    <LinkCard.Title>
                                        <LinkCard.Anchor
                                            href="https://www.arbeidstilsynet.no/en/working-conditions/contract-of-employment/"
                                            hrefLang="en"
                                        >
                                            {t("1-link-panels.3-title")}
                                        </LinkCard.Anchor>
                                    </LinkCard.Title>
                                </LinkCard>
                            </div>
                        </section>
                        <section>
                            <Heading id="rights" size="large" level="2" spacing>
                                {t("h2-rights.title")}
                            </Heading>
                            <BodyLong spacing>{t("h2-rights.p1")}</BodyLong>
                            <BodyLong spacing>
                                {t("h2-rights.p2")}{" "}
                                <Link
                                    className="display-inline"
                                    href="https://www.arbeidstilsynet.no/en/working-conditions/pay-and-minimum-rates-of-pay/minimum-wage/"
                                    hrefLang="en"
                                >
                                    {t("h2-rights.p2-link-title")}
                                </Link>
                            </BodyLong>
                            <BodyLong spacing>
                                {t("h2-rights.p3-1")}{" "}
                                <Link className="display-inline" href={t("h2-rights.p3-link")}>
                                    {t("h2-rights.p3-link-title")}
                                </Link>{" "}
                                {t("h2-rights.p3-2")}
                            </BodyLong>
                            <Link
                                hrefLang="uk"
                                href="https://www.youtube.com/playlist?list=PLcQRxNrcK73GjDweZyUUjSJRTFUWDJQzq"
                                className="mb-8"
                            >
                                {t("h2-rights.link-title")}
                            </Link>
                            <Heading size="small" level="3" spacing>
                                {t("h3-news-articles", { ns: "work-in-norway" })}
                            </Heading>
                            <div className="article-link-panel-container mb-12">
                                <LinkCard className="arb-link-panel-tertiary">
                                    <LinkCard.Title>
                                        <LinkCard.Anchor href={t("2-link-panel.link")} hrefLang="en">
                                            {t("2-link-panel.title")}
                                        </LinkCard.Anchor>
                                    </LinkCard.Title>
                                </LinkCard>
                            </div>
                        </section>
                        <section>
                            <Heading id="sick-leave" size="large" level="2" spacing>
                                {t("h2-sick-leave.title")}
                            </Heading>
                            <BodyLong spacing>{t("h2-sick-leave.p1")}</BodyLong>
                            <BodyLong spacing>{t("h2-sick-leave.p2")} </BodyLong>
                            <Heading size="small" level="3" spacing>
                                {t("h3-news-articles", { ns: "work-in-norway" })}
                            </Heading>
                            <div className="article-link-panel-container mb-12">
                                <LinkCard className="arb-link-panel-tertiary">
                                    <LinkCard.Title>
                                        <LinkCard.Anchor href="https://www.nav.no/tjenester/en" hrefLang="en">
                                            {t("3-link-panel-title")}
                                        </LinkCard.Anchor>
                                    </LinkCard.Title>
                                </LinkCard>
                            </div>
                        </section>
                        <section>
                            <Heading id="establish-business" size="large" level="2" spacing>
                                {t("h2-establish-business.title")}
                            </Heading>
                            <BodyLong spacing>{t("h2-establish-business.p1")}</BodyLong>
                            <BodyLong spacing>
                                {" "}
                                <Link
                                    className="display-inline"
                                    href="https://www.altinn.no/en/start-and-run-business/planning-starting/"
                                    hrefLang="en"
                                >
                                    {" "}
                                    {t("h2-establish-business.p2-link-title")}
                                </Link>{" "}
                                {t("h2-establish-business.p2")}
                            </BodyLong>
                            <Heading size="small" level="3" spacing>
                                {t("h3-news-articles", { ns: "work-in-norway" })}
                            </Heading>
                            <div className="article-link-panel-container mb-12">
                                <LinkCard className="arb-link-panel-tertiary">
                                    <LinkCard.Title>
                                        <LinkCard.Anchor
                                            href="https://www.altinn.no/en/start-and-run-business/planning-starting/before-start-up/startup-tutorial-for-sole-proprietorships/"
                                            hrefLang="en"
                                        >
                                            {t("4-link-panel-title")}
                                        </LinkCard.Anchor>
                                    </LinkCard.Title>
                                </LinkCard>
                            </div>
                        </section>
                        <section>
                            <Heading id="work-intro-prog" size="large" level="2" spacing>
                                {t("h2-work-intro-prog.title")}
                            </Heading>
                            <BodyLong spacing>{t("h2-work-intro-prog.p")}</BodyLong>
                            <Heading size="small" level="3" spacing>
                                {t("h3-news-articles", { ns: "work-in-norway" })}
                            </Heading>
                            <div className="article-link-panel-container mb-12">
                                <LinkCard className="arb-link-panel-tertiary">
                                    <LinkCard.Icon>
                                        <FilePdfIcon fontSize="2rem" />
                                    </LinkCard.Icon>
                                    <LinkCard.Title>
                                        <LinkCard.Anchor href={t("5-link-panel.link")} hrefLang="en">
                                            {t("5-link-panel.title")} (pdf)
                                        </LinkCard.Anchor>
                                    </LinkCard.Title>
                                </LinkCard>
                            </div>
                        </section>
                    </ReadableWidth>
                </HGrid>
            </PageBlock>
        </article>
    );
}
