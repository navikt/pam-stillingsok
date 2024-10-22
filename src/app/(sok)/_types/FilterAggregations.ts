export interface FilterAggregation {
    key: string;
    count: number;
}

interface OccupationSecondLevelFilterAggregation extends FilterAggregation {
    label: string;
}

export interface OccupationFilterAggregation extends FilterAggregation {
    occupationSecondLevels: OccupationSecondLevelFilterAggregation[];
}

export default interface FilterAggregations {
    occupationFirstLevels: OccupationFilterAggregation[];
    published: FilterAggregation[];
    sector: FilterAggregation[];
    engagementTypes: FilterAggregation[];
    extent: FilterAggregation[];
    education: FilterAggregation[];
    workLanguage: FilterAggregation[];
    remote: FilterAggregation[];
    needDriversLicense: FilterAggregation[];
    experience: FilterAggregation[];
    under18: FilterAggregation[];
    publishedTotalCount: number;
    totalInternational: number;
}
