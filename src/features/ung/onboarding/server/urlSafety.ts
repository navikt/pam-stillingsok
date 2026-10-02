export function isSafeVimeoHref(href: string): boolean {
    if (hasForbiddenUrlCharacters(href)) {
        return false;
    }

    try {
        const url = new URL(href);
        if (
            url.protocol !== "https:" ||
            url.username !== "" ||
            url.password !== "" ||
            url.port !== "" ||
            url.search !== "" ||
            url.hash !== ""
        ) {
            return false;
        }

        const pathSegments = url.pathname.split("/").filter(Boolean);
        if (url.hostname === "vimeo.com") {
            return pathSegments.length === 1 && /^\d+$/u.test(pathSegments[0] ?? "");
        }
        if (url.hostname === "player.vimeo.com") {
            return pathSegments.length === 2 && pathSegments[0] === "video" && /^\d+$/u.test(pathSegments[1] ?? "");
        }
        return false;
    } catch {
        return false;
    }
}

export function isSafeContentHref(href: string): boolean {
    if (hasForbiddenUrlCharacters(href)) {
        return false;
    }
    if (isSafeRelativeHref(href)) {
        return true;
    }

    try {
        const url = new URL(href);
        return url.protocol === "https:" && url.username === "" && url.password === "";
    } catch {
        return false;
    }
}

export function isSafeRelativeHref(href: string): boolean {
    if (!href.startsWith("/") || href.startsWith("//") || hasForbiddenUrlCharacters(href)) {
        return false;
    }
    try {
        return new URL(href, "https://arbeidsplassen.invalid").origin === "https://arbeidsplassen.invalid";
    } catch {
        return false;
    }
}

export function hasForbiddenUrlCharacters(value: string): boolean {
    return (
        value !== value.trim() ||
        value.includes("\\") ||
        [...value].some((character) => {
            const codePoint = character.codePointAt(0);
            return codePoint !== undefined && (codePoint <= 31 || codePoint === 127);
        })
    );
}
