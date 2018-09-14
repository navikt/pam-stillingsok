export default function capitalizeLocation(text) {
    const separators = [
        ' ', // NORDRE LAND skal bli Nordre Land
        '-', // AUST-AGDER skal bli Aust-Agder
        '(' // BØ (TELEMARK) skal bli Bø (Telemark)
    ];

    const ignore = [
        'i', 'og' // MØRE OG ROMSDAL skal bli Møre og Romsdal
    ];

    if (text) {
        let capitalized = text.toLowerCase();

        for (let i = 0, len = separators.length; i < len; i += 1) {
            const fragments = capitalized.split(separators[i]);
            for (let j = 0, x = fragments.length; j < x; j += 1) {
                if (!ignore.includes(fragments[j])) {
                    fragments[j] = fragments[j][0].toUpperCase() + fragments[j].substr(1);
                }
            }
            capitalized = fragments.join(separators[i]);
        }

        return capitalized;
    }
    return text;
}
