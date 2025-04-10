import { getMetadataTitle } from "@/app/metadata";
import Informasjonskapsler from "@/app/(artikler)/informasjonskapsler/Informasjonskapsler";

export const metadata = {
    title: getMetadataTitle("Introduksjon til ny side for annonser"),
};

export default function Page() {
    return <Informasjonskapsler />;
}
