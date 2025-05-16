import MinSidePage from "@/app/min-side/_common/components/MinSidePage";
import { ensureUserLoggedIn } from "@/app/min-side/_common/utils/ensureUserLoggedIn";

export const metadata = {
    title: "Min side",
};

export default async function Page() {
    await ensureUserLoggedIn();
    return <MinSidePage />;
}
