import { getMetadataTitle } from "@/app/metadata";
import VelgRolle from "@/app/(artikler)/velg-rolle/VelgRolle";

export const metadata = {
    title: getMetadataTitle("Logg inn"),
};

export default function Page() {
    return <VelgRolle />;
}
