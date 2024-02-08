import { notFound } from "next/navigation";
import Ad from "./_components/Ad";
import { getStillingDescription, getStillingTitle } from "./_components/getMetaData";

export const excludes = [
    "administration",
    "categoryList",
    "created",
    "createdBy",
    "employer.id",
    "employer.uuid",
    "employer.mediaList",
    "employer.contactList",
    "employer.createdBy",
    "employer.updatedBy",
    "employer.created",
    "employer.updated",
    "employer.deactivated",
    "employer.employees",
    "employer.orgform",
    "employer.orgnr",
    "employer.parentOrgnr",
    "employer.properties",
    "employer.publicName",
    "employer.status",
    "geopoint",
    "mediaList",
    "privacy",
    "location.latitude",
    "location.longitude",
    "location.county",
    "occupationList",
    "properties.author",
    "properties.industry",
    "properties.keywords",
    "properties.occupation",
    "properties.searchtags",
    "properties.sourceupdated",
    "updatedBy",
    "uuid",
].join(",");

async function fetchAd(id) {
    const res = await fetch(`${process.env.PAMSEARCHAPI_URL}/stillingsok/ad/ad/${id}?_source_excludes=${excludes}`, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (res.status === 404) {
        notFound();
    }
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

export async function generateMetadata({ params }) {
    const data = await fetchAd(params.id);
    const isFinn = data._source && data._source.source && data._source.source.toLowerCase() === "finn";

    return {
        title: getStillingTitle(data._source),
        description: getStillingDescription(data._source),
        openGraph: {
            title: getStillingTitle(data._source),
            description: getStillingDescription(data._source),
            images: [
                {
                    url: "https://arbeidsplassen.nav.no/images/arbeidsplassen-open-graph.png",
                    width: 1200,
                    height: 630,
                },
            ],
        },
        robots: data && data._source.status !== "ACTIVE" ? "noindex" : "",
        alternates: {
            canonical: isFinn ? data._source.properties.sourceurl : "",
        },
    };
}

export default async function Page({ params }) {
    const ad = await fetchAd(params.id);
    const shareAdRedirectUrl = `${process.env.ARBEIDSPLASSEN_URL}/stillinger/stilling/${params.id}`;

    return <Ad ad={ad} shareAdRedirectUrl={shareAdRedirectUrl} />;
}
