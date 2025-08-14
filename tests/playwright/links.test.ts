import { expect, Page, test } from "@playwright/test";
import pLimit from "p-limit";
import { readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { validateW3C } from "./validateW3C"; // adjust path as needed

// Get all article pages from the (artikler) directory
const getArticlePages = () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const artiklerDir = path.join(__dirname, "../../src/app/(artikler)");
    const pages = readdirSync(artiklerDir)
        .filter((file) => !file.startsWith("[") && !file.startsWith("_") && !file.startsWith("."))
        .map((file) => `/${file}`);
    return pages;
};

// Pages not in (artikler), or pages with different languages
const fixedPages = [
    "/",
    "/bedrift",
    "/en/work-in-norway",
    "/en/work-in-norway/finding-a-job",
    "/en/work-in-norway/applying-for-job",
    "/en/work-in-norway/starting-a-new-job",
    "/en/work-in-norway/unemployed",
    "/uk/work-in-norway",
    "/uk/work-in-norway/finding-a-job",
    "/uk/work-in-norway/applying-for-job",
    "/uk/work-in-norway/starting-a-new-job",
    "/uk/work-in-norway/unemployed",
    "/ru/work-in-norway",
    "/ru/work-in-norway/finding-a-job",
    "/ru/work-in-norway/applying-for-job",
    "/ru/work-in-norway/starting-a-new-job",
    "/ru/work-in-norway/unemployed",
];

// const pagesToVisit = [...fixedPages, ...getArticlePages()];
const pagesToVisit = ["/"];

function randomDelay(min: number, max: number): Promise<void> {
    const ms = Math.floor(Math.random() * (max - min + 1) + min);
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// async function validateLink(link: string, page: Page) {
//     let tries = 0;
//     while (tries < 5) {
//         tries += 1;
//         // eslint-disable-next-line no-await-in-loop
//         await randomDelay(250, 1000); // Forsinkelse mellom forsøk
//         try {
//             // eslint-disable-next-line no-await-in-loop
//             const response = await page.request.head(link, {
//                 headers: {
//                     Accept: "text/html,application/xhtml+xml",
//                     "User-Agent":
//                         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
//                 },
//                 timeout: 20000, // 20 second timeout
//             }); // equivalent to command "curl -I <link>"

//             if (response?.status() === 429) {
//                 console.warn(`Rate limit hit for ${link} - try ${tries}, retrying after delay`);
//                 // eslint-disable-next-line no-await-in-loop
//                 await randomDelay(1000, 1000); // Vent 1 sekund og prøv igjen
//             } else if (response?.status() < 400 || response?.status() === 401) {
//                 return null;
//             } else {
//                 console.error(`invalid response status ${link} - try ${tries} : ${response?.status()}`);
//             }
//         } catch (error) {
//             console.error(`error reaching ${link}, try ${tries} : ${error}`);
//         }
//     }
//     return link;
// }

// async function validateLinksOnPage(page: Page, limit: pLimit.Limit) {
//     const links: Array<string> = (await page.evaluate(() => {
//         // Apps that are not running in playwright container
//         const exceptionList: string[] = [
//             "/stillinger",
//             "/sommerjobb",
//             "/cv",
//             "/cv?v1",
//             "/stillingsregistrering",
//             "#",
//             "mailto:",
//             "/api",
//             "/oauth",
//             "/min-side",
//             "../oauth2",
//         ];

//         return Array.from(document.links)
//             .map((link) => link?.getAttribute("href"))
//             .filter((link) => link !== null && !exceptionList.some((exception) => link.startsWith(exception)));
//     })) as string[];

//     const result = (await Promise.all(links.map(async (link) => limit(() => validateLink(link, page))))).filter(
//         (item) => item !== null,
//     );
//     return result;
// }

pagesToVisit.forEach((page) => {
    // test(`Test for broken links on ${page}`, async ({ browser }) => {
    //     const context = await browser.newContext();
    //     const browserPage = await context.newPage();
    //     await browserPage.goto(page, { timeout: 30000 });
    //     const { default: pLimit } = await import("p-limit");
    //     const limit = pLimit(2);
    //     const result = await validateLinksOnPage(browserPage, limit);
    //     expect(result.length === 0, `${page} has broken links: ${result}`).toBe(true);
    // });

    test(`Test for W3C validation ${page}`, async ({ browser }) => {
        const context = await browser.newContext();
        const browserPage = await context.newPage();
        await browserPage.goto(page, { timeout: 30000 });

        // W3C Validation
        const html = await browserPage.content();
        const errors = await validateW3C(html);
        expect(errors.length === 0, `${page} has W3C errors:\n${errors.join("\n")}`).toBe(true);
    });
});
