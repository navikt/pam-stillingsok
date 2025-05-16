import JobbeIUtlandet from "@/app/(artikler)/jobbe-i-utlandet/JobbeIUtlandet";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Jobbe i utlandet",
};

export default function Page() {
    return <JobbeIUtlandet />;
}
