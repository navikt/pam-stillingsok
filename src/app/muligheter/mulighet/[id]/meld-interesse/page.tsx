import { ReactElement } from "react";
import { PageBlock } from "@navikt/ds-react/Page";
import ShowInterestPage from "./_components/ShowInterestPage";

export default async function Page(): Promise<ReactElement> {
    return (
        <PageBlock className="mt-12" width="text" gutters>
            <ShowInterestPage />
        </PageBlock>
    );
}
