import { TranslationData, TranslationResult } from "./types";

const resolveNestedKey = (obj: TranslationData, key: string): string | undefined => {
    // eslint-disable-next-line
    return key.split(".").reduce((acc: any, part: string) => acc?.[part], obj);
};

export const getTranslation = (translations: TranslationResult) => {
    // Get the default namespace (the first one in the translations object)
    const defaultNamespace = Object.keys(translations)[0];

    // Translation function that supports namespaces
    const t = (key: string, { ns = defaultNamespace }: { ns?: string } = {}) => {
        // Retrieve the translation for the key from the correct namespace
        const nsTranslations = translations[ns];
        if (!nsTranslations) {
            console.warn(`Namespace ${ns} not found`);
            return key; // Fallback to key if namespace doesn't exist
        }

        const value = resolveNestedKey(nsTranslations, key);
        return value ?? key; // Return the translation or the key if not found
    };

    return { t };
};
