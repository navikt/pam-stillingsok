"use server";

import { notFound } from "next/navigation";
import { getDefaultHeaders } from "@/app/_common/utils/fetch";
import mapAdData from "./adData";

// Expose only necessary data to client
const sourceIncludes = [
    "businessName",
    "contactList.email",
    "contactList.name",
    "contactList.phone",
    "contactList.title",
    "employer.name",
    "employer.locationList.postalCode",
    "employer.locationList.city",
    "employer.locationList.address",
    "employer.locationList.municipal",
    "employer.locationList.country",
    "employer.location.city" /* todo finnes employer dataene lengre?*/,
    "employer.location.county" /* todo finnes employer dataene lengre?*/,
    "employer.location.country" /* todo finnes employer dataene lengre?*/,
    "expires",
    "id",
    "locationList.postalCode",
    "locationList.city",
    "locationList.address",
    "locationList.municipal",
    "locationList.county",
    "locationList.country",
    "medium",
    "properties.adtext",
    "properties.address",
    "properties.applicationdue",
    "properties.applicationemail",
    "properties.applicationurl",
    "properties.employer",
    "properties.employerdescription",
    "properties.employerhomepage",
    "properties.engagementtype",
    "properties.extent",
    "properties.facebookpage",
    "properties.hasInterestform",
    "properties.jobarrangement",
    "properties.jobpercentage",
    "properties.jobtitle",
    "properties.linkedinpage",
    "properties.location",
    "properties.positioncount",
    "properties.remote",
    "properties.sector",
    "properties.sourceurl",
    "properties.starttime",
    "properties.twitteraddress",
    "properties.workday",
    "properties.workhours",
    "properties.workLanguage",
    "published",
    "reference",
    "source",
    "status",
    "title",
    "updated",
].join(",");

export async function getAdData(id) {
    const res = await fetch(
        `${process.env.PAMSEARCHAPI_URL}/stillingsok/ad/ad/${id}?_source_includes=${sourceIncludes}`,
        {
            headers: getDefaultHeaders(),
            next: { revalidate: 60 },
        },
    );

    if (res.status === 404) {
        return {
            success: false,
            error: "not_found",
        };
    }
    if (!res.ok) {
        throw new Error("Failed to fetch data");
        return {
            success: false,
            error: "error",
        };
    }

    return {
        success: true,
        data: mapAdData(await res.json()),
    };
}
