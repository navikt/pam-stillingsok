export function getMulighetTitle(title: string | null): string {
    if (title) {
        return title;
    }
    return "Mulighet";
}

export function getMeldInteresseTitle(title: string | null): string {
    if (title) {
        return `Interesse meldt - ${title}`;
    }
    return "Interesse meldt";
}
