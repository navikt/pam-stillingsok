import { logger } from "@navikt/next-logger";
import { notFound } from "next/navigation";
import { validate as uuidValidate } from "uuid";
import { type AdDTO, elasticHitToAdDTOResult } from "@/app/stillinger/_common/lib/ad-model";
import { bestEffortFromHit } from "@/app/stillinger/_common/lib/ad-model/bestEffortFromHit";
import { logZodError } from "@/app/stillinger/_common/actions/LogZodError";
import { getDirApiOboHeaders } from "@/app/muligheter/_common/auth/auth";

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
const ENABLE_BEST_EFFORT = process.env.ENABLE_ADDTO_BEST_EFFORT === "true";

/**
 * Returns a javascript object containing job posting data
 * @param id - the id of job posting
 * @returns Promise<Response<AdDTOSchema>>
 */
export async function getInternalAdData(id: string): Promise<AdDTO> {
    if (!uuidValidate(id)) {
        notFound();
    }

    let headers;

    try {
        headers = await getDirApiOboHeaders();
    } catch {
        notFound();
    }

    const res = await fetch(
        `${process.env.PAM_DIR_API_URL}/rest/dir/osproxy/id/${id}?_source_includes=${sourceIncludes}`,
        {
            headers: headers,
            next: { revalidate: 60 },
        },
    );

    if (res.status === 404) {
        notFound();
    }

    if (!res.ok) {
        const errorMessage = `Hent stilling med id ${id} feilet, status: ${res.status}`;
        logger.error(errorMessage);
        return Promise.reject(errorMessage);
    }

    let json: unknown;

    try {
        json = await res.json();
    } catch (error) {
        logger.error(error, `Klarte ikke parse JSON for stilling [${id}]`);
        throw error; // rethrow her er OK – dette er ikke en “lokal throw”
    }

    const validatedData = elasticHitToAdDTOResult(json);

    if (validatedData.ok) {
        return validatedData.data;
    }

    const parseError = validatedData.error;
    logZodError(parseError);

    if (ENABLE_BEST_EFFORT) {
        const fallback = bestEffortFromHit(json);
        if (fallback) {
            return fallback as AdDTO;
        }
    }
    throw new Error(`Validering av stilling feilet [${id}]: ${validatedData.error.summary}`);
}
