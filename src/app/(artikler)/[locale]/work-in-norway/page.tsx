import { loadTranslations } from "@/app/(artikler)/[locale]/work-in-norway/_common/getTranslations";
import WorkInNorway from "./WorkInNorway";
import { getTranslation } from "@/app/(artikler)/[locale]/work-in-norway/_common/translate";
import { getMetadataTitle } from "@/app/metadata";

type Props = {
    params: {
        locale: string;
    };
};

export async function generateMetadata({ params }: Props) {
    const translations = await loadTranslations(params.locale, ["work-in-norway"]);
    const { t } = getTranslation(translations);

    const pageTitle = getMetadataTitle(t("ukrainian-work-in-norway-title"));
    const description = t("description");
    return {
        title: pageTitle,
        description: description,
        openGraph: {
            title: pageTitle,
            description: description,
        },
    };
}

export default async function LocalePage({ params }: Props) {
    const t = await loadTranslations(params.locale, ["work-in-norway", "hotjar"]);

    return <WorkInNorway locale={params.locale} translations={t} />;
}
