import { ReactElement } from "react";
import ShowInterestPage from "./_components/ShowInterestPage";
import { getDirApiOboHeaders } from "@/app/muligheter/_common/auth/auth";
import { PageBlock } from "@navikt/ds-react/Page";
import { Metadata } from "next";
import { getAdData } from "@/app/stillinger/stilling/_data/adDataActions";
import { getStillingDescription } from "@/app/stillinger/stilling/[id]/_components/getMetaData";
import { getMeldInteresseTitle } from "@/app/muligheter/mulighet/[id]/muligheterMetadata";

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const params = await props.params;
    const stilling = await getAdData(params.id);

    return {
        title: getMeldInteresseTitle(stilling.title),
        description: getStillingDescription(stilling),
        robots: "noindex, nofollow",
    };
}

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
