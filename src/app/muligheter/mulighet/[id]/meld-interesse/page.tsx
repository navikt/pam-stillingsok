import { ReactElement } from "react";
import ShowInterestPage from "./_components/ShowInterestPage";
import { getDirApiOboHeaders } from "@/app/muligheter/_common/auth/auth";
import { PageBlock } from "@navikt/ds-react/Page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Interesse meldt",
    description: "Du har nå delt din interesse med veileder",
    robots: "noindex, nofollow",
};

export default async function Page(props: { params: Promise<{ id: string }> }): Promise<ReactElement> {
    const { id } = await props.params;

    const headers = await getDirApiOboHeaders();
    const res = await fetch(`${process.env.PAM_DIR_API_URL}/rest/dir/${id}/interesse`, {
        headers: headers,
        method: "POST",
    });

    const success = res.ok;

    return (
        <PageBlock className="mt-12" width="text" gutters>
            <ShowInterestPage success={success} />
        </PageBlock>
    );
}
