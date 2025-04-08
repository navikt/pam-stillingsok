import { loadTranslations } from "@/app/[locale]/work-in-norway/_common/getTranslations";
import ApplyingForJob from "./ApplyingForJob";
import { getTranslation } from "@/app/[locale]/work-in-norway/_common/translate";
import { defaultOpenGraphImage, getMetadataTitle } from "@/app/metadata";

type Props = {
    params: {
        locale: string;
    };
};

export async function generateMetadata({ params }: Props) {
    const translations = await loadTranslations(params.locale, ["work-in-norway"]);
    const { t } = getTranslation(translations);

    const pageTitle = getMetadataTitle(t("applying-for-a-job-title"));
    const description = t("description");
    return {
        title: pageTitle,
        description: description,
        openGraph: {
            title: pageTitle,
            description: description,
            images: [defaultOpenGraphImage],
        },
    };
}

export default async function LocalePage({ params }: Props) {
    const t = await loadTranslations(params.locale, ["applying-for-job", "work-in-norway"]);

    return <ApplyingForJob locale={params.locale} translations={t} />;
}
