import { Metadata } from "next";
import OmMuligheter from "@/app/muligheter/om-jobbmuligheter/OmMuligheter";

export const metadata: Metadata = {
    title: "Nye muligheter hos Nav",
    description:
        "Les om hvordan jobbmuligheter gir deg som er registrert jobbsøker hos Nav et fortrinn i rekrutteringen.",
    robots: "noindex, nofollow",
};

export default function Page() {
    return <OmMuligheter />;
}
