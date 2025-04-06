import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Layout from "@/src/common/components/layout/Layout";
import Head from "next/head";
import { BodyLong, BodyShort, Heading, LinkPanel, Link as AkselLink } from "@navikt/ds-react";
import TableOfContents from "@/src/common/components/TableOfContents";

export default function StartingANewJob() {
    const { t } = useTranslation(["starting-a-new-job", "work-in-norway"]);
    const translationTitle = `${t("starting-a-new-job-title", { ns: "work-in-norway" })} - arbeidsplassen.no`;

    return (
        <Layout>
            <Head>
                <title>{translationTitle}</title>
            </Head>
            <div className="ukraine-page">
                <div className="green-box container-large">
                    <div className="green-box-inner">
                        <Heading size="small" level="1" className="mb-1">
                            {t("starting-a-new-job-title", { ns: "work-in-norway" })}
                        </Heading>
                        <BodyShort>{t("ukrainian-work-in-norway-title", { ns: "work-in-norway" })}</BodyShort>
                    </div>
                </div>
                <article className="container-large ukraine-page-main-container">
                    <TableOfContents selectorPrefix="main" />
                    <div className="container-small mt-5 mb-24 ukraine-page">
                        <Heading id="start-working" size="large" level="2" spacing>
                            {t("h2-start-working")}
                        </Heading>
                        <Heading size="small" level="3" spacing>
                            {t("h3-bank-account.title")} (bankkonto)
                        </Heading>
                        <BodyLong spacing>{t("h3-bank-account.p1")}</BodyLong>
                        <BodyLong spacing>
                            <AkselLink
                                className="display-inline"
                                href="https://www.finansnorge.no/tema/ny-i-norge/artikkel-bli-bankkunde-i-norge/"
                                hrefLang="no"
                            >
                                {t("h3-bank-account.a")}
                            </AkselLink>
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
                            <LinkPanel
                                className="arb-link-panel-tertiary"
                                href="https://www.finansportalen.no/bank/dagligbank/"
                                hrefLang="no"
                            >
                                <LinkPanel.Title className="navds-heading--small">
                                    {t("1-link-panels.1-title")}
                                </LinkPanel.Title>
                            </LinkPanel>
                            <LinkPanel
                                className="arb-link-panel-tertiary"
                                href="https://www.skatteetaten.no/en/person/foreign/are-you-intending-to-work-in-norway/tax-deduction-cards"
                                hrefLang="en"
                            >
                                <LinkPanel.Title className="navds-heading--small">
                                    {t("1-link-panels.2-title")}
                                </LinkPanel.Title>
                            </LinkPanel>
                            <LinkPanel
                                className="arb-link-panel-tertiary"
                                href="https://www.arbeidstilsynet.no/en/working-conditions/contract-of-employment/"
                                hrefLang="en"
                            >
                                <LinkPanel.Title className="navds-heading--small">
                                    {t("1-link-panels.3-title")}
                                </LinkPanel.Title>
                            </LinkPanel>
                        </div>
                        <Heading id="rights" size="large" level="2" spacing>
                            {t("h2-rights.title")}
                        </Heading>
                        <BodyLong spacing>{t("h2-rights.p1")}</BodyLong>
                        <BodyLong spacing>
                            {t("h2-rights.p2")}{" "}
                            <AkselLink
                                className="display-inline"
                                href="https://www.arbeidstilsynet.no/en/working-conditions/pay-and-minimum-rates-of-pay/minimum-wage/"
                                hrefLang="en"
                            >
                                {t("h2-rights.p2-link-title")}
                            </AkselLink>
                        </BodyLong>
                        <BodyLong spacing>
                            {t("h2-rights.p3-1")}{" "}
                            <AkselLink className="display-inline" href={t("h2-rights.p3-link")}>
                                {t("h2-rights.p3-link-title")}
                            </AkselLink>{" "}
                            {t("h2-rights.p3-2")}
                        </BodyLong>
                        <AkselLink
                            hrefLang="uk"
                            href="https://www.youtube.com/playlist?list=PLcQRxNrcK73GjDweZyUUjSJRTFUWDJQzq"
                            className="mb-8"
                        >
                            {t("h2-rights.link-title")}
                        </AkselLink>
                        <Heading size="small" level="3" spacing>
                            {t("h3-news-articles", { ns: "work-in-norway" })}
                        </Heading>
                        <div className="article-link-panel-container mb-12">
                            <LinkPanel className="arb-link-panel-tertiary" href={t("2-link-panel.link")}>
                                <LinkPanel.Title className="navds-heading--small">
                                    {t("2-link-panel.title")}
                                </LinkPanel.Title>
                            </LinkPanel>
                        </div>
                        <Heading id="sick-leave" size="large" level="2" spacing>
                            {t("h2-sick-leave.title")}
                        </Heading>
                        <BodyLong spacing>{t("h2-sick-leave.p1")}</BodyLong>
                        <BodyLong spacing>{t("h2-sick-leave.p2")} </BodyLong>
                        <Heading size="small" level="3" spacing>
                            {t("h3-news-articles", { ns: "work-in-norway" })}
                        </Heading>
                        <div className="article-link-panel-container mb-12">
                            <LinkPanel
                                className="arb-link-panel-tertiary"
                                href="https://www.nav.no/en/home/benefits-and-services/Sickness-benefit-for-employees"
                                hrefLang="en"
                            >
                                <LinkPanel.Title className="navds-heading--small">
                                    {t("3-link-panel-title")}
                                </LinkPanel.Title>
                            </LinkPanel>
                        </div>
                        <Heading id="establish-business" size="large" level="2" spacing>
                            {t("h2-establish-business.title")}
                        </Heading>
                        <BodyLong spacing>{t("h2-establish-business.p1")}</BodyLong>
                        <BodyLong spacing>
                            {" "}
                            <AkselLink
                                className="display-inline"
                                href="https://www.altinn.no/en/start-and-run-business/planning-starting/"
                                hrefLang="en"
                            >
                                {" "}
                                {t("h2-establish-business.p2-link-title")}
                            </AkselLink>{" "}
                            {t("h2-establish-business.p2")}
                        </BodyLong>
                        <Heading size="small" level="3" spacing>
                            {t("h3-news-articles", { ns: "work-in-norway" })}
                        </Heading>
                        <div className="article-link-panel-container mb-12">
                            <LinkPanel
                                className="arb-link-panel-tertiary"
                                href="https://www.altinn.no/en/start-and-run-business/planning-starting/before-start-up/startup-tutorial-for-sole-proprietorships/"
                                hrefLang="en"
                            >
                                <LinkPanel.Title className="navds-heading--small">
                                    {t("4-link-panel-title")}
                                </LinkPanel.Title>
                            </LinkPanel>
                        </div>
                        <Heading id="work-intro-prog" size="large" level="2" spacing>
                            {t("h2-work-intro-prog.title")}
                        </Heading>
                        <BodyLong spacing>{t("h2-work-intro-prog.p")}</BodyLong>
                        <Heading size="small" level="3" spacing>
                            {t("h3-news-articles", { ns: "work-in-norway" })}
                        </Heading>
                        <div className="article-link-panel-container mb-12">
                            <LinkPanel className="arb-link-panel-tertiary" href={t("5-link-panel.link")}>
                                <LinkPanel.Title className="navds-heading--small">
                                    {t("5-link-panel.title")}
                                </LinkPanel.Title>
                            </LinkPanel>
                        </div>
                    </div>
                </article>
            </div>
        </Layout>
    );
}

export async function getStaticProps(context) {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale, ["starting-a-new-job", "work-in-norway"])),
        },
    };
}
