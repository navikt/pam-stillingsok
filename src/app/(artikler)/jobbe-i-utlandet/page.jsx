import JobbeIUtlandet from "@/app/(artikler)/jobbe-i-utlandet/JobbeIUtlandet";
import { getMetadataTitle } from "@/app/layout";

export const metadata = {
    title: getMetadataTitle("Jobbe i utlandet"),
};

export default function Page() {
    return <JobbeIUtlandet />;
}
