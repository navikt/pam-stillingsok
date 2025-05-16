import SuperraskSoknadBedrift from "@/app/(artikler)/superrask-soknad-bedrift/SuperraskSoknadBedrift";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Superrask søknad – en enklere måte å komme i kontakt med relevante jobbsøkere",
};

export default function Page() {
    return <SuperraskSoknadBedrift />;
}
