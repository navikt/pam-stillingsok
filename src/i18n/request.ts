import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
    // Get the locale from the URL parameters
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
    console.log("LOCALE", locale);

    return {
        locale,
        messages: await import(`@/translations/${locale}.json`),
    };
});
