import { getMetadataTitle } from "@/app/layout";
import SporsmalOgSvar from "@/app/(artikler)/sporsmal-og-svar/SporsmalOgSvar";

export const metadata = {
    title: getMetadataTitle("Spørsmål og svar"),
};

export default function Page() {
    return <SporsmalOgSvar />;
}
