import { expect, Page, test } from "@playwright/test";
import pLimit from "p-limit";

const pagesToVisit = [
    "/",
    // "/arbeidsgivertjenester",
    // "/bedrift",
    // "/enklere-a-skrive-gode-kvalifikasjoner",
    // "/epost-verifisering-utgaatt",
    // "/hvordan-fa-tilgang",
    // "/introduksjon-til-ny-side-for-annonser",
    // "/jobbe-i-utlandet",
    // "/jobbsoker-sommerjobb",
    // "/kontakt",
    // "/nye-filtre",
    // "/nytt-sokefelt",
    // "/nyttige-artikler-for-bedrifter",
    // "/om-arbeidsplassen",
    // "/overforing-av-stillingsannonser",
    // "/personvern",
    // "/personvern-arbeidsgiver",
    // "/personvern-ikke-under-oppfolging",
    // "/personvern-superrask-soknad",
    // "/personvern-under-oppfolging",
    // "/rekruttere-flyktninger",
    // "/retningslinjer-stillingsannonser",
    // "/skikkelig-bra-stillingsannonse",
    // "/slik-bruker-du-det-nye-soket",
    // "/slik-fungerer-superrask-soknad",
    // "/sporsmal-og-svar",
    // "/superrask-soknad-bedrift",
    // "/superrask-soknad-person",
    // "/thon-hotel-superrask",
    // "/tilgang-som-arbeidsgiver",
    // "/tilgangstyring-i-store-virksomheter",
    // "/tilgjengelighet",
    // "/tips-til-jobbsoknaden",
    // "/utlogget",
    // "/velg-rolle",
    // "/verifisert-e-post",
    // "/vilkar",
    // "/vilkar-api",
    // "/vilkar-api-gammel",
    // "/vilkar-og-retningslinjer",
    // "/vilkar-stillingsannonser",
    "/vilkar-superrask-soknad",
];

function randomDelay(min: number, max: number): Promise<void> {
    const ms = Math.floor(Math.random() * (max - min + 1) + min);
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function validateLink(link: string, page: Page) {
    let tries = 0;
    while (tries < 5) {
        tries += 1;
        // eslint-disable-next-line no-await-in-loop
        await randomDelay(250, 1000); // Forsinkelse mellom forsøk
        try {
            // eslint-disable-next-line no-await-in-loop
            const response = await page.request.head(link, {
                headers: {
                    Accept: "text/html,application/xhtml+xml",
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
                },
                timeout: 20000, // 20 second timeout
            }); // equivalent to command "curl -I <link>"

            if (response?.status() === 429) {
                console.warn(`Rate limit hit for ${link} - try ${tries}, retrying after delay`);
                // eslint-disable-next-line no-await-in-loop
                await randomDelay(1000, 1000); // Vent 1 sekund og prøv igjen
            } else if (response?.status() < 400) {
                return null;
            } else {
                console.error(`invalid response status ${link} - try ${tries} : ${response?.status()}`);
            }
        } catch (error) {
            console.error(`error reaching ${link}, try ${tries} : ${error}`);
        }
    }
    return link;
}

async function validateLinksOnPage(page: Page, limit: pLimit.Limit) {
    const links: Array<string> = (await page.evaluate(() => {
        // Apps that are not running in playwright container
        const exceptionList: string[] = [
            "/stillinger",
            "/cv",
            "/cv?v1",
            "/stillingsregistrering",
            "#",
            "mailto:",
            //TODO: remove informasjonskapsler from excluded list when this page exists
            "/informasjonskapsler",
            "/stillinger/api/fastapi",
            "/api",
            "/oauth",
            "/min-side",
            "../oauth2",
            "/sommerjobb",
        ];

        return Array.from(document.links)
            .map((link) => link?.getAttribute("href"))
            .filter((link) => link !== null && !exceptionList.some((exception) => link.startsWith(exception)));
    })) as string[];

    const result = (await Promise.all(links.map(async (link) => limit(() => validateLink(link, page))))).filter(
        (item) => item !== null,
    );
    return result;
}

pagesToVisit.forEach((page) => {
    test(`Test for broken links on ${page}`, async ({ browser }) => {
        const context = await browser.newContext();
        const browserPage = await context.newPage();
        await browserPage.goto(page, { timeout: 60000 });
        const { default: pLimit } = await import("p-limit");
        const limit = pLimit(2);
        const result = await validateLinksOnPage(browserPage, limit);
        expect(result.length === 0, `${page} has broken links: ${result}`).toBe(true);
    });
});
