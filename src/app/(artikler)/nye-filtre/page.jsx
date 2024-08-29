import { getMetadataTitle } from "@/app/layout";
import NyeFiltre from "@/app/(artikler)/nye-filtre/NyeFiltre";

export const metadata = {
    title: getMetadataTitle("Nye filtre gjør det enda enklere å finne jobber som passer"),
};

export default function Page() {
    return <NyeFiltre />;
}
