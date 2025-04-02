import { getMetadataTitle } from "@/app/metadata";
import SuperraskSoknadBedrift from "@/app/(artikler)/superrask-soknad-bedrift/SuperraskSoknadBedrift";

export const metadata = {
    title: getMetadataTitle("Superrask søknad – en enklere måte å komme i kontakt med relevante jobbsøkere"),
};

export default function Page() {
    return <SuperraskSoknadBedrift />;
}
