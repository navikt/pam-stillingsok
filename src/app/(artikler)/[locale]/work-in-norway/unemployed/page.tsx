import { loadTranslations } from "@/app/(artikler)/[locale]/work-in-norway/_common/getTranslations";
import Unemployed from "./Unemployed";
import { getTranslation } from "@/app/(artikler)/[locale]/work-in-norway/_common/translate";

type Props = {
    params: {
        locale: string;
    };
};

export async function generateMetadata({ params }: Props) {
    const translations = await loadTranslations(params.locale, ["work-in-norway"]);
    const { t } = getTranslation(translations);

    return {
        title: t("unemployed-title"),
        description: t("description"),
    };
}

export default async function LocalePage({ params }: Props) {
    const t = await loadTranslations(params.locale, ["unemployed", "work-in-norway"]);

    return <Unemployed locale={params.locale} translations={t} />;
}
