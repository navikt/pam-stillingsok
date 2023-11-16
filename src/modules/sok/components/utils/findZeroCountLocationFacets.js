export default function findZeroCountLocationFacets(usersSearchCriteria, nationalCountMap, internationalCountMap) {
    if (Array.isArray(usersSearchCriteria) && usersSearchCriteria.length > 0) {
        return usersSearchCriteria.filter(
            (c) => !(Object.keys(nationalCountMap).includes(c) || Object.keys(internationalCountMap).includes(c)),
        );
    }

    return [];
}
