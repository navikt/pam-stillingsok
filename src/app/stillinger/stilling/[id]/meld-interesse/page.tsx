import { ReactElement } from "react";
import ShowInterestPage from "@/app/stillinger/stilling/[id]/meld-interesse/_components/ShowInterestPage";
import { PageBlock } from "@navikt/ds-react/Page";

export default async function Page(): Promise<ReactElement> {
    return (
        <PageBlock className="mt-12" width="text" gutters>
            <ShowInterestPage />
        </PageBlock>
    );
}
