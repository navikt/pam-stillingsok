export function filterPublished(published: string | undefined) {
    const filters = [];
    if (published) {
        filters.push({
            range: {
                published: {
                    gte: published,
                    time_zone: "CET",
                },
            },
        });
    }
    return filters;
}
