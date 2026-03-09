import { Metadata } from "next";
import OmMuligheter from "@/app/muligheter/om-jobbmuligheter/OmMuligheter";

export const metadata: Metadata = {
    title: "Nye muligheter hos Nav",
    description:
        "Les om hvordan jobbmuligheter gir deg som er registrert jobbsøker hos Nav et fortrinn i rekrutteringen.",
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
        },
    },
};

export default function Page() {
    return <OmMuligheter />;
}
