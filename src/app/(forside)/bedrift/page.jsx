import { getMetadataTitle } from "@/app/layout";
import Bedrift from "@/app/(forside)/bedrift/Bedrift";

export const metadata = {
    title: getMetadataTitle("Bedrift"),
};

export default function Page() {
    return <Bedrift />;
}
