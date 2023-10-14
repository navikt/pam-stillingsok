import SavedSearchesWrapper from "../../../migrating/use-client/SavedSearchesWrapper";
import mockData from "./mock-data";

export const metadata = {
    title: "Lagrede søk - arbeidsplassen.no",
};

export default async function Page() {
    return <SavedSearchesWrapper data={mockData} />;
}
