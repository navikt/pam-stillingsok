import { notFound } from "next/navigation";
import React, { ReactNode } from "react";

// List of valid locales
const validLocales = ["en", "ru", "uk"];

type LayoutProps = {
    children: ReactNode;
    params: {
        locale: string;
    };
};

export async function generateStaticParams() {
    return validLocales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
    const { locale } = params;

    // If locale is not valid, show a 404 page
    if (!validLocales.includes(locale)) {
        notFound();
    }

    return <>{React.cloneElement(children as React.ReactElement, {})}</>;
}
