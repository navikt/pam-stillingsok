import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Layout from "@/src/common/components/layout/Layout";
import Head from "next/head";
import { BodyLong, BodyShort, Heading, LinkPanel, Link as AkselLink } from "@navikt/ds-react";
import TableOfContents from "@/src/common/components/TableOfContents";

export default function Unemployed() {
    const { t } = useTranslation(["unemployed", "work-in-norway"]);
    const translationTitle = `${t("finding-a-job-title", { ns: "work-in-norway" })} - arbeidsplassen.no`;

    return (
        <Layout>
            <Head>
                <title>{translationTitle}</title>
            </Head>
            <div className="ukraine-page">
                <div className="green-box container-large">
                    <div className="green-box-inner">
                        <Heading size="small" level="1" className="mb-1">
                            {t("unemployed-title", { ns: "work-in-norway" })}
                        </Heading>
                        <BodyShort>{t("ukrainian-work-in-norway-title", { ns: "work-in-norway" })}</BodyShort>
                    </div>
                </div>
                <article className="container-large ukraine-page-main-container">
                    <TableOfContents selectorPrefix="main" />
                    <div className="container-small mt-5 mb-24 ukraine-page">
                        <Heading id="unemployed" size="large" level="2" spacing>
                            {t("h2-unemployed.title")}
                        </Heading>
                        <BodyLong spacing>{t("h2-unemployed.p")}</BodyLong>

                        <Heading size="small" level="3" spacing>
                            {t("h3-benefit.title")}
                        </Heading>
                        <BodyLong spacing>
                            {t("h3-benefit.p-1")}
                            <AkselLink
                                className="display-inline"
                                href="https://www.nav.no/arbeidsledig-permittert"
                                hrefLang="no"
                            >
                                {t("h3-benefit.1-link-title")}
                            </AkselLink>{" "}
                            {t("h3-benefit.p-2")}{" "}
                            <AkselLink
                                className="display-inline"
                                href="https://www.nav.no/arbeid/registrering"
                                hrefLang="no"
                            >
                                {t("h3-benefit.2-link-title")}
                            </AkselLink>{" "}
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
                            <LinkPanel
                                className="arb-link-panel-tertiary"
                                href="/stillinger?workLanguage=Engelsk&v=2"
                                hrefLang="no"
                            >
                                <LinkPanel.Title className="navds-heading--small">
                                    {t("1-link-panels.1-title")}
                                </LinkPanel.Title>
                            </LinkPanel>
                            <LinkPanel
                                className="arb-link-panel-tertiary"
                                href="https://www.nav.no/en/home/benefits-and-services/information-about-nav-s-services-and-benefits#chapter-1"
                                hrefLang="en"
                            >
                                <LinkPanel.Title className="navds-heading--small">
                                    {t("1-link-panels.2-title")}
                                </LinkPanel.Title>
                            </LinkPanel>
                        </div>

                        <Heading id="support" size="large" level="2" spacing>
                            {t("h2-support.title")} (Nav)
                        </Heading>
                        <BodyLong spacing>{t("h2-support.p1")}</BodyLong>
                        <BodyLong spacing>{t("h2-support.p2")}</BodyLong>
                        <BodyLong spacing>
                            {t("h2-support.p3-1")}{" "}
                            <AkselLink
                                className="display-inline"
                                href="https://www.nav.no/opplysning-rad-veiledning/en"
                                hrefLang="en"
                            >
                                {t("h2-support.p3-link-title")}
                            </AkselLink>{" "}
                            {t("h2-support.p3-2")}
                        </BodyLong>

                        <Heading size="small" level="3" spacing>
                            {t("h3-news-articles", { ns: "work-in-norway" })}
                        </Heading>
                        <div className="article-link-panel-container mb-12">
                            <LinkPanel className="arb-link-panel-tertiary" href={t("2-link-panels.1-link")}>
                                <LinkPanel.Title className="navds-heading--small">
                                    {t("2-link-panels.1-title")}
                                </LinkPanel.Title>
                            </LinkPanel>
                            <LinkPanel
                                className="text arb-link-panel-tertiary"
                                href="https://www.nav.no/en/home/benefits-and-services/information-about-nav-s-services-and-benefits"
                                hrefLang="en"
                            >
                                <LinkPanel.Title className="navds-heading--small">
                                    {t("2-link-panels.2-title")}
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
            ...(await serverSideTranslations(locale, ["unemployed", "work-in-norway"])),
        },
    };
}
