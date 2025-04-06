import { getTranslations } from "next-intl/server";
import { getMetadataTitle } from "@/app/metadata";
export async function generateStaticParams() {
    return [{ locale: "en" }, { locale: "ru" }, { locale: "uk" }];
}

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "ApplyingForJob" });

    return {
        title: getMetadataTitle(t("h2-how-apply")),
    };
}

export default async function Page({ params: { locale } }) {
    console.log("LOCALE", locale);
    const t = await getTranslations({ locale, namespace: "ApplyingForJob" });

    return (
        <div>
            <h1>{t("h2-how-apply")}</h1>
            {/* Your content here */}
        </div>
    );
}
