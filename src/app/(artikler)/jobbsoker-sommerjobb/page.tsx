import SommerjobbJobbsoker from "@/app/(artikler)/jobbsoker-sommerjobb/SommerjobbJobbsoker";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Sommerjobben venter på deg!",
};

export default function Page() {
    return <SommerjobbJobbsoker />;
}
