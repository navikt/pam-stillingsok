import { notFound } from "next/navigation";
import Ad from "./_components/Ad";
import { STILLINGSOK_URL } from "../../../_common/environment";
import { getStillingDescription, getStillingTitle } from "./_components/getMetaData";

const sourceExcludes = [
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

const host = process.env.PAMSEARCHAPI_URL ? process.env.PAMSEARCHAPI_URL : "http://pam-search-api";

async function fetchAd(id) {
    const res = await fetch(`${host}/stillingsok/ad/ad/${id}?_source_excludes=${sourceExcludes}`, {
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
    };
}

export default async function Page({ params }) {
    const ad = await fetchAd(params.id);

    // Todo: Sørg for at STILLINGSOK_URL variabel virker
    const shareAdRedirectUrl = `${STILLINGSOK_URL}/stilling/${params.id}`;

    return <Ad ad={ad} shareAdRedirectUrl={shareAdRedirectUrl} />;
}
