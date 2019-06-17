import { PublishedLabelsEnum } from '../search/facets/published/Published';
import capitalizeLocation from './capitalizeLocation';

export default function searchCriteriaToString(state) {
    const title = [];
    const counties = state.counties.checkedCounties.filter((county) => {
        const countyObject = state.counties.counties.find((c) => c.key === county);
        if (countyObject) {
            const found = countyObject.municipals.find((m) => state.counties.checkedMunicipals.includes(m.key));
            return !found;
        }
        return '';
    });
    const occupationFirstLevels = state.occupations.checkedFirstLevels.filter((firstLevel) => {
        const firstLevelObject = state.occupations.occupationFirstLevels.find((c) => c.key === firstLevel);
        if (firstLevelObject) {
            const found = firstLevelObject.occupationSecondLevels.find((m) => state.occupations.checkedSecondLevels.includes(m.key));
            return !found;
        }
        return '';
    });

    if (state.searchBox.q) title.push(state.searchBox.q);
    if (occupationFirstLevels.length > 0) title.push(occupationFirstLevels.join(', '));
    if (state.occupations.checkedSecondLevels.length > 0) title.push(state.occupations.checkedSecondLevels.map((o) => (o.split('.')[1])).join(', '));
    if (counties.length > 0) title.push(counties.map((c) => (capitalizeLocation(c))).join(', '));
    if (state.counties.checkedMunicipals.length > 0) title.push(state.counties.checkedMunicipals.map((m) => (capitalizeLocation(m.split('.')[1]))).join(', '));
    if (state.extent.checkedExtent.length > 0) title.push(state.extent.checkedExtent.join(', '));
    if (state.engagement.checkedEngagementType.length > 0) title.push(state.engagement.checkedEngagementType.join(', '));
    if (state.sector.checkedSector.length > 0) title.push(state.sector.checkedSector.join(', '));
    if (state.countries.checkedCountries.length > 0) title.push(state.countries.checkedCountries.map((c) => (capitalizeLocation(c))).join(', '));
    if (state.published.checkedPublished) title.push(PublishedLabelsEnum[state.published.checkedPublished]);

    return title.join(', ');
}
