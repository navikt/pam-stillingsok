import { getMetadataTitle } from "@/app/metadata";
import NyttSokefelt from "@/app/(artikler)/nytt-sokefelt/NyttSokefelt";

export const metadata = {
    title: getMetadataTitle("Nytt søkefelt! Enklere, raskere og mer fleksibelt!"),
};

export default function Page() {
    return <NyttSokefelt />;
}
