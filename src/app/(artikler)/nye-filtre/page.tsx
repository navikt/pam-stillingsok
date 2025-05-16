import NyeFiltre from "@/app/(artikler)/nye-filtre/NyeFiltre";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Nye filtre gjør det enda enklere å finne jobber som passer",
};

export default function Page() {
    return <NyeFiltre />;
}
