import { loadTranslations } from "@/app/(artikler)/[locale]/work-in-norway/_common/getTranslations";
import ApplyingForJob from "./ApplyingForJob";
import { getTranslation } from "@/app/(artikler)/[locale]/work-in-norway/_common/translate";
import { PageInfo, mapLocaleToLanguage } from "@/app/(artikler)/pageInfoTypes";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

type Props = {
    params: {
        locale: string;
    };
};

export async function generateMetadata({ params }: Props) {
    const translations = await loadTranslations(params.locale, ["work-in-norway"]);
    const { t } = getTranslation(translations);

    const title = t("unemployed-title", { ns: "work-in-norway" });
    const description = t("description", { ns: "work-in-norway" });
    const pageInfo: PageInfo = {
        title: title,
        description: description,
        language: mapLocaleToLanguage(params.locale),
        category: "work-in-norway",
        proofread: true,
        updatedAt: "2025-04-11",
    };

    return buildArticleMetadata({
        meta: pageInfo,
    });
}

export default async function LocalePage({ params }: Props) {
    const t = await loadTranslations(params.locale, ["applying-for-job", "work-in-norway"]);

    return <ApplyingForJob locale={params.locale} translations={t} />;
}
