import SavedSearchesWrapper from "./_components/SavedSearchesWrapper";
import mockData from "./mock-data";

export default async function Page() {
    return <SavedSearchesWrapper data={mockData} />;
}
