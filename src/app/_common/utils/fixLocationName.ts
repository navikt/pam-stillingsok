function capitalizeLocationName(text: string | undefined | null) {
    const separators = [
        " ", // NORDRE LAND skal bli Nordre Land
        "-", // AUST-AGDER skal bli Aust-Agder
        "(", // BØ (TELEMARK) skal bli Bø (Telemark)
    ];

    const ignore = [
        "i",
        "og", // MØRE OG ROMSDAL skal bli Møre og Romsdal
    ];

    if (text) {
        let capitalized = text.toLowerCase();

        for (let i = 0, len = separators.length; i < len; i += 1) {
            const fragments = capitalized.split(separators[i]);
            for (let j = 0, x = fragments.length; j < x; j += 1) {
                if (!ignore.includes(fragments[j]) && fragments[j][0] != null) {
                    fragments[j] = fragments[j][0].toUpperCase() + fragments[j].substr(1);
                }
            }
            capitalized = fragments.join(separators[i]);
        }

        return capitalized;
    }
    return text ?? "";
}

function fixTyposInLocationName(text: string | undefined) {
    if (text === "Unjargga Nesseby") {
        return "Unjárga Nesseby";
    }
    return text ?? "";
}

function fixLocationName(text: string | undefined | null, splitOnDot = false) {
    let location = text;
    if (splitOnDot && location?.includes(".")) {
        // eslint-disable-next-line prefer-destructuring
        location = location.split(".")[1];
    }

    let fixedLocationName = capitalizeLocationName(location);
    fixedLocationName = fixTyposInLocationName(fixedLocationName);
    return fixedLocationName;
}

export default fixLocationName;
