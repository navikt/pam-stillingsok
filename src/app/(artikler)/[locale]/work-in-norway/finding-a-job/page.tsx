import { loadTranslations } from "@/app/(artikler)/[locale]/work-in-norway/_common/getTranslations";
import FindingAJob from "./FindingAJob";
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
        title: t("finding-a-job-title"),
        description: t("description"),
    };
}

export default async function LocalePage({ params }: Props) {
    const t = await loadTranslations(params.locale, ["finding-a-job", "work-in-norway"]);

    return <FindingAJob locale={params.locale} translations={t} />;
}
