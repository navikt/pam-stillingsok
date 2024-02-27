import { notFound } from "next/navigation";

const excludes = [
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

export async function fetchAd(id) {
    const res = await fetch(`${process.env.PAMSEARCHAPI_URL}/stillingsok/ad/ad/${id}?_source_excludes=${excludes}`, {
        headers: {
            "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
        // TODO: figure out how often this should be revalidated
    });

    if (res.status === 404) {
        notFound();
    }
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}
