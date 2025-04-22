"use client";

import { BodyShort, LinkPanel, Heading, BodyLong, Link as AkselLink } from "@navikt/ds-react";
import { getTranslation } from "@/app/(artikler)/[locale]/work-in-norway/_common/translate";
import TableOfContents from "@/app/(artikler)/[locale]/work-in-norway/_common/TableOfContents";
import { TranslationResult } from "@/app/(artikler)/[locale]/work-in-norway/_common/types";

export default function Unemployed({ locale, translations }: { locale: string; translations: TranslationResult }) {
    const { t } = getTranslation(translations);

    return (
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
                <TableOfContents locale={locale} selectorPrefix="main" />
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
                            href="https://www.nav.no/tjenester/en"
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
    );
}
