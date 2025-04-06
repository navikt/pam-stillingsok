import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Layout from "@/src/common/components/layout/Layout";
import Head from "next/head";
import { BodyLong, BodyShort, Heading, Link as AkselLink, LinkPanel } from "@navikt/ds-react";
import TableOfContents from "@/src/common/components/TableOfContents";

export default function FindingAJob() {
    const { t } = useTranslation(["finding-a-job", "work-in-norway"]);
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
                            {t("finding-a-job-title", { ns: "work-in-norway" })}
                        </Heading>
                        <BodyShort>{t("ukrainian-work-in-norway-title", { ns: "work-in-norway" })}</BodyShort>
                    </div>
                </div>
                <article className="container-large ukraine-page-main-container">
                    <TableOfContents selectorPrefix="main" />
                    <div className="container-small">
                        <Heading id="when-can-i-start-looking" size="large" level="2" spacing>
                            {t("h2-start-looking.title")}
                        </Heading>
                        <BodyLong spacing>
                            {t("h2-start-looking.p1")}{" "}
                            <AkselLink className="display-inline" href={t("h2-start-looking.p1-link")}>
                                {t("h2-start-looking.p1-link-text")}
                            </AkselLink>{" "}
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

                        <Heading id="where-can-i-find" size="large" level="2" spacing>
                            {t("h2-find-job.title")}
                        </Heading>
                        <BodyLong spacing>
                            {t("h2-find-job.p1")}{" "}
                            <AkselLink
                                className="display-inline"
                                hrefLang="no"
                                href="/stillinger?workLanguage=Engelsk&v=2"
                            >
                                {t("h2-find-job.p1-link-text")}
                            </AkselLink>{" "}
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

                        <Heading id="who-can-i-contact" size="large" level="2" spacing>
                            {t("h2-assistance.title")}
                        </Heading>
                        <BodyLong spacing>
                            {t("h2-assistance.p1")}{" "}
                            <AkselLink className="display-inline" hrefLang="en" href="https://www.nav.no/kontaktoss/en">
                                {t("h2-assistance.p1-link-text-1")}
                            </AkselLink>{" "}
                            {t("h2-assistance.p1-2")}
                            <AkselLink
                                className="display-inline"
                                href="https://www.nav.no/arbeid/registrering"
                                hrefLang="no"
                            >
                                {t("h2-assistance.p1-link-text-2")}
                            </AkselLink>{" "}
                            {t("h2-assistance.p1-3")}
                        </BodyLong>

                        <BodyLong>{t("h2-assistance.p2")}</BodyLong>
                        <AkselLink href={t("h2-assistance.link-3")} className="mb-8">
                            {t("h2-assistance.link-text-3")}
                        </AkselLink>

                        <BodyLong>{t("h2-assistance.p3")}</BodyLong>
                        <BodyLong>{t("h2-assistance.p4")}</BodyLong>
                        <AkselLink href={t("h2-assistance.link-4")} className="mb-8">
                            {t("h2-assistance.link-text-4")}
                        </AkselLink>

                        <BodyLong>{t("h2-assistance.p5")}</BodyLong>
                        <AkselLink href={t("h2-assistance.link-5")} className="mb-8">
                            {t("h2-assistance.link-text-5")}
                        </AkselLink>

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

                        <Heading id="where-can-i-work" size="large" level="2" spacing>
                            {t("h2-working-wo-norwegian.title")}
                        </Heading>
                        <BodyLong spacing>
                            {t("h2-working-wo-norwegian.p1")}{" "}
                            <AkselLink className="display-inline" href="/stillinger?workLanguage=Engelsk&v=2">
                                {t("h2-working-wo-norwegian.p-link-text")}
                            </AkselLink>{" "}
                            {t("h2-working-wo-norwegian.p1-2")}
                        </BodyLong>
                        <BodyLong spacing>{t("h2-working-wo-norwegian.p2")}</BodyLong>

                        <Heading size="small" level="3" spacing>
                            {t("h3-norwegian-courses.title")}
                        </Heading>
                        <BodyLong spacing>
                            {t("h3-norwegian-courses.p1")}{" "}
                            <AkselLink className="display-inline" href={t("h3-norwegian-courses.p1-link")}>
                                {t("h3-norwegian-courses.p1-link-text")}
                            </AkselLink>{" "}
                            {t("h3-norwegian-courses.p1-2")}
                        </BodyLong>
                        <BodyLong spacing>{t("h3-norwegian-courses.p2")}</BodyLong>

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
            ...(await serverSideTranslations(locale, ["finding-a-job", "work-in-norway"])),
        },
    };
}
