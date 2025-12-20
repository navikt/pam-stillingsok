import { loadTranslations } from "@/app/(nonce)/(artikler)/[locale]/work-in-norway/_common/getTranslations";
import WorkInNorway from "./WorkInNorway";
import { getTranslation } from "@/app/(nonce)/(artikler)/[locale]/work-in-norway/_common/translate";
import { Metadata } from "next";
type Params = Promise<{ locale: string }>;
type Props = {
    params: Params;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const translations = await loadTranslations(locale, ["work-in-norway"]);
    const { t } = getTranslation(translations);

    return {
        title: t("ukrainian-work-in-norway-title"),
        description: t("description"),
    };
}

export default async function LocalePage({ params }: Props) {
    const { locale } = await params;
    const t = await loadTranslations(locale, ["work-in-norway", "hotjar"]);

    return <WorkInNorway locale={locale} translations={t} />;
}
