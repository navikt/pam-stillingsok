import NyttSokefelt from "@/app/(artikler)/nytt-sokefelt/NyttSokefelt";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Nytt søkefelt! Enklere, raskere og mer fleksibelt!",
};

export default function Page() {
    return <NyttSokefelt />;
}
