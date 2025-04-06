"use client";

import { useTranslation } from "next-i18next";

export default function TranslationPage() {
    const { t } = useTranslation("work-in-norway");

    return (
        <div>
            <h1>{t("title")}</h1>
            {/* Use other translations here */}
        </div>
    );
}
