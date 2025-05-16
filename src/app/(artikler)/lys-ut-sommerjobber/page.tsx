import LysUtSommerjobber from "@/app/(artikler)/lys-ut-sommerjobber/LysUtSommerjobber";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Lys ut sommerjobber",
};

export default function Page() {
    return <LysUtSommerjobber />;
}
