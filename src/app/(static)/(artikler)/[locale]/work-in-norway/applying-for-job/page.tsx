import { loadTranslations } from "@/app/(static)/(artikler)/[locale]/work-in-norway/_common/getTranslations";
import ApplyingForJob from "./ApplyingForJob";
import { getTranslation } from "@/app/(static)/(artikler)/[locale]/work-in-norway/_common/translate";
import { PageInfo, mapLocaleToLanguage } from "@/app/(static)/(artikler)/pageInfoTypes";
import { buildPageMetadata } from "@/app/(static)/(artikler)/buildPageMetadata";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;

type PageProps = {
    params: Params;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const translations = await loadTranslations(params.locale, ["work-in-norway"]);

    const { t } = getTranslation(translations);

    const title = t("applying-for-a-job-title", { ns: "work-in-norway" });
    const description = t("description", { ns: "work-in-norway" });
    const pageInfo: PageInfo = {
        title: title,
        description: description,
        language: mapLocaleToLanguage(params.locale),
        category: "jobseeker-guides",
        proofread: true,
        updatedAt: "2025-04-11",
    };

    return buildPageMetadata({
        meta: pageInfo,
    });
}

export default async function LocalePage(props: PageProps) {
    const params = await props.params;
    const t = await loadTranslations(params.locale, ["applying-for-job", "work-in-norway"]);
    return <ApplyingForJob locale={params.locale} translations={t} />;
}
