import { loadTranslations } from "@/app/[locale]/work-in-norway/_common/getTranslations";
import StartingANewJob from "./StartingANewJob";
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

    const pageTitle = getMetadataTitle(t("starting-a-new-job-title"));
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
    const t = await loadTranslations(params.locale, ["starting-a-new-job", "work-in-norway"]);

    return <StartingANewJob locale={params.locale} translations={t} />;
}
