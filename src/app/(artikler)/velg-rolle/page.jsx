import VelgRolle from "@/app/(artikler)/velg-rolle/VelgRolle";
import { getMetadataTitle } from "@/app/layout";

export const metadata = {
    title: getMetadataTitle("Logg inn"),
};

export default function Page() {
    return <VelgRolle />;
}
