import { loadTranslations } from "@/app/(static)/(artikler)/[locale]/work-in-norway/_common/getTranslations";
import StartingANewJob from "./StartingANewJob";
import { getTranslation } from "@/app/(static)/(artikler)/[locale]/work-in-norway/_common/translate";
import { PageInfo, mapLocaleToLanguage } from "@/app/(static)/(artikler)/pageInfoTypes";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";
import { Metadata } from "next";
type Params = Promise<{ locale: string }>;
type Props = {
    params: Params;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const translations = await loadTranslations(locale, ["work-in-norway"]);
    const { t } = getTranslation(translations);

    const title = t("starting-a-new-job-title", { ns: "work-in-norway" });
    const description = t("description", { ns: "work-in-norway" });
    const pageInfo: PageInfo = {
        title,
        description: description,
        language: mapLocaleToLanguage(locale),
        category: "jobseeker-guides",
        proofread: true,
        updatedAt: "2025-04-11",
    };

    return buildPageMetadata({
        meta: pageInfo,
    });
}

export default async function LocalePage({ params }: Props) {
    const { locale } = await params;
    const t = await loadTranslations(locale, ["starting-a-new-job", "work-in-norway"]);

    return <StartingANewJob locale={locale} translations={t} />;
}
