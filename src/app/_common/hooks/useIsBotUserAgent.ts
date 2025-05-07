import { useState, useEffect } from "react";

export function useIsBotUserAgent(): boolean {
    const [isBot, setIsBot] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        const botPatterns = [
            "bot",
            "spider",
            "crawl",
            "slurp",
            "googlebot",
            "bingbot",
            "yandex",
            "duckduckbot",
            "baiduspider",
            "archive.org_bot",
            "facebookexternalhit",
            "twitterbot",
            "linkedinbot",
            "pinterestbot",
            "slackbot",
            "discordbot",
            "whatsapp",
            "telegrambot",
            "applebot",
            "yahoobot",
            "msnbot",
            "bingpreview",
            "adsbot",
            "mediapartners-google",
            "google-web-light",
            "feedfetcher-google",
            "google-sitemaps",
            "google-checkout",
            "google-structured-data-testing-tool",
            "google-page-speed",
            "google-adsense",
            "google-fast-preview",
            "google-safetynet",
            "google-adsense-crawler",
            "google-adsense-host-crawler",
        ];

        const isBot = botPatterns.some((pattern) => userAgent.includes(pattern));
        setIsBot(isBot);
    }, []);

    return isBot;
}
