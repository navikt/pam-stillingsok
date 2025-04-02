import { getMetadataTitle } from "@/app/metadata";
import EpostVerifiseringUtgaatt from "@/app/(artikler)/epost-verifisering-utgaatt/EpostVerifiseringUtgaatt";

export const metadata = {
    title: getMetadataTitle("Lenken er utgått"),
};

export default function Page() {
    return <EpostVerifiseringUtgaatt />;
}
