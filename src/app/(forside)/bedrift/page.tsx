import Bedrift from "@/app/(forside)/bedrift/Bedrift";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Bedrift",
};

export default function Page() {
    return <Bedrift />;
}
