import { ReactElement } from "react";
import { SearchParams } from "next/dist/server/request/search-params";
import { getInternalAdData } from "@/app/muligheter/mulighet/[id]/_utils/mulighetAdDataActions";
import Mulighet from "@/app/muligheter/mulighet/[id]/_components/Mulighet";
import { Metadata } from "next";
import { getStillingDescription } from "@/app/stillinger/stilling/[id]/_components/getMetaData";
import { notFound } from "next/navigation";
import { appLogger } from "@/app/_common/logging/appLogger";

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
        robots: {
            index: false,
            follow: false,
            nocache: true,
            googleBot: {
                index: false,
                follow: false,
                noimageindex: true,
            },
        },
    };
}

export default async function Page(props: PageProps): Promise<ReactElement> {
    const params = await props.params;

    if (process.env.MULIGHETER_ENABLED !== "true") {
        appLogger.warn(
            `Muligheter error - Har prøvd å aksessere /muligheter/mulighet/${params.id}, men feature er deaktivert.`,
        );
        notFound();
    }

    const response = await getInternalAdData(params.id);
    return <Mulighet adData={response} />;
}
