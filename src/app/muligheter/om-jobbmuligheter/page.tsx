import { Metadata } from "next";
import OmMuligheter from "@/app/muligheter/om-jobbmuligheter/OmMuligheter";
import { notFound } from "next/navigation";
import { appLogger } from "@/app/_common/logging/appLogger";

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
    if (process.env.MULIGHETER_ENABLED !== "true") {
        appLogger.warn(
            "Muligheter error - Har prøvd å aksessere /muligheter/om-jobbmuligheter, men feature er deaktivert.",
        );
        notFound();
    }

    return <OmMuligheter />;
}
