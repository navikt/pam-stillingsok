import { getDefaultHeaders } from "@/app/_common/utils/fetch";
import { unstable_cache } from "next/cache";

export interface Postcode {
    postcode: string;
    city: string;
}

interface PostdataDto {
    postkode: string;
    by: string;
    // kommune: KommuneDTO
    // fylke: FylkeDTO
}

async function fetchPostcodes(): Promise<Postcode[]> {
    const res = await fetch(`${process.env.PAM_GEOGRAFI_API_URL}/postdata?sort=asc`, {
        headers: getDefaultHeaders(),
    });

    if (!res.ok) {
        throw new Error("Failed to fetch postcode data");
    }

    const data: PostdataDto[] = await res.json();

    return data.map((postdata) => ({
        postcode: postdata.postkode,
        city: postdata.by,
    }));
}

export const fetchCachedPostcodes = unstable_cache(async () => fetchPostcodes(), ["postcodes-query"], {
    revalidate: 3600,
});