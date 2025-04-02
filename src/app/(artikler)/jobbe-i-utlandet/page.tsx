import { getMetadataTitle } from "@/app/metadata";
import JobbeIUtlandet from "@/app/(artikler)/jobbe-i-utlandet/JobbeIUtlandet";

export const metadata = {
    title: getMetadataTitle("Jobbe i utlandet"),
};

export default function Page() {
    return <JobbeIUtlandet />;
}
