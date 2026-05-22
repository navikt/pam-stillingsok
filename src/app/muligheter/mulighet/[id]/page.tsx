import type { Metadata } from "next";
import type { SearchParams } from "next/dist/server/request/search-params";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { appLogger } from "@/app/_common/logging/appLogger";
import { checkMuligheterAccess } from "@/app/muligheter/_common/auth/checkAccess.server";
import Mulighet from "@/app/muligheter/mulighet/[id]/_components/Mulighet";
import { getInternalAdData } from "@/app/muligheter/mulighet/[id]/_utils/mulighetAdDataActions";
import { getStillingDescription } from "@/app/stillinger/stilling/[id]/_components/getMetaData";

type Params = Promise<{ id: string }>;

type PageProps = {
    params: Params;
    searchParams: SearchParams;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const genericMetadata: Metadata = {
        title: "Reservert stilling",
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

    if (process.env.MULIGHETER_ENABLED !== "true") {
        return genericMetadata;
    }

    const hasAccess = await checkMuligheterAccess();
    if (!hasAccess) {
        return genericMetadata;
    }

    const params = await props.params;
    const response = await getInternalAdData(params.id);
    const muligheterTitle = response ? response?.title : null;

    const data = response || undefined;
    return {
        ...genericMetadata,
        title: muligheterTitle ? muligheterTitle : "Reservert stilling",
        description: getStillingDescription(data),
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

    const hasAccess = await checkMuligheterAccess();
    if (!hasAccess) {
        notFound();
    }

    const response = await getInternalAdData(params.id);
    return <Mulighet adData={response} />;
}
