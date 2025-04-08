import { TranslationResult } from "./types";

export const loadTranslations = async (locale: string, namespaces: string[]): Promise<TranslationResult> => {
    const result: TranslationResult = {};

    for (const ns of namespaces) {
        try {
            const data = await import(`../_translations/${locale}/${ns}.json`);
            result[ns] = data.default;
        } catch (err) {
            console.warn(`Missing translation file: ${locale}/${ns}`);
            result[ns] = {};
        }
    }

    return result;
};
