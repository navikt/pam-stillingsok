import { loadTranslations } from "@/app/(artikler)/[locale]/work-in-norway/_common/getTranslations";
import Unemployed from "./Unemployed";
import { getTranslation } from "@/app/(artikler)/[locale]/work-in-norway/_common/translate";
import { ArticleMeta, mapLocaleToLanguage } from "@/app/(artikler)/articleMetaTypes";
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
    const articleMeta: ArticleMeta = {
        title: title,
        description: description,
        language: mapLocaleToLanguage(params.locale),
        category: "work-in-norway",
        proofread: true,
        updatedAt: "2024-11-23", // eller dropp hvis du ikke vil sette her
    };

    return buildArticleMetadata({
        meta: articleMeta,
    });
}

export default async function LocalePage({ params }: Props) {
    const t = await loadTranslations(params.locale, ["unemployed", "work-in-norway"]);

    return <Unemployed locale={params.locale} translations={t} />;
}
