import { getMetadataTitle } from "@/app/metadata";
import Informasjonskapsler from "@/app/(artikler)/informasjonskapsler/Informasjonskapsler";

export const metadata = {
    title: getMetadataTitle("Informasjons­kapsler på arbeidsplassen.no"),
};

export default function Page() {
    return <Informasjonskapsler />;
}
