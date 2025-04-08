"use client";

import { Chips, LinkPanel, Heading, Ingress, VStack, BodyLong, Link as AkselLink } from "@navikt/ds-react";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { getTranslation } from "@/app/[locale]/work-in-norway/_common/translate";
import { TranslationResult } from "@/app/[locale]/work-in-norway/_common/types";

type Props = {
    locale: string;
    translations: TranslationResult;
};

export default function WorkInNorway({ locale, translations }: Props) {
    const [lngEnglish] = useState("en");
    const [lngUkrainian] = useState("uk");
    const [lngRussian] = useState("ru");

    const router = useRouter();

    const { t } = getTranslation(translations);

    const changeLanguage = useCallback(
        (newLocale: string) => {
            const currentPath = window.location.pathname.replace(`/${locale}`, "");
            router.push(`/${newLocale}${currentPath}`);
        },
        [locale, router],
    );

    return (
        <article className="container-medium mt-5 mb-24 ukraine-page-main" lang={locale}>
            <Heading size="xlarge" level="1" spacing>
                {t("ukrainian-work-in-norway-title")}
            </Heading>
            <Ingress spacing>{t("description")}</Ingress>
            <VStack align="center">
                <Chips className="mb-12">
                    <Chips.Toggle
                        selected={locale === lngEnglish}
                        onClick={() => changeLanguage(lngEnglish)}
                        lang={lngEnglish}
                    >
                        Information in English
                    </Chips.Toggle>
                    <Chips.Toggle
                        selected={locale === lngUkrainian}
                        onClick={() => changeLanguage(lngUkrainian)}
                        lang={lngUkrainian}
                    >
                        Інформація українською мовою
                    </Chips.Toggle>
                    <Chips.Toggle
                        selected={locale === lngRussian}
                        onClick={() => changeLanguage(lngRussian)}
                        lang={lngRussian}
                    >
                        Информация на русском языке
                    </Chips.Toggle>
                </Chips>
            </VStack>

            <div className="arb-link-panel-grid mb-16">
                <LinkPanel className="arb-link-panel-secondary" href={`/${locale}/work-in-norway/finding-a-job`}>
                    <LinkPanel.Title className="navds-heading--small">{t("finding-a-job-title")}</LinkPanel.Title>
                </LinkPanel>
                <LinkPanel className="arb-link-panel-secondary" href={`/${locale}/work-in-norway/applying-for-job`}>
                    <LinkPanel.Title className="navds-heading--small">{t("applying-for-a-job-title")}</LinkPanel.Title>
                </LinkPanel>
                <LinkPanel className="arb-link-panel-secondary" href={`/${locale}/work-in-norway/starting-a-new-job`}>
                    <LinkPanel.Title className="navds-heading--small">{t("starting-a-new-job-title")}</LinkPanel.Title>
                </LinkPanel>
                <LinkPanel className="arb-link-panel-secondary" href={`/${locale}/work-in-norway/unemployed`}>
                    <LinkPanel.Title className="navds-heading--small">{t("unemployed-title")}</LinkPanel.Title>
                </LinkPanel>
            </div>

            <VStack align="center">
                <Heading level="2" size="medium" spacing>
                    {/* Update to include the nested structure */}
                    {t("hotjar.h2", { ns: "hotjar" })}
                </Heading>
                <BodyLong spacing>{t("hotjar.p", { ns: "hotjar" })}</BodyLong>
                <BodyLong>
                    <AkselLink href={t("hotjar.link", { ns: "hotjar" })}>
                        {t("hotjar.link-text", { ns: "hotjar" })}
                    </AkselLink>
                </BodyLong>
            </VStack>
        </article>
    );
}
