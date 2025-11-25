import TilgangsstyringIStoreVirksomheter from "@/app/(artikler)/tilgangsstyring-i-store-virksomheter/TilgangsstyringIStoreVirksomheter";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import { Metadata } from "next";
import { buildArticleMetadata } from "@/app/(artikler)/buildArticleMetadata";

const articleMeta: ArticleMeta = {
    title: "Tilgangsstyring i store virksomheter",
    language: "nb",
    proofread: true,
    category: "employer-guides",
    description: "Veiledning i tilgangsstyring for store virksomheter med mange brukere og roller.",
    updatedAt: "2025-05-16",
};

export const metadata: Metadata = buildArticleMetadata({
    meta: articleMeta,
});

export default function Page() {
    return <TilgangsstyringIStoreVirksomheter meta={articleMeta} />;
}
