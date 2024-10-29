"use server";

import { getDefaultHeaders } from "@/app/_common/utils/fetch";
import { ApiResponse } from "@/app/stilling/_data/types";
import logger from "@/app/_common/utils/logger";
import { MappedAdDTO, transformed } from "@/app/lib/stillingSoekSchema";

// Expose only necessary data to client
const sourceIncludes = [
    "businessName",
    "contactList.email",
    "contactList.name",
    "contactList.phone",
    "contactList.title",
    "employer.name",
    "employer.orgnr",
    "employer.locationList.postalCode",
    "employer.locationList.city",
    "employer.locationList.address",
    "employer.locationList.municipal",
    "employer.locationList.country",
    "employer.location.city", // todo finnes employer dataene lengre?,
    "employer.location.county", // todo finnes employer dataene lengre?,
    "employer.location.country", // todo finnes employer dataene lengre?,
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
    "properties.adtextFormat",
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
    "properties.jobpercentagerange",
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
    "categoryList", // For debugging
    "properties.searchtags", // For debugging
    "properties.needDriversLicense", // For debugging
    "properties.under18", // For debugging
    "properties.education", // For debugging
    "properties.experience", // For debugging
    "properties.experience", // For debugging
].join(",");

/**
 * Returns a javascript object containing job posting data
 * @param id - the id of job posting
 * @returns Promise<Response<MappedAdDTO>>
 */
export async function getAdData(id: string): Promise<ApiResponse<MappedAdDTO>> {
    try {
        const res = await fetch(
            `${process.env.PAMSEARCHAPI_URL}/stillingsok/ad/ad/${id}?_source_includes=${sourceIncludes}`,
            {
                headers: getDefaultHeaders(),
                next: { revalidate: 60 },
            },
        );

        if (!res.ok) {
            return {
                status: res.status,
                success: false,
                errorMessage: `Klarte ikke hente data. Status: ${res.status}`,
            };
        }

        const json = await res.json();

        const validatedData = transformed.safeParse(json);

        if (!validatedData.success) {
            logger.error("ZodError: stillingsøk model samsvarer ikke", validatedData?.error);
            return {
                status: res.status,
                success: false,
                errorMessage: "ZodError",
                error: validatedData.error,
            };
        }

        const { data } = validatedData;

        return {
            status: res.status,
            success: true,
            data: data,
        };
    } catch (error) {
        logger.error("Stillingssøk feilet", error);
        return {
            status: 500,
            success: false,
            errorMessage: "En feil skjedde ved henting av data",
            error: error,
        };
    }
}
