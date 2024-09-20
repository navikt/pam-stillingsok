export default interface Aggregations {
    occupationFirstLevels: { key: string; occupationSecondLevels: { key: string }[] }[];
    published: { key: string }[];
    sector: { key: string }[];
    engagementTypes: { key: string }[];
    extent: { key: string }[];
    education: { key: string }[];
    workLanguage: { key: string }[];
    remote: { key: string }[];
    needDriversLicense: { key: string }[];
    experience: { key: string }[];
    publishedTotalCount: number;
}
