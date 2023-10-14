import FavouritesWrapper from "../../../migrating/use-client/FavouritesWrapper";
import mockData from "../api/v1/userfavouriteads/mock-data";

export const metadata = {
    title: "Favoritter - arbeidsplassen.no",
};
export default async function Page() {
    return <FavouritesWrapper data={mockData} />;
}
