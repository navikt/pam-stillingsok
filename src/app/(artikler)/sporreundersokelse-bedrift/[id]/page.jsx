import { getMetadataTitle } from "@/app/layout";
import SporreundersokelseBedrift from "@/app/(artikler)/sporreundersokelse-bedrift/SporreundersokelseBedrift";

export const metadata = {
    title: getMetadataTitle("Spørreundersøkelse"),
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page({ params }) {
    return <SporreundersokelseBedrift surveyId={params.id} />;
}
