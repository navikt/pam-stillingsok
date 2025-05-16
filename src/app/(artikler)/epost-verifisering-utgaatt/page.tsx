import EpostVerifiseringUtgaatt from "@/app/(artikler)/epost-verifisering-utgaatt/EpostVerifiseringUtgaatt";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Lenken er utgått",
};

export default function Page() {
    return <EpostVerifiseringUtgaatt />;
}
