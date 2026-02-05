"use client";

import { Chips, Heading, VStack, BodyLong, LinkCard } from "@navikt/ds-react";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { getTranslation } from "@/app/(artikler)/[locale]/work-in-norway/_common/translate";
import { TranslationResult } from "@/app/(artikler)/[locale]/work-in-norway/_common/types";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { ArticleLanguage } from "@/app/(artikler)/pageInfoTypes";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";

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
        <ArticleWrapper width="lg" lang={locale as ArticleLanguage}>
            <Heading size="xlarge" level="1" spacing align="center">
                {t("ukrainian-work-in-norway-title")}
            </Heading>
            <BodyLong size="large" spacing align="center">
                {t("description")}
            </BodyLong>
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
                <LinkCard className="arb-link-panel-primary">
                    <LinkCard.Title>
                        <AkselNextLinkCardAnchor href={`/${locale}/work-in-norway/finding-a-job`}>
                            {t("finding-a-job-title")}
                        </AkselNextLinkCardAnchor>
                    </LinkCard.Title>
                </LinkCard>

                <LinkCard className="arb-link-panel-primary">
                    <LinkCard.Title>
                        <AkselNextLinkCardAnchor href={`/${locale}/work-in-norway/applying-for-job`}>
                            {t("applying-for-a-job-title")}
                        </AkselNextLinkCardAnchor>
                    </LinkCard.Title>
                </LinkCard>

                <LinkCard className="arb-link-panel-primary">
                    <LinkCard.Title>
                        <AkselNextLinkCardAnchor href={`/${locale}/work-in-norway/starting-a-new-job`}>
                            {t("starting-a-new-job-title")}
                        </AkselNextLinkCardAnchor>
                    </LinkCard.Title>
                </LinkCard>

                <LinkCard className="arb-link-panel-primary">
                    <LinkCard.Title>
                        <AkselNextLinkCardAnchor href={`/${locale}/work-in-norway/unemployed`}>
                            {t("unemployed-title")}
                        </AkselNextLinkCardAnchor>
                    </LinkCard.Title>
                </LinkCard>
            </div>

            {/* TODO: Replace with Skyra 
            <VStack align="center">
                <Heading level="2" size="medium" spacing>
                    
                    {t("hotjar.h2", { ns: "hotjar" })}
                </Heading>
                <BodyLong spacing>{t("hotjar.p", { ns: "hotjar" })}</BodyLong>
                <BodyLong>
                    <AkselNextLink href={t("hotjar.link", { ns: "hotjar" })}>
                        {t("hotjar.link-text", { ns: "hotjar" })}
                    </AkselNextLink>
                </BodyLong>
            </VStack> */}
        </ArticleWrapper>
    );
}
