import SporsmalOgSvar from "@/app/(artikler)/sporsmal-og-svar/SporsmalOgSvar";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Spørsmål og svar",
};

export default function Page() {
    return <SporsmalOgSvar />;
}
