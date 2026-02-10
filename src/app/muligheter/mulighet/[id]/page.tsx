import { ReactElement } from "react";
import { SearchParams } from "next/dist/server/request/search-params";
import { getInternalAdData } from "@/app/muligheter/mulighet/[id]/internalAdDataActions";
import Mulighet from "@/app/muligheter/mulighet/[id]/Mulighet";
import { Metadata } from "next";
import { getStillingDescription } from "@/app/stillinger/stilling/[id]/_components/getMetaData";

type Params = Promise<{ id: string }>;

type PageProps = {
    params: Params;
    searchParams: SearchParams;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const response = await getInternalAdData(params.id);
    const muligheterTitle = response ? response?.title : null;

    const data = response || undefined;
    return {
        title: muligheterTitle ? muligheterTitle : "Mulighet",
        description: getStillingDescription(data),
        robots: "noindex, nofollow",
    };
}

export default async function Page(props: PageProps): Promise<ReactElement> {
    const params = await props.params;
    const response = await getInternalAdData(params.id);
    return <Mulighet adData={response} />;
}
