export function toTitleCaseNo(raw: string): string {
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
        return trimmed;
    }

    // Gjør alt til lower i norsk locale
    const lower = trimmed.toLocaleLowerCase("nb-NO");

    // Title-case per “ord”, men behold bindestrek.
    return lower
        .split(" ")
        .filter((token) => {
            return token.length > 0;
        })
        .map((word) => {
            return word
                .split("-")
                .map((part) => {
                    if (part.length === 0) {
                        return part;
                    }

                    const first = part[0]?.toLocaleUpperCase("nb-NO") ?? "";
                    const rest = part.slice(1);
                    return `${first}${rest}`;
                })
                .join("-");
        })
        .join(" ");
}
