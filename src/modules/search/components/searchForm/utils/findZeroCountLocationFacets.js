export default function findZeroCountLocationFacets(usersSearchCriteria, nationalCountMap, internationalCountMap) {
    if (Array.isArray(usersSearchCriteria) && usersSearchCriteria.length > 0) {
        return usersSearchCriteria.filter((c) => {
            return !(nationalCountMap.hasOwnProperty(c) || internationalCountMap.hasOwnProperty(c));
        });
    }

    return [];
}
