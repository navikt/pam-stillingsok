import fs from "fs/promises";
import path from "path";

export async function getTranslations(locale) {
    try {
        const translations = await fs.readFile(
            path.join(process.cwd(), "public", "locales", `${locale}.json`),
            "utf-8",
        );
        return JSON.parse(translations);
    } catch (error) {
        console.error("Error loading translations:", error);
        return null;
    }
}
