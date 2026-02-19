import { TranslationResult } from "./types";
import { appLogger } from "@/app/_common/logging/appLogger";

export const loadTranslations = async (locale: string, namespaces: string[]): Promise<TranslationResult> => {
    const result: TranslationResult = {};

    for (const ns of namespaces) {
        try {
            const data = await import(`../_translations/${locale}/${ns}.json`);
            result[ns] = data.default;
        } catch {
            appLogger.warn(`Missing translation file: ${locale}/${ns}`);
            result[ns] = {};
        }
    }

    return result;
};
