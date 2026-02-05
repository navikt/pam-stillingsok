import { ReactElement } from "react";
import { SearchParams } from "next/dist/server/request/search-params";
import { getInternalAdData } from "@/app/muligheter/mulighet/[id]/internalAdDataActions";
import Mulighet from "@/app/muligheter/mulighet/[id]/Mulighet";

type Params = Promise<{ id: string }>;

type PageProps = {
    params: Params;
    searchParams: SearchParams;
};

export default async function Page(props: PageProps): Promise<ReactElement> {
    const params = await props.params;
    const response = await getInternalAdData(params.id);
    return <Mulighet adData={response} />;
}
