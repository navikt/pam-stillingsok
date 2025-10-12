import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import logger from "@/app/stillinger/_common/utils/logger";
import {
    StillingDetaljer,
    transformElasticRawToAdData,
    transformAdData,
} from "@/app/stillinger/_common/lib/stillingSchema";
import { notFound } from "next/navigation";
import { logZodError } from "@/app/stillinger/_common/actions/LogZodError";
import { isNotFoundError } from "next/dist/client/components/not-found";
import { validate as uuidValidate } from "uuid";

// Expose only necessary data to client
const sourceIncludes = [
    "businessName",
    "contactList.email",
    "contactList.name",
    "contactList.phone",
    "contactList.title",
    "employer.name",
    "employer.orgnr",
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
    "compositeAdVector",
].join(",");

/**
 * Returns a javascript object containing job posting data
 * @param id - the id of job posting
 * @returns Promise<Response<StillingDetaljer>>
 */
export async function getAdData(id: string): Promise<StillingDetaljer> {
    if (!uuidValidate(id)) {
        notFound();
    }

    try {
        const headers = await getDefaultHeaders();
        const res = await fetch(`${process.env.PAMSEARCHAPI_URL}/api/ad/${id}?_source_includes=${sourceIncludes}`, {
            headers: headers,
            next: { revalidate: 60 },
        });

        if (res.status === 404) {
            notFound();
        }

        if (!res.ok) {
            const errorMessage = `Hent stilling med id ${id} feilet, status: ${res.status}`;
            logger.error(errorMessage);
            return Promise.reject(errorMessage);
        }

        const json = await res.json();

        const validatedData = transformElasticRawToAdData.safeParse(json);

        if (!validatedData.success) {
            logZodError(id, validatedData.error);

            return transformAdData(json._source, json._id, json._properties);
        }

        return validatedData.data;
    } catch (error) {
        if (isNotFoundError(error)) {
            logger.info(`Stilling ikke funnet: ${id}`, error);
        } else {
            logger.error(`Stilling feilet: ${id}`, error);
        }

        throw error;
    }
}
