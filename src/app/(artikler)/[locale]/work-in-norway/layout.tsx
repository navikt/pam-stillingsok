import { notFound } from "next/navigation";
import React, { ReactNode } from "react";

const validLocales = ["en", "ru", "uk"] as const;
type SupportedLocale = (typeof validLocales)[number];

function isSupportedLocale(value: string): value is SupportedLocale {
    return (validLocales as readonly string[]).includes(value);
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<ReadonlyArray<{ readonly locale: SupportedLocale }>> {
    return validLocales.map((locale) => ({ locale }));
}
type LayoutProps = {
    readonly children: ReactNode;
    readonly params: Promise<{ readonly locale: string }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
    const { locale } = await params;

    if (!isSupportedLocale(locale)) {
        notFound();
    }

    return <>{children}</>;
}
