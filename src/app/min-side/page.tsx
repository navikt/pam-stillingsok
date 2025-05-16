import MinSidePage from "@/app/min-side/_common/components/MinSidePage";
import { ensureUserLoggedIn } from "@/app/min-side/_common/utils/ensureUserLoggedIn";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: "Min side",
};

export default async function Page() {
    await ensureUserLoggedIn();
    return <MinSidePage />;
}
